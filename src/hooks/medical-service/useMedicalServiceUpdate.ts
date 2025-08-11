import { toast } from "react-toastify";
import axiosInstance from "../../services/axiosInstance";
import { CreateMedicalServiceRequest } from "../../types/Admin/MedicalService/MedicalService";

export const useMedicalServiceUpdate = () => {
  const updateMedicalService = async (
    formData: CreateMedicalServiceRequest,
    selectedServiceId?: string
  ) => {
    try {
      if (selectedServiceId) {
        await axiosInstance.put(
          `/medical-services/${selectedServiceId}`,
          formData
        );
        toast.success("Cập nhật dịch vụ y tế thành công");
      } else {
        await axiosInstance.post(`/medical-services`, formData);
        toast.success("Tạo mới dịch vụ y tế thành công");
      }

      console.log("Form Data gửi đi:", formData);
      return true;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Đã xảy ra lỗi khi lưu dịch vụ y tế";
      toast.error(errorMessage);
      return false;
    }
  };

  return { updateMedicalService };
};
