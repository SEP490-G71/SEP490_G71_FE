export type ViettelTtsOptions = {
  voice?: string;
  speed?: number;
  returnOption?: 0 | 1 | 2 | 3 | 5;
  withoutFilter?: boolean;
  signal?: AbortSignal;         // NEW: cho phép hủy phát
};

export async function speakWithViettel(
  text: string,
  opts: ViettelTtsOptions = {}
): Promise<void> {               // NEW: resolve khi audio kết thúc/abort
  const url = import.meta.env.VITE_VIETTEL_TTS_URL as string;
  const token = import.meta.env.VITE_VIETTEL_AI_TOKEN as string;

  const body = {
    text,
    voice: opts.voice ?? (import.meta.env.VITE_VIETTEL_TTS_VOICE || "hn-quynhanh"),
    speed: opts.speed ?? 0.8,
    tts_return_option: opts.returnOption ?? 2,
    token,
    without_filter: opts.withoutFilter ?? false,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: opts.signal, // nếu abort trước khi nhận audio
    body: JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    const errText = contentType.includes("application/json")
      ? JSON.stringify(await res.json()).slice(0, 500)
      : await res.text();
    throw new Error(`TTS ${res.status}: ${errText}`);
  }

  let audioUrl: string | null = null;
  if (contentType.includes("application/json")) {
    const data = await res.json();
    audioUrl =
      data?.data?.url || data?.url || data?.link ||
      (data?.data && typeof data.data === "string"
        ? data.data.startsWith("data:")
          ? data.data
          : `data:audio/mpeg;base64,${data.data}`
        : null);
  } else {
    const blob = await res.blob();
    audioUrl = URL.createObjectURL(blob);
  }
  if (!audioUrl) throw new Error("TTS: không tìm thấy URL/base64 audio");

  const audio = new Audio(audioUrl);

  // Promise kết thúc khi audio end / error / abort
  const finished = new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      opts.signal?.removeEventListener("abort", onAbort);
    };
    const onEnded = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error("Audio error")); };
    const onAbort = () => {
      try {
        audio.pause();
        // ngắt ngay lập tức
        audio.src = "";
        audio.load();
      } catch {}
      cleanup();
      // coi như resolve để vòng lặp dừng êm
      resolve();
    };
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    opts.signal?.addEventListener("abort", onAbort, { once: true });
  });

  try { await audio.play(); } catch {}   // autoplay có thể bị chặn – cứ để finished xử lý
  await finished;                        // CHỜ KHI KẾT THÚC
}
