export interface MedicalService {
  id: string;
  name: string;
  description: string;
  department: Department;
  price: number;
  vat: number;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  roomNumber: string;
  type: string;
}

export interface CreateMedicalServiceRequest {
  name: string;
  description: string;
  departmentId: string;
  price: number;
  vat: number;
}
