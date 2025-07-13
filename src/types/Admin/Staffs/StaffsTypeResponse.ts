import { Gender, Level, Specialty } from "../../../enums/Admin/StaffsEnums";

export interface StaffsResponse {
  id: string;
  firstName: string;
  middleName: string | null;
  staffCode: string;
  lastName: string;
   fullName:string;
    specialty: keyof typeof Specialty; // enum
  level: Level; // enum
  phone: string;
  email: string;
  gender: Gender; // enum
  dob: string;
  accountId: string;
}
