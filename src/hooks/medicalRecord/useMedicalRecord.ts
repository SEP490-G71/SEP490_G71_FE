import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

// Kiểu dịch vụ trong danh sách kê đơn
export interface MedicalServiceRow {
  serviceId: string | null;
  quantity: number;
}

// Payload gửi lên API
interface SubmitPayload {
  patientId: string;
  staffId: string;
  diagnosisText: string;
  services: MedicalServiceRow[];
}

export const useMedicalRecord = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  const submitExamination = async (payload: SubmitPayload) => {
    setLoading(true);

    try {
      const cleanedServices = payload.services
        .filter((s) => s.serviceId && s.quantity > 0)
        .map((s) => ({
          serviceId: s.serviceId,
          quantity: s.quantity,
        }));

      if (cleanedServices.length === 0) {
        toast.warning("Vui lòng chọn ít nhất 1 dịch vụ");
        return;
      }

      const res = await axiosInstance.post(
        "https://api.datnd.id.vn/medical-diagnosis/medical-records",
        {
          patientId: payload.patientId,
          staffId: payload.staffId,
          diagnosisText: payload.diagnosisText || "Chẩn đoán: chưa nhập",
          services: cleanedServices,
        }
      );

      toast.success("Lưu thông tin khám bệnh thành công");
      setSubmittedData(res.data.result || null);
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu khám bệnh:", error);
      toast.error("Gửi dữ liệu khám bệnh thất bại");
    } finally {
      setLoading(false);
    }
  };

  return {
    submitExamination,
    submittedData,
    loading,
    setLoading,
  };
};

export default useMedicalRecord;
