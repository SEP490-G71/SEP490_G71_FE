import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

export interface AssignStaffInput {
  staffId: string;
}

const useAssignStaffsToDepartment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const assignStaffs = async (departmentId: string, staffIds: string[]) => {
  setLoading(true);
  setError(null);

  try {
    const res = await axiosInstance.post(
      `/departments/${departmentId}/assign-staffs`,
      {
        staffIds: staffIds,
      }
    );

    toast.success("Gán nhân viên thành công");
    return res.data;
  } catch (err: any) {
    console.error("Lỗi khi gán nhân viên:", err.response?.data || err.message);
    toast.error("Gán nhân viên thất bại");
    setError("Gán nhân viên thất bại");
    return null;
  } finally {
    setLoading(false);
  }
};

  return {
    assignStaffs,
    loading,
    error,
  };
};

export default useAssignStaffsToDepartment;
