import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

const finishMedicalRecord = async (medicalRecordId: string) => {
  try {
    const response = await axiosInstance.put(
      `/medical-records/${medicalRecordId}/complete`
    );

    toast.success("✅ Đã kết thúc khám và cập nhật trạng thái hồ sơ");
    return response.data.result;
  } catch (error: any) {
    console.error("❌ Lỗi khi kết thúc khám:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.title ||
      "Không thể kết thúc khám.";

    toast.error(`❌ ${errorMessage}`);
    throw error;
  }
};

export default finishMedicalRecord;
