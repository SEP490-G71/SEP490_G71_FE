import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { DepartmentStaffResponse } from "../../types/Admin/Department-Staffs/DepartmentStaffResponse ";


export interface AssignStaffInput {
  staffId: string;
  position: "DOCTOR" | "HEAD" | "ASSISTANT";
}

const useAssignStaffsToDepartment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignStaffs = async (
    departmentId: string,
    newStaffPositions: AssignStaffInput[]
  ) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(
        `/department-staffs/department/${departmentId}/staffs`
      );
      const currentStaffs: DepartmentStaffResponse[] = res.data.result || [];

      const existingStaffs: AssignStaffInput[] = currentStaffs.map((s) => ({
        staffId: s.staffId!,
        position: s.position,
      }));

      const merged = [...existingStaffs, ...newStaffPositions];

      const response = await axiosInstance.post("/department-staffs", {
        departmentId,
        staffPositions: merged,
      });

      toast.success("Gán nhân viên thành công");
      return response.data;
    } catch (err: any) {
      console.error("Lỗi khi gán nhân viên:", err);
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
