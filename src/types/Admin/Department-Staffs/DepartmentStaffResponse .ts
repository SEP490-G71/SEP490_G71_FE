import { Position } from "../../../enums/Admin/Position";

export interface DepartmentStaffResponse {
  id: string;
  departmentId: string;
  staffId: string;
  departmentName: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  position: keyof typeof Position;
}