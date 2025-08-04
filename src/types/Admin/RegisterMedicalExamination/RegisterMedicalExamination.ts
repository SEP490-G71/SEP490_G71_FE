export interface Patient {
  id: number;
  patientCode: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  dob: string;
  gender: string;
  stt: string;
  phongKham: string;
  ngayDangKy: string;
  email?: string;
  type?: string;
  specialization?: string;
  specializationId?: string;
  status?: string;
  roomNumber?: string;
  registeredTime?: string;
  isPriority?: boolean;
  registeredAt?: string;
}

export interface PatientRequest {
  id: number;
  patientCode?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  name: string;
  phone: string;
  dob: string;
  gender: string;
  stt?: string;
  phongKham?: string;
  ngayDangKy?: string;
  email: string;
}
