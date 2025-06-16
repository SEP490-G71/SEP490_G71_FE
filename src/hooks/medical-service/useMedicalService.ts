import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { MedicalService } from "../../types/Admin/MedicalService/MedicalService";
import { toast } from "react-toastify";

const useMedicalService = () => {
  const [medicalServices, setMedicalServices] = useState<MedicalService[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAllMedicalServices = async (
    page: number = 0,
    size: number = 5,
    sortBy: string = "name",
    sortDir: "asc" | "desc" = "asc",
    filters?: {
      departmentId?: string;
      name?: string;
    }
  ) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/medical-service", {
        params: {
          page,
          size,
          sortBy,
          sortDir,
          departmentId: filters?.departmentId,
          name: filters?.name,
        },
      });
      setMedicalServices(res.data.result.content);
      setTotalItems(res.data.result.totalElements);
    } catch (error) {
      console.error("Failed to fetch medical services:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalServiceById = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/medical-service/${id}`);
      return res.data.result as MedicalService;
    } catch (error) {
      console.error("Failed to fetch medical service by id:", error);
      return null;
    }
  };

  const handleDeleteMedicalServiceById = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/medical-service/${id}`);
      if (res.status === 200) {
        toast.success("Deleted successfully");
        fetchAllMedicalServices();
      }
    } catch (error) {
      console.error("Failed to fetch medical service by id:", error);
      return null;
    }
  };

  return {
    medicalServices,
    setMedicalServices,
    totalItems,
    loading,
    setLoading,
    fetchAllMedicalServices,
    fetchMedicalServiceById,
    handleDeleteMedicalServiceById,
  };
};

export default useMedicalService;
