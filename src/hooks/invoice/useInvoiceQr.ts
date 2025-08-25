import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axiosInstance";

function isAbsoluteUrl(s: string) {
  return /^https?:\/\//i.test(s);
}
function looksLikeBase64(s: string) {
  const compact = s.replace(/\s+/g, "");
  return /^[A-Za-z0-9+/=]+$/.test(compact) && compact.length >= 100;
}
function joinUrl(base: string, path: string) {
  if (!base) return path;
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
function sanitizeUrl(s: string) {
  const t = (s || "").trim();
  try {
    return encodeURI(t);
  } catch {
    return t.replace(/\s/g, "%20");
  }
}

function pickUrlFromJson(data: any): string | null {
  const candidates: any[] = [
    data,
    data?.result,
    data?.data,
    data?.url,
    data?.link,
    data?.qrUrl, // API của bạn trả ở đây
    data?.qr,
    data?.qrImage,
    data?.qrBase64,
    data?.image,
    data?.imageUrl,
    data?.imageBase64,
    data?.payload,
  ].filter((x) => x != null);

  for (const c of candidates) {
    if (typeof c === "string") {
      const s = c.trim();
      if (s.startsWith("data:")) return s; 
      if (isAbsoluteUrl(s)) return sanitizeUrl(s);
      if (looksLikeBase64(s)) return `data:image/png;base64,${s}`;
      if (s.startsWith("/")) {
        const base = (axiosInstance.defaults as any)?.baseURL || "";
        return sanitizeUrl(joinUrl(base, s));
      }
    } else if (typeof c === "object") {
      const deep =
        c?.url ??
        c?.link ??
        c?.data ??
        c?.base64 ??
        c?.image ??
        c?.imageUrl ??
        c?.imageBase64 ??
        c?.qrUrl;
      if (typeof deep === "string") {
        return pickUrlFromJson(deep as any);
      }
    }
  }
  return null;
}

const useInvoiceQr = () => {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [errorQr, setErrorQr] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const clearQr = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setQrUrl(null);
    setErrorQr(null);
  }, []);

  const fetchInvoiceQr = useCallback(async (invoiceId: string) => {
    if (!invoiceId) {
      setErrorQr("Thiếu invoiceId.");
      return;
    }
    setLoadingQr(true);
    setErrorQr(null);

    try {
      const res = await axiosInstance.get(`/invoices/${invoiceId}/qr`, {
        responseType: "blob",
      });

      const blob: Blob = res.data;
      const contentType =
        (res.headers && (res.headers as any)["content-type"]) ||
        blob.type ||
        "";

      // Trường hợp server trả JSON/Text (chứa qrUrl/base64)
      if (contentType.includes("application/json") || contentType.includes("text/")) {
        const text = await blob.text();
        let json: any = null;

        try {
          json = JSON.parse(text);
        } catch {
          // Có thể server trả base64 trần
          if (looksLikeBase64(text)) {
            setQrUrl(`data:image/png;base64,${text.trim()}`);
            return;
          }
          throw new Error("Phản hồi không phải JSON hợp lệ.");
        }

        const found = pickUrlFromJson(json);
        if (!found) {
          throw new Error("Không tìm thấy URL/base64 trong phản hồi QR.");
        }

        // clear objectURL cũ nếu có
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }

        setQrUrl(found);
        return;
      }

      // Trường hợp là ảnh nhị phân (image/png, image/jpeg…)
      if (blob.size > 0) {
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
        }
        const obj = URL.createObjectURL(blob);
        objectUrlRef.current = obj;
        setQrUrl(obj);
        return;
      }

      throw new Error("QR rỗng hoặc không hợp lệ.");
    } catch (err: any) {
      console.error("❌ Lỗi khi lấy QR invoice:", err);
      setErrorQr(
        typeof err?.message === "string"
          ? err.message
          : "Không thể tải QR hóa đơn."
      );
      setQrUrl(null);
    } finally {
      setLoadingQr(false);
    }
  }, []);

  // Dọn objectURL khi unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  return { qrUrl, loadingQr, errorQr, fetchInvoiceQr, clearQr };
};

export default useInvoiceQr;
