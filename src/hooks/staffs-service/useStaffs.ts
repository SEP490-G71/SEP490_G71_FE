import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { StaffsResponse } from "../../types/Admin/Staffs/StaffsTypeResponse";
import { toast } from "react-toastify";
import { StaffsRequest } from "../../types/Admin/Staffs/StaffsTypeRequest";
import { getErrorMessage } from "../../components/utils/getErrorMessage";

export const useStaffs = () => {
  const [staffs, setStaffs] = useState<StaffsResponse[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  //filter
  const fetchStaffList = async (params: {
    page: number;
    size: number;
    name?: string;
    role?: string;
    phone?: string;
    staffCode?: string;
  }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/staffs", { params });
      const content = res.data.result?.content ?? [];
      const total = res.data.result?.totalElements ?? 0;
      setStaffs(content);
      setTotalItems(total);
      if (content.length === 0) {
        toast.info("Không có dữ liệu nhân viên.");
      }
    } catch (error: any) {
      console.error("Failed to fetch staff list:", error);
      toast.error(getErrorMessage(error, "Không thể tải dữ liệu nhân viên."));
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/staffs/all");
      setStaffs(res.data.result);
      setTotalItems(res.data.result?.length ?? 0);
    } catch (error: any) {
      console.error("Failed to fetch all staff:", error);
      toast.error(getErrorMessage(error, "Không thể tải toàn bộ nhân viên."));
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffsById = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/staffs/${id}`);
      return res.data.result as StaffsResponse;
    } catch (error: any) {
      console.error("Failed to fetch employee by id:", error);
      toast.error(
        getErrorMessage(error, "Không thể tải dữ liệu nhân viên theo ID.")
      );
      return null;
    }
  };
  const createStaffs = async (newEmployee: StaffsRequest) => {
    try {
      await axiosInstance.post("/staffs", newEmployee);
    } catch (error) {
      throw error; // ❗Để component Modal xử lý lỗi cụ thể
    }
  };

  const updateStaffs = async (id: string, updated: Partial<StaffsResponse>) => {
    try {
      await axiosInstance.put(`/staffs/${id}`, updated);
      toast.success("Cập nhật nhân viên thành công");
      fetchStaffs();
    } catch (error: any) {
      console.error("Lỗi khi cập nhật nhân viên:", error);
      toast.error(getErrorMessage(error, "Cập nhật nhân viên thất bại"));
    }
  };

  // API: Xoá
  const deleteStaffs = async (id: string) => {
    try {
      await axiosInstance.delete(`/staffs/${id}`);
      toast.success("Xóa nhân viên thành công");
      fetchStaffs();
    } catch (error: any) {
      console.error("Lỗi khi xoá nhân viên:", error);
      toast.error(getErrorMessage(error, "Xóa nhân viên thất bại"));
    }
  };

  return {
    staffs,
    setStaffs,
    totalItems,
    loading,
    setLoading,
    fetchStaffList,
    fetchStaffs,
    fetchStaffsById,
    createStaffs,
    updateStaffs,
    deleteStaffs,
  };
};

export default useStaffs;
