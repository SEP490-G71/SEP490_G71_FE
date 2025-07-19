import { toast } from "react-toastify";
import axiosInstance from "../../services/axiosInstance";

export const useSendBirthdayEmail = () => {
  const sendBirthdayEmail = async (month: number) => {
    try {
      await axiosInstance.post("/patients/send-birthday", null, {
        params: { month },
      });
      toast.success(`🎉 Đã gửi email chúc mừng sinh nhật cho bệnh nhân sinh tháng ${month}`);
    } catch (error) {
      console.error(error);
      toast.error("❗ Gửi email thất bại. Vui lòng thử lại.");
    }
  };

  return { sendBirthdayEmail };
};
