
import { LeaveRequestStatus } from "../../../enums/Admin/LeaveRequestStatus";
import { LeaveRequestDetailDTO } from "./LeaveRequestDetailDTO";


export interface LeaveRequestResponse {
  id: string;
  staffName: string;
  reason: string;
  status: LeaveRequestStatus;
  createdAt: string; 
  details: LeaveRequestDetailDTO[];
}
