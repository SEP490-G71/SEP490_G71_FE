export interface ServiceRow {
  id: number; 
  serviceId: string | null;
 
  serviceCode?: string;
  name?: string;
  price?: number;
  discount?: number;
  vat?: number;
  quantity: number;
  total?: number;

  departmentName?: string; // optional, chỉ hiển thị nếu cần phòng khám
}
