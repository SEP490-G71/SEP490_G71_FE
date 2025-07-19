import { Gender } from "../../../enums/Admin/StaffsEnums";

export interface StaffsResponse {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  fullName: string;
  staffCode: string;
  phone: string;
  email: string;
  gender: Gender; 
  dob: string; 
  roles: string[];
  accountId: string;

  department: {
    id: string;
    name: string;
    roomNumber: string;
  } | null;
}
