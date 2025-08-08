import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { StaffsResponse } from "../../types/Admin/Staffs/StaffsTypeResponse";

const useUnassignedStaffs = () => {
  const [staffs, setStaffs] = useState<StaffsResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const fetchUnassignedStaffs = async (search = "", type = "") => {
  setLoading(true);
  setError(null);
  try {
    const res = await axiosInstance.get("/staffs/unassigned", {
      params: { search, type },
    });
    setStaffs(res.data?.result ?? []);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách nhân viên chưa gán:", err);
    setError("Không thể tải danh sách nhân viên chưa gán.");
  } finally {
    setLoading(false);
  }
};

  return {
    staffs,
    loading,
    error,
    fetchUnassignedStaffs,
  };
};

export default useUnassignedStaffs;
