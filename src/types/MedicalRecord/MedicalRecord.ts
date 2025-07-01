import { MedicalRecordStatus } from "../../enums/MedicalRecord/MedicalRecordStatus";


export interface MedicalRecord {
  id: string;
  medicalRecordCode: string;
  patientName: string;
  doctorName: string;
  status: MedicalRecordStatus;
  createdAt: string;
}
