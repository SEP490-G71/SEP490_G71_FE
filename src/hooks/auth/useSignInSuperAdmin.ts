import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axiosInstanceSuperAdmin from "../../services/axiosInstanceSuperAdmin";

export const useSignInSuperAdmin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signInSuperAdmin = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await axiosInstanceSuperAdmin.post("/auth/login", {
        username,
        password,
      });

      const token =
        res.data?.result?.token ||
        res.data?.token ||
        res.headers?.authorization?.replace(/^Bearer\s+/i, "");

      if (!token) throw new Error("Không nhận được token");
      localStorage.setItem("sa_token", token);

      toast.success("Đăng nhập SUPERADMIN thành công!");
      navigate("/superadmin/dashboard");
      return true;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Đăng nhập SUPERADMIN thất bại";
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOutSuperAdmin = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return { signInSuperAdmin, signOutSuperAdmin, loading };
};
