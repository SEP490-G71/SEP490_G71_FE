import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../components/utils/getErrorMessage";

export interface StaffOption {
  value: string;
  label: string;
}
const useStaffSearch = () => {
  const [options, setOptions] = useState<StaffOption[]>([]);
  const [loading, setLoading] = useState(false);

  const searchStaffs = async (query: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/staffs/search", {
        params: { search: query },
      });

      const mapped = res.data.result.map((staff: any) => ({
        value: staff.id,
        label: `${staff.fullName} (${staff.staffCode})`,
      }));
      setOptions(mapped);
    } catch (error: any) {
      console.error("Search staff error", error);
      toast.error(getErrorMessage(error, "Lỗi khi tìm kiếm nhân viên"));
    } finally {
      setLoading(false);
    }
  };

  return { options, loading, searchStaffs };
};

export default useStaffSearch;
