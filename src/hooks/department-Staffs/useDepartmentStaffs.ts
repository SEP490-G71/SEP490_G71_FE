import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { DepartmentStaffResponse } from "../../types/Admin/Department-Staffs/DepartmentStaffResponse ";

const useDepartmentStaffs = (departmentId?: string) => {
  const [data, setData] = useState<DepartmentStaffResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartmentStaffs = async () => {
    if (!departmentId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(
        `/department-staffs/department/${departmentId}/staffs`
      );

      setData(res.data.result || []);
    } catch (err: any) {
      console.error("Failed to fetch department staffs:", err);
      toast.error("Không thể tải danh sách nhân viên.");
      setError("Không thể tải danh sách nhân viên.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchDepartmentStaffs();
  }, [departmentId]);

  return {
    data,
    loading,
    error,
    fetchDepartmentStaffs,
    setData,
    setLoading,
  };
};

export default useDepartmentStaffs;
