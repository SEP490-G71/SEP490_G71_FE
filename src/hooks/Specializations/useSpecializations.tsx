import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import {
  Specialization,
  CreateSpecializationRequest,
} from "../../types/Admin/Specializations/Specializations";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../components/utils/getErrorMessage";

export const useSpecializations = () => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const fetchAllSpecializations = async (filters?: {
    name?: string;
    page?: number;
    size?: number;
  }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/specializations", {
        params: filters,
      });

      const content = res.data.result?.content || res.data.result || [];
      const total = res.data.result?.totalElements || content.length;

      setSpecializations(content);
      setTotalItems(total);
    } catch (error: any) {
      toast.error(
        getErrorMessage(error, "Không thể tải danh sách chuyên ngành")
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializationById = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/specializations/${id}`);
      return res.data.result as Specialization;
    } catch (error: any) {
      toast.error(
        getErrorMessage(error, "Không thể lấy chi tiết chuyên ngành")
      );
      return null;
    }
  };

  const deleteSpecialization = async (
    id: string,
    filters?: {
      name?: string;
      page?: number;
      size?: number;
    }
  ) => {
    try {
      await axiosInstance.delete(`/specializations/${id}`);
      toast.success("Xoá chuyên ngành thành công");
      await fetchAllSpecializations(filters);
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Không thể xoá chuyên ngành"));
    }
  };

  const submitSpecialization = async (
    form: CreateSpecializationRequest,
    selected: Specialization | null,
    filters?: {
      name?: string;
      page?: number;
      size?: number;
    }
  ) => {
    try {
      if (selected) {
        await axiosInstance.put(`/specializations/${selected.id}`, form);
        toast.success("Cập nhật thành công");
      } else {
        await axiosInstance.post("/specializations", form);
        toast.success("Tạo mới thành công");
      }

      await fetchAllSpecializations(filters);
      return true;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Lỗi khi lưu dữ liệu"));
      return false;
    }
  };

  return {
    specializations,
    loading,
    totalItems,
    fetchAllSpecializations,
    fetchSpecializationById,
    deleteSpecialization,
    submitSpecialization,
  };
};
