
import { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";


export interface DepartmentInfo {
  id: string;
  name: string;
  roomNumber: string;
}

export interface StaffFeedbackStatistic {
  id: string;
  staffCode: string;
  fullName: string;
  phone: string;
  email: string;
  gender: "MALE" | "FEMALE" | string;
  totalFeedbacks: number;
  averageSatisfaction: number;
  department: DepartmentInfo | null;
}

export interface StaffFeedbackStatisticsResponse {
  data: {
    content: StaffFeedbackStatistic[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
  totalFeedbacks: number;
  averageSatisfaction: number;
}

export const useStaffFeedbackStatistics = (page: number = 0, size: number = 10) => {
  const [data, setData] = useState<StaffFeedbackStatistic[]>([]);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [averageSatisfaction, setAverageSatisfaction] = useState(0);
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
      const res = await axiosInstance.get<{ code: number; result: StaffFeedbackStatisticsResponse }>(
        `/staff-feedbacks/feedback-statistics`,
        { params: { page, size } }
      );

      if (res.data?.result) {
        const result = res.data.result;
        setData(result.data.content || []);
        setPageInfo({
          pageNumber: result.data.pageNumber,
          pageSize: result.data.pageSize,
          totalElements: result.data.totalElements,
          totalPages: result.data.totalPages,
          last: result.data.last,
        });
        setTotalFeedbacks(result.totalFeedbacks);
        setAverageSatisfaction(result.averageSatisfaction);
      } else {
        setData([]);
      }
    } catch (err: any) {
      console.error("Error fetching staff feedback statistics:", err);
      setError(err?.message || "Failed to fetch staff feedback statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, size]);

  return {
    data,
    totalFeedbacks,
    averageSatisfaction,
    pageInfo,
    loading,
    error,
    refetch: fetchData,
  };
};
