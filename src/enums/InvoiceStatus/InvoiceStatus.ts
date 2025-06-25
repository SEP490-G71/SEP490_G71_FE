export enum InvoiceStatus {
  UNPAID = "Chưa thanh toán",
  PENDING = "Đang xử lý",
  PAID = "Đã thanh toán",
  CANCELLED = "Đã hủy",
}

export const InvoiceStatusMap: Record<keyof typeof InvoiceStatus, string> = {
  UNPAID: "Chưa thanh toán",
  PENDING: "Đang xử lý",
  PAID: "Đã thanh toán",
  CANCELLED: "Đã hủy",
};