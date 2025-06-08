import { Gender, Level, Specialty } from "../../../enums/Admin/EmployeeEnums";

export interface EmployeeRequest {
  name: string;
  specialty: Specialty;
  level: Level;
  phone: string;
  email: string;
  gender: Gender;
  dob: string; // ISO format: 'YYYY-MM-DD'
}