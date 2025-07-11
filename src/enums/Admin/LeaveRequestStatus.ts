export enum LeaveRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const LeaveRequestStatusLabels: Record<LeaveRequestStatus, string> = {
  [LeaveRequestStatus.PENDING]: "Chờ duyệt",
  [LeaveRequestStatus.APPROVED]: "Đã duyệt",
  [LeaveRequestStatus.REJECTED]: "Từ chối",
};
