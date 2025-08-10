import { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";

export interface ServiceDepartment {
  id: string;
  name: string;
  description?: string;
  roomNumber: string;
  type: string;
  specialization: {
    id: string;
    name: string;
    description?: string;
  } | null;
}

export interface MedicalServiceFeedbackStatistic {
  id: string;
  serviceCode: string;
  name: string;
  description?: string;
  department: ServiceDepartment | null;
  totalFeedbacks: number;
  averageSatisfaction: number;
}

export interface MedicalServiceFeedbackStatisticsResponse {
  data: {
    content: MedicalServiceFeedbackStatistic[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
  totalFeedbacks: number;
  averageSatisfaction: number;
}

export const useServiceFeedbackStatistics = (page: number = 0, size: number = 10) => {
  const [data, setData] = useState<MedicalServiceFeedbackStatistic[]>([]);
  const [globalTotalFeedbacks, setGlobalTotalFeedbacks] = useState(0);
  const [globalAverageSatisfaction, setGlobalAverageSatisfaction] = useState(0);
  const [pageInfo, setPageInfo] = useState<{
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get<{ code: number; result: MedicalServiceFeedbackStatisticsResponse }>(
        `/medical-service-feedbacks/feedback-statistics`,
        { params: { page, size } }
      );

      const result = res.data?.result;
      if (result) {
        setData(result.data.content || []);
        setPageInfo({
          pageNumber: result.data.pageNumber,
          pageSize: result.data.pageSize,
          totalElements: result.data.totalElements,
          totalPages: result.data.totalPages,
          last: result.data.last,
        });
        setGlobalTotalFeedbacks(result.totalFeedbacks ?? 0);
        setGlobalAverageSatisfaction(result.averageSatisfaction ?? 0);
      } else {
        setData([]);
        setPageInfo(null);
        setGlobalTotalFeedbacks(0);
        setGlobalAverageSatisfaction(0);
      }
    } catch (e: any) {
      console.error("Error fetching medical-service feedback statistics:", e);
      setError(e?.message || "Failed to fetch medical-service feedback statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, size]);

  return {
    data,                          
    pageInfo,                        
    totalFeedbacks: globalTotalFeedbacks,
    averageSatisfaction: globalAverageSatisfaction,
    loading,
    error,
    refetch: fetchData,
  };
};
