import { DepartmentType } from "../../../enums/Admin/DepartmentEnums";

import { StaffsResponse } from "../Staffs/StaffsTypeResponse";

export interface DepartmentStaffResponse {
   id: string;
  name: string;
  description: string;
  roomNumber: string;
  type: DepartmentType;
  specialization: {
    id: string;
    name: string;
    description: string;
  } | null;
  staffs: StaffsResponse[];
}