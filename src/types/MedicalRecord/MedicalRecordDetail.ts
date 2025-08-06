export interface MedicalRecordOrder {
  id: string;
  serviceName: string;
  status: string;
  createdBy: string;
  results: any[]; 
}

export interface MedicalRecordVisit {
  id: string;
  queueId: string;
  patientId: string;
  queueOrder: number;
  status: string;
  roomNumber: string;
  type: string;
  createdAt: string;
  calledTime: string;
  isPriority: boolean;
  registeredTime: string;
  checkinTime:string;
  specialization: {
    id: string;
    name: string;
    description: string;
    
  };
}
export interface MedicalRecordDetail {
  id: string;
  patientId: string;
  patientCode: string;
  medicalRecordCode: string;
  patientName: string;
  gender: 'MALE' | 'FEMALE' | string;
  dateOfBirth: string;
  phone: string;
  createdBy: string;
  diagnosisText: string;
  summary: string;
  status: string;
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
  
}

