export enum InvoiceStatus {
  UNPAID = "UNPAID",
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export const InvoiceStatusMap: Record<keyof typeof InvoiceStatus, string> = {
  UNPAID: "Chưa thanh toán",
  PENDING: "Đang xử lý",
  PAID: "Đã thanh toán",
  CANCELLED: "Đã hủy",
};