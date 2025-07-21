import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { DepartmentResponse } from "../../types/Admin/Department/DepartmentTypeResponse";

const useMyDepartment = () => {
  const [department, setDepartment] = useState<DepartmentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyDepartment = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/departments/me");
      setDepartment(res.data.result);
    } catch (err: any) {
      console.error("Lỗi khi lấy phòng ban:", err);
      setError("Không thể tải thông tin phòng ban.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDepartment();
  }, []);

  return { department, loading, error };
};

export default useMyDepartment;
