import { useState, useMemo } from "react";
import axiosInstance from "../../services/axiosInstance";

interface PatientOption {
  label: string;
  value: string;
  patient?: any;
}

// Debounce function bạn đã viết
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

const usePatientSearch = () => {
  const [options, setOptions] = useState<PatientOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Hàm gọi API tìm kiếm
  const fetchPatients = async (searchTerm: string) => {
    const cleanedSearchTerm = searchTerm.trim();
    // if (!cleanedSearchTerm) {
    //   setOptions([]);
    //   return;
    // }

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
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Dùng useMemo để không tạo debounce mới mỗi lần render
  const searchPatients = useMemo(() => debounce(fetchPatients, 300), []);

  return {
    options,
    loading,
    searchPatients,
  };
};

export default usePatientSearch;
