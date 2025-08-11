import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../components/utils/getErrorMessage";

export interface ShiftOption {
  value: string;
  label: string;
}

export const useShifts = () => {
  const [shifts, setShifts] = useState<ShiftOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/shifts");
      const result = res.data.result?.content || [];
      const formatted = result.map((shift: any) => ({
        value: shift.id,
        label: shift.name,
      }));
      setShifts(formatted);
    } catch (error: any) {
      console.error("Failed to fetch shifts", error);
      toast.error(getErrorMessage(error, "Không thể tải danh sách ca trực"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  return { shifts, loading };
};
