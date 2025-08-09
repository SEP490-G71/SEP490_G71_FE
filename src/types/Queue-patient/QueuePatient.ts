import { Status } from "../../enums/Queue-Patient/Status";
import { Gender } from "../../enums/Gender";

export interface QueuePatient {
  id: string;
  patientId:string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  patientCode: string;
  dob: string;
  gender: Gender;
  phone: string;
  email: string;
  type: string;
  registeredTime: string;
  roomNumber: string;
  specialization: string;
  status: Status;
  isPriority:boolean;
}

export interface SearchQueueParams {
  name?: string;
  phone?: string;
  patientCode?: string;
  status?: string;
  registeredTimeFrom?: string;
  registeredTimeTo?: string;
  gender?: string;
  roomNumber?: string;
  specialization?: string;
  page?: number;
  size?: number;
}