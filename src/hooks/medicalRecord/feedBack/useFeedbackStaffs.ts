import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../services/axiosInstance";

export interface FeedbackStaff {
  staffId: string;
  staffName: string;
  staffCode?: string;
  role?: string;
}

export const useFeedbackStaffs = (medicalRecordId?: string) => {
  const [data, setData] = useState<FeedbackStaff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbackStaffs = useCallback(async () => {
    if (!medicalRecordId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(
        `/medical-records/feedback-staffs/${medicalRecordId}`
      );

      const raw: any[] = Array.isArray(res.data?.result) ? res.data.result : [];

      const mapped: FeedbackStaff[] = raw
        .map((x) => ({
          staffId: x?.id ? String(x.id) : "",
          staffName: x?.fullName ?? "",
          staffCode: x?.staffCode ?? undefined,
          role: x?.role ?? undefined,
        }))
        // loại phần tử thiếu value/label để tránh lỗi Mantine
        .filter((x) => x.staffId.trim() !== "" && x.staffName.trim() !== "");

      setData(mapped);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch feedback staffs");
    } finally {
      setLoading(false);
    }
  }, [medicalRecordId]);

  useEffect(() => {
    fetchFeedbackStaffs();
  }, [fetchFeedbackStaffs]);

  return { data, loading, error, refetch: fetchFeedbackStaffs };
};