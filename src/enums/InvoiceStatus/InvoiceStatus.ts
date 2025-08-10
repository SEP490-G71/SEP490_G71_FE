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

export const InvoiceStatusColor: Record<keyof typeof InvoiceStatus, string> = {
  UNPAID: "#dc2626",    
  PENDING: "#d97706",     
  PAID: "teal",        
  CANCELLED: "#6b7280",   
};
