import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

export interface AppointmentFormRequest {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  email: string;
  phoneNumber: string;
  registeredAt: string;
  message?: string;
}

export const useAppointmentForm = () => {
  const [loading, setLoading] = useState(false);

  const submitAppointment = async (form: AppointmentFormRequest) => {
    setLoading(true);
    try {
      await axiosInstance.post("/registered-online", form);

      toast.success("Đặt lịch khám thành công!");
      return true;
    } catch (error: any) {
      const beMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Lỗi khi đặt lịch khám";
      toast.error(beMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitAppointment,
  };
};
