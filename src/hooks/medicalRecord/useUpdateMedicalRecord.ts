import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
export interface UpdateMedicalRecordPayload {
  medicalRecordId: string;
  diagnosisText: string;
  summary: string;
  temperature: number;
  respiratoryRate: number;
  bloodPressure: string;
  heartRate: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  spo2: number;
  notes: string;
}

export const useUpdateMedicalRecord = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const updateMedicalRecord = async (payload: UpdateMedicalRecordPayload) => {
    setLoading(true);

    try {
      const {
        medicalRecordId,
        diagnosisText,
        summary,
        temperature,
        respiratoryRate,
        bloodPressure,
        heartRate,
        heightCm,
        weightKg,
        bmi,
        spo2,
        notes,
      } = payload;

      const res = await axiosInstance.put(
        `/medical-records/${medicalRecordId}`,
        {
          diagnosisText,
          summary,
          temperature,
          respiratoryRate,
          bloodPressure,
          heartRate,
          heightCm,
          weightKg,
          bmi,
          spo2,
          notes,
        }
      );

      toast.success("✅ Cập nhật hồ sơ khám thành công");
      return res.data.result;
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật hồ sơ khám:", error);
      toast.error("❌ Cập nhật hồ sơ khám thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateMedicalRecord,
    loading,
  };
};

export default useUpdateMedicalRecord;
