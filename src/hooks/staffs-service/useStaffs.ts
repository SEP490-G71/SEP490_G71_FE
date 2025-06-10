import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { StaffsResponse } from "../../types/Admin/Staffs/StaffsTypeResponse";
import { toast } from "react-toastify";

export const useStaffs = () => {
  const [staffs, setStaffs] = useState<StaffsResponse[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStaffs = async (
    page: number = 0,
    size: number = 5,
    sortBy: string = "name",
    sortDir: "asc" | "desc" = "asc",
    filters?: {
      name?: string;
      // level?: string;
      // specialty?: string;
    }
  ) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/staffs", {
        params: {
          page,
          size,
          sortBy,
          sortDir,
          name: filters?.name,
          // level: filters?.level,
          // specialty: filters?.specialty,
        },
      });
      setStaffs(res.data.result.content);
      setTotalItems(res.data.result.totalElements);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffsById = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/staffs/${id}`);
      return res.data.result as StaffsResponse;
    } catch (error) {
      console.error("Failed to fetch employee by id:", error);
      return null;
    }
  };

  const createStaffs = async (newEmployee: Omit<StaffsResponse, "key">) => {
    try {
      await axiosInstance.post("/staffs", newEmployee);
      toast.success("Tạo nhân viên thành công");
      fetchStaffs();
    } catch (error) {
      console.error("Lỗi khi tạo nhân viên:", error);
      toast.error("Tạo nhân viên thất bại");
    }
  };

  const updateStaffs = async (
    id: string,
    updated: Partial<StaffsResponse>
  ) => {
    try {
      await axiosInstance.put(`/staffs/${id}`, updated);
      toast.success("Cập nhật nhân viên thành công");
      fetchStaffs();
    } catch (error) {
      console.error("Lỗi khi cập nhật nhân viên:", error);
      toast.error("Cập nhật nhân viên thất bại");
    }
  };

  const deleteStaffs = async (id: string) => {
    try {
      await axiosInstance.delete(`/staffs/${id}`);
      toast.success("Xóa nhân viên thành công");
      fetchStaffs();
    } catch (error) {
      console.error("Lỗi khi xoá nhân viên:", error);
      toast.error("Xóa nhân viên thất bại");
    }
  };

  return {
    staffs,
    setStaffs,
    totalItems,
    loading,
    setLoading,
    fetchStaffs,
    fetchStaffsById,
    createStaffs,
    updateStaffs,
    deleteStaffs,
  };
};

export default useStaffs;
