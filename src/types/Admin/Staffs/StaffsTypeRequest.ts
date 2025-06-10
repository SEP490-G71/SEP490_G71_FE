import { Gender, Level, Specialty } from "../../../enums/Admin/StaffsEnums";

export interface StaffsRequest {
  name: string;
  specialty: Specialty;
  level: Level;
  phone: string;
  email: string;
  gender: Gender;
  dob: string; 
  accountId?: string;
}
