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
        await axiosInstance.put(`/medical-services/${selectedServiceId}`, formData);
        toast.success("Updated successfully");
      } else {
        await axiosInstance.post(`/medical-services`, formData);
        toast.success("Created successfully");
      }

      console.log("🔍 Form Data gửi đi:", formData);
      return true;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message 
        "An error occurred while saving";

      toast.error(errorMessage);
      return false;
    }
  };

  return { updateMedicalService };
};
