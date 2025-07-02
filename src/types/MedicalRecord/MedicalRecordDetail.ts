export interface MedicalRecordOrder {
  id: string;
  serviceName: string;
  status: string;
  createdBy: string;
  results: any[]; 
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
