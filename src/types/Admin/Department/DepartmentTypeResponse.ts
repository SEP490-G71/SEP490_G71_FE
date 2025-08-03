import { DepartmentType } from "../../../enums/Admin/DepartmentEnums";

export interface Specialization {
  id: string;
  name: string;
  description: string;
}

export interface DepartmentResponse {
  id: string;
  name: string;
  description: string;
  roomNumber: string;
  type: DepartmentType;
  specialization?: Specialization;       
  specializationId?: string;    
           
}