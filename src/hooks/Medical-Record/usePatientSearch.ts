// hooks/usePatientSearch.tsx
import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";

export interface PatientOption {
  value: string;
  label: string;
}

const usePatientSearch = () => {
  const [options, setOptions] = useState<PatientOption[]>([]);
  const [loading, setLoading] = useState(false);

  const searchPatients = async (query: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/patients/search", {
        params: { search: query },
      });

      const mapped = res.data.result.map((patient: any) => ({
        value: patient.id,
        label: `${patient.fullName} (${patient.patientCode})`,
      }));
      setOptions(mapped);
    } catch (error) {
      console.error("Search patient error", error);
    } finally {
      setLoading(false);
    }
  };

  return { options, loading, searchPatients };
};

export default usePatientSearch;
