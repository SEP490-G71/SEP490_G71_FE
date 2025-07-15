import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { StaffsResponse } from "../../types/Admin/Staffs/StaffsTypeResponse";

export interface StaffOption {
  label: string;
  value: string; // staffId
}

export const useSearchStaffs = (searchTerm: string) => {
  const [options, setOptions] = useState<StaffOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchTerm || !searchTerm.trim()) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const res = await axiosInstance.get("/staffs/search", {
          params: { search: searchTerm },
        });

        const result: StaffsResponse[] = res.data?.result ?? [];

        const mapped: StaffOption[] = result.map((staff) => ({
          value: staff.id, 
          label: `${staff.fullName} (${staff.staffCode})`, 
        }));

        setOptions(mapped);
      } catch (err) {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return { options, loading };
};
