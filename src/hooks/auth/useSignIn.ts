import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { RoleType } from "../../enums/Role/RoleType";

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roleRedirectMap: Record<RoleType | string, string> = {
    ADMIN: "/admin/dashboard",
    DOCTOR: "/admin/medical-examination/clinical",
    CASHIER: "/admin/medical-examination/billing",
    RECEPTIONIST: "/admin/register-medical-examination",
    TECHNICIAN: "/admin/medical-examination/clinical",
    PATIENT: "/admin/medical-examination",
    user: "/admin/medical-examination",
  };

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", {
        username,
        password,
      });

      //  Lấy token từ kết quả
      const token = res.data?.result?.token || res.data?.token;
      if (!token) {
        throw new Error("Không nhận được token");
      }

      //  Lưu token vào localStorage
      localStorage.setItem("token", token);

      const infoRes = await axiosInstance.get("/accounts/myInfo");
      if (infoRes.data?.code !== 1000 || !infoRes.data?.result) {
        throw new Error("Không thể lấy thông tin người dùng");
      }

      const roles: string[] = infoRes.data.result.roles || [];

      const priorityOrder: string[] = [
        "ADMIN",
        "DOCTOR",
        "CASHIER",
        "RECEPTIONIST",
        "TECHNICIAN",
        "PATIENT",
        "user",
      ];

      //  Lấy role đầu tiên xuất hiện trong danh sách ưu tiên
      const redirectRole =
        priorityOrder.find((r) => roles.includes(r)) || "user";

      //  Lấy route tương ứng với role
      const redirectPath = roleRedirectMap[redirectRole];

      toast.success("Đăng nhập thành công!");
      navigate(redirectPath); //  SỬA 4: Điều hướng đến route tương ứng với vai trò chính
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Đăng nhập thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading };
};
