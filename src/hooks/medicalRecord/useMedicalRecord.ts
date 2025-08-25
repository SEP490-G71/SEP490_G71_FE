import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

// Kiểu dịch vụ trong danh sách kê đơn
export interface MedicalServiceRow {
  serviceId: string | null;
  quantity: number;
}

interface SubmitPayload {
  patientId: string;
  staffId: string;
  visitId: string;
  diagnosisText: string;
  temperature?: number | null;
  respiratoryRate?: number | null;
  bloodPressure: string;
  heartRate?: number | null;
  heightCm?: number | null;
  weightKg?: number | null;
  bmi?: number | null;
  spo2?: number | null;
  notes: string;
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

      const res = await axiosInstance.post("/medical-records",
        {
          patientId: payload.patientId,
          staffId: payload.staffId,
          visitId: payload.visitId,
          diagnosisText: payload.diagnosisText || "Chẩn đoán: chưa nhập",
          temperature: payload.temperature,
          respiratoryRate: payload.respiratoryRate,
          bloodPressure: payload.bloodPressure,
          heartRate: payload.heartRate,
          heightCm: payload.heightCm,
          weightKg: payload.weightKg,
          bmi: payload.bmi,
          spo2: payload.spo2,
          notes: payload.notes,
          services: cleanedServices,
        }
      );

      // toast.success("Lưu thông tin khám bệnh thành công");
      setSubmittedData(res.data.result || null);
    } catch (error: any) {
  console.error("❌ Lỗi khi gửi dữ liệu khám bệnh:", error);

  const errorMessage =
    error?.response?.data?.message ||
    error?.response?.data?.title ||
    error?.message ||
    "Gửi dữ liệu khám bệnh thất bại";

  toast.error(`❌ ${errorMessage}`);
}
 finally {
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
