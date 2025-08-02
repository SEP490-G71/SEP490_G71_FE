import { DepartmentType } from "../../../enums/Admin/DepartmentEnums";

export interface Specialization {
  id: string;
  name: string;
  description: string;
}

export interface DepartmentRequest {
    name: string;
    description: string;
    roomNumber : string;
    type: DepartmentType;
    specializationId?: string;
    defaultServicePrice: number;
}