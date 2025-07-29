import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

export interface AppointmentFormRequest {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string; // yyyy-MM-dd
  gender: "MALE" | "FEMALE" | "OTHER";
  email: string;
  phoneNumber: string;
  registeredAt: string; // ISO datetime
  message?: string;
}

export const useAppointmentForm = () => {
  const [loading, setLoading] = useState(false);

  const submitAppointment = async (form: AppointmentFormRequest) => {
    setLoading(true);
    try {
      await axiosInstance.post("/registered-online", form, {
        headers: {
          "X-Tenant-ID": "test",
        },
      });
      toast.success("Đặt lịch khám thành công!");
      return true;
    } catch (error) {
      toast.error("Lỗi khi đặt lịch khám");
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
