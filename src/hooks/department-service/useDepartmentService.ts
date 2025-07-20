import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { DepartmentResponse } from "../../types/Admin/Department/DepartmentTypeResponse";
import { DepartmentRequest } from "../../types/Admin/Department/DepartmentTypeRequest";

const useDepartmentService = () => {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

const fetchDepartments = async (params: {
  page: number;
  size: number;
  name?: string;
  roomNumber?: string;
  type?: string;
}) => {
  setLoading(true);
  try {
    const res = await axiosInstance.get("/departments", { params });
    const content = res.data.result?.content ?? [];
    const total = res.data.result?.totalElements ?? 0;
    setDepartments(content);
    setTotalItems(total);
    if (content.length === 0) {
      toast.info("Không có dữ liệu phòng ban.");
    }
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    toast.error("Không thể tải dữ liệu phòng ban.");
  } finally {
    setLoading(false);
  }
};

const fetchAllDepartments = async () => {
  setLoading(true);
  try {
    const res = await axiosInstance.get("/departments/all");
    const data = res.data.result ?? [];
    setDepartments(data);
    setTotalItems(data.length);
    if (data.length === 0) {
      toast.info("Không có phòng ban nào.");
    }
  } catch (error) {
    console.error("Failed to fetch all departments:", error);
    toast.error("Không thể tải toàn bộ danh sách phòng ban.");
  } finally {
    setLoading(false);
  }
};

const createDepartment = async (data: DepartmentRequest) => {
  try {
    const res = await axiosInstance.post("/departments", data);
    toast.success("Tạo phòng ban thành công");
    fetchAllDepartments(); 
    return res.data.result as DepartmentResponse;
  } catch (error) {
    console.error("Lỗi khi tạo phòng ban:", error);
    toast.error("Tạo phòng ban thất bại");
    return null;
  }
};

  const fetchDepartmentById = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/departments/${id}`);
      return res.data.result as DepartmentResponse;
    } catch (error) {
      console.error("Failed to fetch department by ID:", error);
      toast.error("Không thể tải thông tin phòng ban");
      return null;
    }
  };

  const updateDepartment = async (
  id: string,
  data: Partial<DepartmentRequest>
): Promise<DepartmentResponse | null> => {
  try {
    const res = await axiosInstance.put(`/departments/${id}`, data);
    toast.success("Cập nhật phòng ban thành công");
    fetchAllDepartments(); 
    return res.data.result as DepartmentResponse;
  } catch (error) {
    console.error("Lỗi khi cập nhật phòng ban:", error);
    toast.error("Cập nhật phòng ban thất bại");
    return null;
  }
};

  const handleDeleteDepartmentById = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/departments/${id}`);
      if (res.status === 200) {
        toast.success("Xoá phòng ban thành công");
        fetchAllDepartments();
      }
    } catch (error) {
      console.error("Failed to delete department:", error);
      toast.error("Xoá phòng ban thất bại");
    }
  };

  const fetchAllDepartmentsRaw = async (): Promise<DepartmentResponse[]> => {
  try {
    const res = await axiosInstance.get("/departments", {
      params: { page: 0, size: 100, sortBy: "name", sortDir: "asc" },
    });
    return res.data.result.content || [];
  } catch (error) {
    console.error("Failed to fetch departments", error);
    return [];
  }
};

  return {
    departments,
    totalItems,
    loading,
    setLoading,
    setDepartments,
    fetchAllDepartments,
    fetchDepartmentById,
    fetchAllDepartmentsRaw,
    handleDeleteDepartmentById,
    createDepartment,
    updateDepartment,
    fetchDepartments
  };
};

export default useDepartmentService;
