
import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";


export const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", { username, password });
      
      const token = res.data?.result?.token || res.data?.token;
        console.log("Token:", token);
      if (token) {
        localStorage.setItem("token", token);
        toast.success("Đăng nhập thành công!");
        navigate("/admin/dashboard"); 
      } else {
        throw new Error("Không nhận được token");
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading };
};
