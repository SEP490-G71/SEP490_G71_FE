import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../services/axiosInstance";

export interface FeedbackService {
  serviceId: string;     
  serviceName: string;
  comment?: string;
  rating?: number;
}

export const useFeedbackServices = (medicalRecordId?: string) => {
  const [data, setData] = useState<FeedbackService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbackServices = useCallback(async () => {
    if (!medicalRecordId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(
        `/medical-records/feedback-services/${medicalRecordId}`
      );

      const raw: any[] = Array.isArray(res?.data?.result) ? res.data.result : [];

      const mapped: FeedbackService[] = raw
        .map((x: any) => ({
          serviceId: x?.id ? String(x.id) : "",
          serviceName: x?.serviceName ?? "",
        }))
        .filter((x) => x.serviceId.trim() !== "" && x.serviceName.trim() !== "");

      setData(mapped);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch feedback services");
    } finally {
      setLoading(false);
    }
  }, [medicalRecordId]);

  useEffect(() => {
    fetchFeedbackServices();
  }, [fetchFeedbackServices]);

  return { data, loading, error, refetch: fetchFeedbackServices };
};
