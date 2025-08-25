import { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useResetPassword } from "../../hooks/auth/useResetPassword";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ResetPasswordModal({ open, onClose }: Props) {
  const [email, setEmail] = useState("");
  const { resetPassword, loading } = useResetPassword();

  useEffect(() => {
    if (open) setEmail("");
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (!email.trim()) return;
    const ok = await resetPassword(email.trim());
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-lg bg-white p-5 shadow-lg dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Quên mật khẩu
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          Nhập email của bạn. Hệ thống sẽ gửi liên kết đặt lại mật khẩu nếu
          email tồn tại.
        </p>

        <div className="space-y-4">
          <div>
            <Label>
              Email <span className="text-error-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !email.trim()}>
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
