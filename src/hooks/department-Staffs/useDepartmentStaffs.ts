import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { DepartmentStaffResponse } from "../../types/Admin/Department-Staffs/DepartmentStaffResponse ";


const useDepartmentStaffs = (departmentId?: string) => {
  const [data, setData] = useState<DepartmentStaffResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartmentStaffs = async () => {
    if (!departmentId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(
        `/medical-diagnosis/departments/${departmentId}`
      );
      setData(res.data.result ?? null);
    } catch (err) {
      console.error("Failed to fetch department:", err);
      toast.error("Không thể tải thông tin phòng ban.");
      setError("Không thể tải thông tin phòng ban.");
      setData(null);
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
    refetch: fetchDepartmentStaffs,
  };
};

export default useDepartmentStaffs;
