import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { DepartmentStaffResponse } from "../../types/Admin/Department-Staffs/DepartmentStaffResponse ";


interface RemoveStaffInput {
  departmentId: string;
  staffIdToRemove: string;
}

const useRemoveStaffFromDepartment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 const removeStaff = async ({ departmentId, staffIdToRemove }: RemoveStaffInput) => {
  setLoading(true);
  setError(null);

  try {
    const res = await axiosInstance.get(`/departments/${departmentId}`);
    const department: DepartmentStaffResponse = res.data.result;

    const existingStaffs = department.staffs || [];

    if (!existingStaffs.find((staff) => staff.id === staffIdToRemove)) {
      toast.error("Không tìm thấy nhân viên trong phòng này.");
      return null;
    }

    const updatedStaffIds = existingStaffs
      .filter((staff) => staff.id !== staffIdToRemove)
      .map((staff) => staff.id);
      
      if (updatedStaffIds.length === 0) {
      toast.error("Phòng ban phải có ít nhất 1 nhân viên.");
      return null;
      }

    const response = await axiosInstance.post(
  `/departments/${departmentId}/assign-staffs`,
  {
    staffIds: updatedStaffIds.length > 0 ? updatedStaffIds : null,
  }
);

    toast.success("Xoá nhân viên thành công");
    return response.data;
  } catch (err) {
    console.error("Lỗi khi xoá nhân viên:", err);
    toast.error("Xoá nhân viên thất bại");
    setError("Xoá nhân viên thất bại");
    return null;
  } finally {
    setLoading(false);
  }
};

  return {
    removeStaff,
    loading,
    error,
  };
};

export default useRemoveStaffFromDepartment;
