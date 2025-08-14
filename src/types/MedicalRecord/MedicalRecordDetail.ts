import { MedicalRecordStatus } from "../../enums/MedicalRecord/MedicalRecordStatus";
import { Status } from "../../enums/Queue-Patient/Status";

export interface OrderResultImage {
  id: string;
  imageUrl: string;
}

export interface OrderResult {
  id: string;
  completedBy: string;
  imageUrls: OrderResultImage[];
  note: string | null;
  description: string | null;
}

export interface MedicalRecordOrder {
  id: string;
  serviceName: string;
  status: MedicalRecordStatus;
  createdBy: string;
  results: OrderResult[];
}

export interface VisitSpecialization {
  id: string;
  name: string;
  description: string | null;
}

export interface MedicalRecordVisit {
  id: string;
  queueId: string;
  patientId: string;
  queueOrder: number;
  status: Status;                 
  roomNumber: string;
  type: string;                  
  createdAt: string;
  calledTime: string;
  isPriority: boolean;
  registeredTime: string;
  checkinTime: string;
  specialization: VisitSpecialization;
  // NEW từ BE:
  awaitingResultTime?: string | null;
  message?: string | null;
}

export interface TransferDepartment {
  id: string;
  name: string;
  roomNumber: string;
}

export interface TransferStaff {
  id: string;
  fullName: string;
  staffCode: string;
  roles: any | null;
}

export interface RoomTransferDetail {
  id: string;
  medicalRecordId: string;
  fromDepartment: TransferDepartment;
  toDepartment: TransferDepartment;
  transferredBy: TransferStaff;
  transferTime: string;
  reason: string | null;
  doctor: TransferStaff | null;
  conclusionText: string | null;
  isFinal: boolean | null;
}
export interface RoomTransferDetail {
  id: string;
  medicalRecordId: string;
  fromDepartment: TransferDepartment;
  toDepartment: TransferDepartment;
  transferredBy: TransferStaff;
  transferTime: string;
  reason: string | null;
  doctor: TransferStaff | null;

  // ✅ thêm/đảm bảo có
  conclusionText: string | null;

  isFinal: boolean | null;
}

export interface MedicalRecordDetail {
  id: string;
  patientId: string;
  patientCode: string;
  medicalRecordCode: string;
  patientName: string;
  gender: "MALE" | "FEMALE" | string;
  dateOfBirth: string;
  phone: string;
  createdBy: string;

  diagnosisText: string;
  summary: string;
  status: MedicalRecordStatus;   
  createdAt: string;
  notes: string;

  temperature: number;
  respiratoryRate: number;
  bloodPressure: string;
  heartRate: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  spo2: number;

  visit: MedicalRecordVisit | null;
  orders: MedicalRecordOrder[];

  roomTransfers: RoomTransferDetail[];
}
