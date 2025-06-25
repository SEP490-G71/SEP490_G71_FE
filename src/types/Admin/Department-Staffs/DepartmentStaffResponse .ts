import { Position } from "../../../enums/Admin/Position";

export interface DepartmentStaffResponse {
  id: string;
  departmentId: string;
  staffId: string;
  departmentName: string;
  staffName: string; 
  position: keyof typeof Position;
}