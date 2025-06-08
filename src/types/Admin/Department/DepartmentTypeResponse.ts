import { DepartmentType } from "../../../enums/Admin/DepartmentEnums";

export interface DepartmentResponse {
    id: string;
    name: string;
    description: string;
    roomNumber : string;
    type: DepartmentType;
}