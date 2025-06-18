export interface Patient {
  id: number;
  maBN: string;
  maLichHen: string;
  name: string;
  phone: string;
  dob: string;
  gender: string;
  account: string;
  address: string;
  maKCB: string;
  stt: string;
  phongKham: string;
  ngayDangKy: string;
  email?: string;
  cccd?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export interface PatientRequest {
  id: number;
  maBN?: string;
  maLichHen?: string;
  name: string;
  phone: string;
  dob: string;
  gender: string;
  account?: string;
  address: string;
  maKCB?: string;
  stt?: string;
  phongKham?: string;
  ngayDangKy?: string;
  email: string;
  cccd: string;
  username: string;
  password: string;
  confirmPassword: string;
}
