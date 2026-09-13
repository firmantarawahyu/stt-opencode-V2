import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const AUTO_STOP_MS = 120_000;

export function tempDir(): string {
  const base = process.env.LOCALAPPDATA || os.tmpdir();
  const dir = path.join(base, "Temp", "opencode", "stt-opencode2");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function newOutFile(): string {
  return path.join(tempDir(), `voice-${Date.now()}.wav`);
}

export interface ActiveRecording {
  readonly tool: "sox" | "ffmpeg";
  readonly file: string;
  readonly startedAt: number;
  stop(): Promise<void>;
}

interface Spawned {
  proc: ChildProcess;
  failed: () => Error | null;
}

function spawnSox(file: string): Promise<Spawned> {
  return new Promise((resolve, reject) => {
    // NOTE (Windows): `sox -d` fails here with "no default audio device
    // configured". Explicit waveaudio device 0 works (verified live).
    // Device selection becomes user-configurable in Beta (mic picker).
    const proc = spawn("sox", ["-t", "waveaudio", "0", file], { windowsHide: true });
    let stderr = "";
    proc.stderr?.on("data", (d: Buffer) => {
      stderr += d.toString();
    });
    let exited: number | null = null;
    proc.once("error", reject);
    proc.once("spawn", () => resolve({ proc, failed: () => failed() }));
    proc.once("close", (code) => {
      exited = code ?? 0;
    });
    function failed(): Error | null {
      if (exited === null || exited === 0) return null;
      const detail = stderr.trim().split("\n").slice(-2).join(" ").trim();
      return new Error(`sox exited early (code ${exited})${detail ? `: ${detail}` : ""}`);
    }
  });
}

function listDshowAudio(): string[] {
  let stderr = "";
  try {
    execFileSync(
      "ffmpeg",
      ["-hide_banner", "-list_devices", "true", "-f", "dshow", "-i", "dummy"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
  } catch (err) {
    // Expected: the dummy input always fails. The device list is printed
    // to stderr before that failure.
    const e = err as { stderr?: string };
    stderr = typeof e.stderr === "string" ? e.stderr : "";
  }
  const names: string[] = [];
  const re = /"([^"]+)"\s*\(audio\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(stderr)) !== null) names.push(m[1]);
  return names;
}

function spawnFfmpeg(file: string): ActiveRecording {
  const devices = listDshowAudio();
  if (devices.length === 0) {
    throw new Error("No DirectShow audio devices found (ffmpeg fallback).");
  }
  const device = devices[0];
  const proc = spawn(
    "ffmpeg",
    ["-y", "-f", "dshow", "-i", `audio=${device}`, "-ac", "1", "-ar", "16000", file],
    { windowsHide: true, stdio: ["pipe", "ignore", "ignore"] },
  );
  let stopped = false;
  return {
    tool: "ffmpeg",
    file,
    startedAt: Date.now(),
    stop: () =>
      new Promise<void>((resolve) => {
        if (stopped) return resolve();
        stopped = true;
        proc.once("close", () => resolve());
        // Graceful quit finalizes the WAV header; force-kill fallback.
        try {
          proc.stdin?.write("q");
        } catch {
          proc.kill();
        }
        setTimeout(() => {
          try {
            proc.kill();
          } catch {
            /* already exited */
          }
          resolve();
        }, 3000);
      }),
  };
}

export async function startRecording(file: string): Promise<ActiveRecording> {
  try {
    const { proc, failed } = await spawnSox(file);
    let stopped = false;
    return {
      tool: "sox",
      file,
      startedAt: Date.now(),
      stop: () =>
        new Promise<void>((resolve, reject) => {
          if (stopped) return resolve();
          stopped = true;
          const early = failed();
          if (early) return reject(early);
          proc.once("close", () => {
            const late = failed();
            if (late) reject(late);
            else resolve();
          });
          proc.kill();
          setTimeout(() => resolve(), 3000);
        }),
    };
  } catch (err) {
    const missing =
      err instanceof Error && "code" in err && (err as { code?: string }).code === "ENOENT";
    if (!missing) throw err;
    return spawnFfmpeg(file);
  }
}
