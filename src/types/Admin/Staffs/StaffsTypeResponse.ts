import { Gender, Level, Specialty } from "../../../enums/Admin/StaffsEnums";

export interface StaffsResponse {
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