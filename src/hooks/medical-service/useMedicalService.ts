import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { MedicalService } from "../../types/Admin/MedicalService/MedicalService";
import { toast } from "react-toastify";

const useMedicalService = () => {
  const [medicalServices, setMedicalServices] = useState<MedicalService[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getErrorMessage = (error: any, defaultMsg: string) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      defaultMsg
    );
  };

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
      const res = await axiosInstance.get("/medical-services", {
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
      console.error("Lỗi khi tải danh sách dịch vụ y tế:", error);
      toast.error(
        getErrorMessage(error, "Không thể tải danh sách dịch vụ y tế.")
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMedicalServicesNoPagination = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/medical-services/all");
      setMedicalServices(res.data.result ?? []);
    } catch (error) {
      console.error("Lỗi khi tải tất cả dịch vụ y tế:", error);
      toast.error(
        getErrorMessage(error, "Không thể tải danh sách dịch vụ (tất cả).")
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalServiceById = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/medical-services/${id}`);
      return res.data.result as MedicalService;
    } catch (error) {
      console.error("Lỗi khi tải thông tin dịch vụ y tế:", error);
      toast.error(
        getErrorMessage(error, "Không thể tải thông tin dịch vụ y tế.")
      );
      return null;
    }
  };

 const handleDeleteMedicalServiceById = async (id: string): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/medical-services/${id}`);
    if (res.status === 200) {
      toast.success("Xoá dịch vụ thành công");
      return true;
    }
    toast.error("Không thể xoá dịch vụ y tế.");
    return false;
  } catch (error) {
    console.error("Lỗi khi xoá dịch vụ y tế:", error);
    toast.error(getErrorMessage(error, "Không thể xoá dịch vụ y tế."));
    return false;
  }
};

  return {
    medicalServices,
    setMedicalServices,
    totalItems,
    loading,
    setLoading,
    fetchAllMedicalServices,
    fetchAllMedicalServicesNoPagination,
    fetchMedicalServiceById,
    handleDeleteMedicalServiceById,
  };
};

export default useMedicalService;
