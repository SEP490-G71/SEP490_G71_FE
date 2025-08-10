import { SatisfactionLevel } from "../../../enums/FeedBack/SatisfactionLevel";

export interface StaffFeedbackItem {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  medicalRecordId: string;
  satisfactionLevel: SatisfactionLevel; 
  comment: string;                      
  createdAt: string;                   
}
