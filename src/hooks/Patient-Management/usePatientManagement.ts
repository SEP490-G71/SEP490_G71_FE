import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { Patient } from "../../types/Admin/Patient-Management/PatientManagement";
import { normalizePatient } from "../../types/Admin/Patient-Management/patientUtils";

interface PatientFilters {
  name?: string;
  phone?: string;
  patientCode?: string;
}

export const usePatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAllPatients = async (
    page = 0,
    size = 5,
    filters: PatientFilters = {}
  ): Promise<number> => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/patients", {
        params: {
          page,
          size,
          ...filters,
        },
      });

      const result = res.data.result;
      const items = result.content || result;

      setPatients(items.map(normalizePatient));

      const total = result.totalElements || result.length || 0;
      setTotalItems(total);
      return total;
    } catch (err) {
      toast.error("Failed to fetch patients");
      return 0;
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientById = async (id: string): Promise<Patient | null> => {
    try {
      const res = await axiosInstance.get(`/patients/${id}`);
      return res.data.result;
    } catch (err) {
      toast.error("Failed to fetch patient");
      return null;
    }
  };

  const deletePatientById = async (id: string) => {
    try {
      await axiosInstance.delete(`/patients/${id}`);
      toast.success("Deleted successfully");
      await fetchAllPatients();
    } catch (err) {
      toast.error("Failed to delete patient");
    }
  };

  return {
    patients,
    totalItems,
    loading,
    fetchAllPatients,
    fetchPatientById,
    deletePatientById,
  };
};
