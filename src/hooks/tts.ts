export type ViettelTtsOptions = {
  voice?: string;     
  speed?: number;     
  returnOption?: 0 | 1 | 2 | 3|5; 
  withoutFilter?: boolean;
};

export async function speakWithViettel(
  text: string,
  opts: ViettelTtsOptions = {}
): Promise<string> {
  const url = import.meta.env.VITE_VIETTEL_TTS_URL as string;
  const token = import.meta.env.VITE_VIETTEL_AI_TOKEN as string;

  const body = {
    text,
    voice: opts.voice ?? (import.meta.env.VITE_VIETTEL_TTS_VOICE || "hn-quynhanh"),
    speed: opts.speed ?? 0.8,
    tts_return_option: opts.returnOption ?? 5,
    token,
    without_filter: opts.withoutFilter ?? false,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    const errText = contentType.includes("application/json")
      ? JSON.stringify(await res.json()).slice(0, 500)
      : await res.text();
    throw new Error(`TTS ${res.status}: ${errText}`);
  }

  if (contentType.includes("application/json")) {
    const data = await res.json();
    const audioUrl =
      data?.data?.url || data?.url || data?.link ||
      (data?.data && typeof data.data === "string"
        ? (data.data.startsWith("data:")
            ? data.data
            : `data:audio/mpeg;base64,${data.data}`)
        : null);

    if (!audioUrl) throw new Error("TTS: không tìm thấy URL/base64 audio trong response");

    const audio = new Audio(audioUrl);
    try { await audio.play(); } catch {}
    return audioUrl;
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const audio = new Audio(objectUrl);
  try { await audio.play(); } catch {}
  return objectUrl;
}
