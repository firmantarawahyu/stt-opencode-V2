import { execFileSync } from "node:child_process";

// Windows-first clipboard (Alpha). Uses clip.exe so the exact bytes are
// copied with no trailing newline added. PowerShell Set-Clipboard is the
// fallback (it may normalize line endings, hence second choice).
export async function copyToClipboard(text: string): Promise<void> {
  if (!text) throw new Error("Nothing to copy (empty text).");
  if (process.platform !== "win32") {
    throw new Error(`Clipboard copy not supported on ${process.platform} (Alpha is Windows-first).`);
  }
  try {
    execFileSync("clip", { input: text, stdio: ["pipe", "ignore", "pipe"], windowsHide: true });
    return;
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    try {
      const b64 = Buffer.from(text, "utf8").toString("base64");
      execFileSync(
        "powershell",
        [
          "-NoProfile",
          "-NonInteractive",
          "-Command",
          `$t=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${b64}'));Set-Clipboard -Value $t`,
        ],
        { stdio: ["ignore", "ignore", "pipe"], windowsHide: true },
      );
      return;
    } catch {
      throw new Error(`Clipboard copy failed (clip: ${detail}).`);
    }
  }
}
