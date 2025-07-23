import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

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
    } catch (error) {
      console.error("Failed to fetch shifts", error);
      toast.error("Không thể tải danh sách ca trực");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  return { shifts, loading };
};
