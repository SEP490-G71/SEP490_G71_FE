// src/hooks/patient/usePatientDetail.ts
import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { Patient } from "../../types/Admin/Patient-Management/PatientManagement";

const usePatientDetail = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPatientDetail = async (id: string) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/patients/${id}`);
      const result = res.data?.result;
      if (result) {
        setPatient(result as Patient);
      } else {
        setPatient(null);
      }
    } catch (err) {
      console.error("❌ Lỗi khi lấy thông tin bệnh nhân:", err);
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    patient,
    loading,
    fetchPatientDetail,
  };
};

export default usePatientDetail;
