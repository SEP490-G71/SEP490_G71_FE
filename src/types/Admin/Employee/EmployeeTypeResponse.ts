import { Gender, Level, Specialty } from "../../../enums/Admin/EmployeeEnums";

export interface EmployeeResponse {
  id: string;
  name: string;
  specialty: Specialty; //enum
  level: Level;//enum
  phone: string;
  email: string;
  gender: Gender;//enum
  dob: string; 
  accountId: string;
}