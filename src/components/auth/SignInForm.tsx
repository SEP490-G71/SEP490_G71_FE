import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useSignIn } from "../../hooks/auth/useSignIn"; // <-- thêm dòng này

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading } = useSignIn(); // <-- hook đăng nhập

  const handleSubmit = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault(); // Nếu e có thì chặn reload
    try {
      await signIn(email, password);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Trang chủ
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8 text-center">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Đăng Nhập
            </h1>
          </div>
          <form>
            <div className="space-y-6">
              <div>
                <Label>
                  Tên đăng nhập <span className="text-error-500">*</span>{" "}
                </Label>
                <Input
                  placeholder="info@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>
                  Mật khẩu <span className="text-error-500">*</span>{" "}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Link
                  to="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Quên Mật Khẩu
                </Link>
              </div>
              <div>
                <Button
                  className="w-full"
                  size="sm"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Bạn chưa có tài khoản?{" "}
              <Link
                to="/signup"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Đăng ký
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
