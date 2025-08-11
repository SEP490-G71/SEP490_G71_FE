import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../components/utils/getErrorMessage";

export interface OnlineRegisteredPatient {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  registeredAt: string;
  isConfirmed: boolean;
}

interface FetchOnlinePatientsResponse {
  content: OnlineRegisteredPatient[];
  totalElements: number;
}

export const useViewRegisterOnline = () => {
  const [loading, setLoading] = useState(false);

  const fetchOnlinePatients = async (
    page: number,
    size: number,
    filters: {
      fullName?: string;
      phoneNumber?: string;
      email?: string;
      isConfirmed?: boolean;
      registeredAt?: string;
    } = {}
  ): Promise<FetchOnlinePatientsResponse> => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/registered-online", {
        params: {
          status: "ACTIVE",
          page,
          size,
          ...filters,
        },
      });

      const result = res.data.result || {};
      return {
        content: result.content || [],
        totalElements: result.totalElements || 0,
      };
    } catch (error: any) {
      toast.error(
        getErrorMessage(error, "Không thể tải danh sách bệnh nhân online")
      );
      console.error(error);
      return { content: [], totalElements: 0 };
    } finally {
      setLoading(false);
    }
  };

  const updateConfirmationStatus = async (id: string, isConfirmed: boolean) => {
    try {
      await axiosInstance.put(`/registered-online/status/${id}`, {
        isConfirmed,
      });
      toast.success("Cập nhật trạng thái thành công");
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Cập nhật trạng thái thất bại"));
      console.error(error);
    }
  };

  return {
    fetchOnlinePatients,
    updateConfirmationStatus,
    loading,
  };
};
