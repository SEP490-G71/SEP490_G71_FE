import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

interface PatientOption {
  label: string;
  value: string;
  patient?: any;
}

export const useSearchPatients = (searchTerm: string) => {
  const [options, setOptions] = useState<PatientOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const cleanedSearchTerm = searchTerm.trim().replace(/\s+/g, " ");

      if (!cleanedSearchTerm) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const res = await axiosInstance.get("/patients/search", {
          params: { search: cleanedSearchTerm },
        });

        const result = res.data?.result ?? [];

        const mapped: PatientOption[] = result.map((patient: any) => ({
          value: patient.id,
          label: `${patient.fullName} (${patient.patientCode})`,
          patient,
        }));

        setOptions(mapped);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          "Không thể tìm kiếm bệnh nhân. Vui lòng thử lại.";
        toast.error(errorMessage);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return { options, loading };
};
