import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { DepartmentResponse } from "../../types/Admin/Department/DepartmentTypeResponse";

const useDepartmentService = () => {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

 const fetchAllDepartments = async (
  page: number = 0,
  size: number = 5,
  sortBy: string = "name",
  sortDir: "asc" | "desc" = "asc",
  filters?: {
    name?: string;
    roomNumber?: string;
  }
) => {
  setLoading(true);

  try {
    const res = await axiosInstance.get("/departments", {
   params: {
    page,
    size,
    sortBy,
    sortDir,
    name: filters?.name || undefined,
    roomNumber: filters?.roomNumber || undefined,
    
  },
    });

    // Gán dữ liệu nếu đúng định dạng
    setDepartments(res.data.result.content);
    setTotalItems(res.data.result.totalElements);
  } catch (error: any) {
    console.error(" Failed to fetch departments:", error);
    toast.error("Lỗi khi tải danh sách phòng ban");

    // Ghi log chi tiết response lỗi nếu có
    if (error.response) {
      console.log(" Error response data:", error.response.data);
      console.log(" Error status:", error.response.status);
    } else if (error.request) {
      console.log(" No response received from server:", error.request);
    } else {
      console.log("Error setting up request:", error.message);
    }
  } finally {
    setLoading(false);
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
  };
};

export default useDepartmentService;
