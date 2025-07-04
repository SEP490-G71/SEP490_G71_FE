export interface Patient {
  id: number;
  patientCode: string;
  maLichHen: string;
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
}

export interface PatientRequest {
  id: number;
  patientCode?: string;
  maLichHen?: string;
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
