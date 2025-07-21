import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import {
  DivideShift,
  CreateDivideShiftRequest,
} from "../../types/Admin/DivideShift/DivideShift";
import { toast } from "react-toastify";

export const useDivideShift = () => {
  const [shifts, setShifts] = useState<DivideShift[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchAllShifts = async (filters?: {
    name?: string;
    page?: number;
    size?: number;
  }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/shifts", {
        params: {
          name: filters?.name || "",
          page: filters?.page || 0,
          size: filters?.size || 10,
        },
      });
      const content = res.data.result?.content || [];
      const total = res.data.result?.totalElements || 0;

      setShifts(content);
      setTotalItems(total);
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShiftById = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/shifts/${id}`);
      return res.data.result as DivideShift;
    } catch (error) {
      console.error("Failed to fetch shift:", error);
      return null;
    }
  };

  const deleteShiftById = async (id: string) => {
    try {
      await axiosInstance.delete(`/shifts/${id}`);
      toast.success("Xoá thành công");
      fetchAllShifts();
    } catch (error) {
      console.error("Failed to delete shift:", error);
    }
  };

  const handleSubmitShift = async (
    formData: CreateDivideShiftRequest,
    selectedShift?: DivideShift | null
  ): Promise<boolean> => {
    try {
      if (selectedShift) {
        await axiosInstance.put(`/shifts/${selectedShift.id}`, formData);
        toast.success("Cập nhật thành công");
      } else {
        await axiosInstance.post("/shifts", formData);
        toast.success("Tạo mới thành công");
      }
      await fetchAllShifts();
      return true;
    } catch (err) {
      console.error("Error submitting shift:", err);
      toast.error("Lỗi khi lưu ca làm");
      return false;
    }
  };

  return {
    shifts,
    totalItems,
    loading,
    fetchAllShifts,
    fetchShiftById,
    deleteShiftById,
    handleSubmitShift,
  };
};

export default useDivideShift;
