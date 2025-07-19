import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { DepartmentStaffResponse } from "../../types/Admin/Department-Staffs/DepartmentStaffResponse ";

export interface AssignStaffInput {
  departmentId: string;
  staffIdToAssign: string;
}

const useAssignStaffsToDepartment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignStaffs = async (
    departmentId: string,
    newStaffIds: string[]
  ) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(`/departments/${departmentId}`);
      const department: DepartmentStaffResponse = res.data.result;
      const currentStaffIds = department.staffs.map((s) => s.id);

      const updatedStaffIds = Array.from(
        new Set([...currentStaffIds, ...newStaffIds])
      );

      const response = await axiosInstance.post(
        `/departments/${departmentId}/assign-staffs`,
        {
          staffIds: updatedStaffIds,
        }
      );

      toast.success("Gán nhân viên thành công");
      return response.data;
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
