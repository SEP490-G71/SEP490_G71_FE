import { DepartmentType } from "../../../enums/Admin/DepartmentEnums";


export interface DepartmentRequest {
    name: string;
    description: string;
    roomNumber : string;
    type: DepartmentType;
}