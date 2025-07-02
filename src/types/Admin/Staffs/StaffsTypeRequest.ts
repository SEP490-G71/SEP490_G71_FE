import { Gender, Level, Specialty } from "../../../enums/Admin/StaffsEnums";

export interface StaffsRequest {
  // name: string;
  // specialty: Specialty;
  // level: Level;
  // phone: string;
  // email: string;
  // gender: Gender;
  // dob: string; 
  // accountId?: string;

   firstName: string;
  middleName: string | null;
  lastName: string;
  fullName:string;
  specialty: Specialty; // enum
  level: Level; // enum
  phone: string;
  email: string;
  gender: Gender; // enum
  dob: string;
  //accountId: string;
}
