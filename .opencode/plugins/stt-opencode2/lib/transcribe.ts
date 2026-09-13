import fs from "node:fs";

export const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/audio/transcriptions";
export const GROQ_MODEL = "whisper-large-v3-turbo";

export type VoiceLang = "auto" | "id" | "en";

export class TranscribeError extends Error {
  readonly code: "missing-key" | "auth" | "rate-limit" | "too-large" | "request";
  readonly status?: number;
  constructor(code: TranscribeError["code"], message: string, status?: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

function apiKey(): string {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) {
    throw new TranscribeError(
      "missing-key",
      "GROQ_API_KEY is not set. Set it in your environment, then reopen the TUI.",
    );
  }
  return key;
}

export function toHumanError(err: unknown): string {
  if (err instanceof TranscribeError) return err.message;
  return err instanceof Error ? err.message : String(err);
}

export async function transcribe(file: string, language: VoiceLang = "auto"): Promise<string> {
  const key = apiKey();
  const stat = fs.statSync(file);
  if (stat.size === 0) {
    throw new TranscribeError("request", "Recording is empty (0 bytes). Try again.");
  }

  const bytes = fs.readFileSync(file);
  const form = new FormData();
  form.append("file", new Blob([bytes], { type: "audio/wav" }), "voice.wav");
  form.append("model", GROQ_MODEL);
  if (language !== "auto") form.append("language", language);

  let res: Response;
  try {
    res = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: form,
    });
  } catch (err) {
    throw new TranscribeError(
      "request",
      `Cannot reach Groq: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  if (!res.ok) {
    const body = (await res.text()).slice(0, 300).trim();
    if (res.status === 401) {
      throw new TranscribeError("auth", "Groq rejected the key (401). Check GROQ_API_KEY.", 401);
    }
    if (res.status === 429) {
      throw new TranscribeError("rate-limit", "Groq rate limit hit (429). Wait a minute and retry.", 429);
    }
    if (res.status === 413) {
      throw new TranscribeError("too-large", "Recording too large (413). Keep it under 120s.", 413);
    }
    throw new TranscribeError(
      "request",
      `Groq error ${res.status}${body ? `: ${body}` : ""}`,
      res.status,
    );
  }

  const json = (await res.json()) as { text?: string };
  const text = json.text?.trim() ?? "";
  if (!text) throw new TranscribeError("request", "Groq returned empty text. Try again.");
  return text;
}
