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
      // B1: Lấy toàn bộ bản ghi hiện tại
      const res = await axiosInstance.get(
        `/department-staffs/department/${departmentId}/staffs`
      );
      const currentStaffs: DepartmentStaffResponse[] = res.data.result || [];

      // B2: Lọc bỏ nhân viên cần xoá
      const filtered = currentStaffs.filter((s) => s.staffId !== staffIdToRemove);

      // B3: Chuyển đổi lại về định dạng gửi đi
      const staffPositions = filtered.map((s) => ({
        staffId: s.staffId!,
        position: s.position,
      }));

      // B4: Gửi lại danh sách mới
      const response = await axiosInstance.post("/department-staffs", {
        departmentId,
        staffPositions,
      });

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
