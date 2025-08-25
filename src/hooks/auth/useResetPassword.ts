import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

function detectTenant(): string {
  const saved =
    localStorage.getItem("tenant") || localStorage.getItem("X-Tenant-ID");
  if (saved) return saved;

  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return "test";
  const parts = host.split(".");
  return parts.length > 2 ? parts[0] : "test";
}

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const tenant = detectTenant();
      await axiosInstance.post(
        "/auth/reset-password",
        { email },
        { headers: { "X-Tenant-ID": tenant } }
      );
      toast.success("Đã gửi email đặt lại mật khẩu (nếu email tồn tại).");
      return true;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể gửi yêu cầu đặt lại mật khẩu";
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
};
