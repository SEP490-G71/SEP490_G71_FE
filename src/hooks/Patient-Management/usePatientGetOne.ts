// src/hooks/patient/usePatientDetail.ts
import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { Patient } from "../../types/Admin/Patient-Management/PatientManagement";
import { toast } from "react-toastify";

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
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || " Lỗi khi lấy thông tin bệnh nhân.";
      toast.error(errorMessage);
      console.error(" Lỗi khi lấy thông tin bệnh nhân:", error);
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
