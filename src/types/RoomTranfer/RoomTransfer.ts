import { MedicalRecordStatus } from "../../enums/MedicalRecord/MedicalRecordStatus";

export interface RawRoomTransfer {
  id: string;
  medicalRecord: {
    id: string;
    medicalRecordCode: string;
    patientName: string;
    doctorName: string;
    status: string;        // e.g. "TESTING_COMPLETED"
    createdAt: string;     // ISO
  };
  fromDepartment: {
    id: string;
    name: string;
    roomNumber: string;
  };
  toDepartment: {
    id: string;
    name: string;
    roomNumber: string;
  };
  transferredBy: {
    id: string;
    fullName: string;
    staffCode: string;
    roles: any | null;
  };
  transferTime: string;    // ISO
  reason: string;
  doctor: {
    id: string;
    fullName: string;
    staffCode: string;
    roles: any | null;
  };
  conclusionText: string;
  isFinal: boolean;
}

export interface RoomTransferRow {
  id: string;

  medicalRecordId: string;
  medicalRecordCode: string;
  patientName: string;
  recordDoctorName: string;
  recordStatus: MedicalRecordStatus;
  recordCreatedAt: string;

  fromDepartmentId: string;
  fromDepartmentName: string;
  fromRoomNumber: string;

  toDepartmentId: string;
  toDepartmentName: string;
  toRoomNumber: string;

  transferredById: string;
  transferredByName: string;
  transferredByCode: string;

  transferTime: string;
  reason: string;

  doctorId: string;
  doctorName: string;
  doctorCode: string;

  conclusionText: string;
  isFinal: boolean;
}

// Params lọc khi gọi API
export interface RoomTransferFilters {
  page: number;
  size: number;
  fromDate?: string;        // yyyy-MM-dd
  toDate?: string;          // yyyy-MM-dd
  toDepartmentId?: string;
  medicalRecordCode?: string;
}
