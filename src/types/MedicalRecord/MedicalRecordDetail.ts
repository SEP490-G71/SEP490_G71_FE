export interface MedicalRecordOrder {
  id: string;
  serviceName: string;
  status: string;
  createdBy: string;
  results: any[]; // Có thể khai báo rõ kiểu nếu biết structure
}

export interface MedicalRecordDetail {
  id: string;
  medicalRecordCode: string;
  patientName: string;
  createdBy: string;
  diagnosisText: string;
  summary: string;
  status: string;
  createdAt: string;
  orders: MedicalRecordOrder[];
}
