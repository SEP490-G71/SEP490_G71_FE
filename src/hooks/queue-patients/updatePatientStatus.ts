import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

const updatePatientStatus = async (queueId: string, status: string) => {
  try {
    const response = await axiosInstance.put(
      `/queue-patients/status/${queueId}`,
      { status }
    );

    toast.success("✅ Cập nhật trạng thái bệnh nhân thành công");
    return response.data.result;
  } catch (error: any) {
    console.error("❌ Lỗi khi cập nhật trạng thái bệnh nhân:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.title || // fallback nếu dùng .NET
      "Không thể cập nhật trạng thái bệnh nhân.";

    toast.error(`❌ ${errorMessage}`);
    throw error;
  }
};

export default updatePatientStatus;
