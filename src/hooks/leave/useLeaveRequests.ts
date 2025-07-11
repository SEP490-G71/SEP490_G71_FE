import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { LeaveRequestResponse } from "../../types/Admin/Leave/LeaveRequestResponse";
import { LeaveRequestStatus } from "../../enums/Admin/LeaveRequestStatus";

export interface LeaveFilters {
  status?: LeaveRequestStatus | string;
  staffName?: string;
}

export const useLeaveRequests = () => {
  const [leaves, setLeaves] = useState<LeaveRequestResponse[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    last: false,
  });

  const fetchLeaves = async (
    filters: LeaveFilters = {},
    page = 0,
    size = 10,
    sortBy = "createdAt",
    sortDir = "desc"
  ) => {
    try {
      setLoadingList(true);

      const params = {
        ...filters,
        page,
        size,
        sortBy,
        sortDir,
      };

      const res = await axiosInstance.get(
        "/leave-request",
        { params }
      );

      const result = res.data?.result;

      if (!result || !Array.isArray(result.content)) {
        console.error("❌ Không có dữ liệu hợp lệ từ API /leave-request");
        setLeaves([]);
        setPagination({
          pageNumber: 0,
          pageSize: size,
          totalElements: 0,
          totalPages: 0,
          last: true,
        });
        return;
      }

      const mappedLeaves: LeaveRequestResponse[] = result.content.map(
        (item: any) => ({
          id: item.id,
          staffName: item.staffName,
          reason: item.reason,
          status: item.status,
          createdAt: item.createdAt,
          details: item.details ?? [],
        })
      );

      setLeaves(mappedLeaves);

      setPagination({
        pageNumber: result.pageNumber ?? 0,
        pageSize: result.pageSize ?? size,
        totalElements: result.totalElements ?? 0,
        totalPages: result.totalPages ?? 1,
        last: result.last ?? true,
      });
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách nghỉ phép:", err);
    } finally {
      setLoadingList(false);
    }
  };

  return {
    leaves,
    loadingList,
    pagination,
    fetchLeaves,
  };
};
