export interface ServiceItem {
  code: string;
  name: string;
  departmentName?: string; // ✅ Thêm để hiển thị
  departmentId?: string | null;
}