import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { RoleType } from "../../enums/Role/RoleType";
import { useNavigate } from "react-router";

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roleRedirectMap: Record<RoleType | string, string> = {
    ADMIN: "/admin/dashboard",
    DOCTOR: "/admin/medical-examination",
    CASHIER: "/admin/medical-examination/billing",
    RECEPTIONIST: "/admin/register-medical-examination",
    TECHNICIAN: "/admin/medical-examination/clinical",
    PATIENT: "/patient/examinationHistory",
    user: "/admin/medical-examination",
  };

  const signIn = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // 1) Login
      const res = await axiosInstance.post("/auth/login", {
        username,
        password,
      });

      // 2) Lấy token
      const token = res.data?.result?.token || res.data?.token;
      if (!token) throw new Error("Không nhận được token");
      localStorage.setItem("token", token);

      // 3) Lấy thông tin user
      const infoRes = await axiosInstance.get("/accounts/myInfo");
      if (infoRes.data?.code !== 1000 || !infoRes.data?.result) {
        throw new Error("Không thể lấy thông tin người dùng");
      }

      const roles: string[] = infoRes.data.result.roles || [];
      const priorityOrder = [
        "ADMIN",
        "DOCTOR",
        "CASHIER",
        "RECEPTIONIST",
        "TECHNICIAN",
        "PATIENT",
        "user",
      ];
      const redirectRole =
        priorityOrder.find((r) => roles.includes(r)) || "user";
      const redirectPath = roleRedirectMap[redirectRole];

      toast.success("Đăng nhập thành công!");
      navigate(redirectPath);
      return true;
    } catch (err: any) {
      // 🔧 Sửa: chỉ bắn toast, KHÔNG throw để tránh bubble lên form gây alert/reload
      const msg = err?.response?.data?.message || "Đăng nhập thất bại";
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading };
};
