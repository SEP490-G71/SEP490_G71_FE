import { Gender} from "../../../enums/Admin/StaffsEnums";

export interface StaffsRequest {
   firstName: string;
  middleName: string | null;
  lastName: string;
  fullName:string;
  phone: string;
  email: string;
  gender: Gender; // enum
  dob: string;
   roleNames: string[];
}
