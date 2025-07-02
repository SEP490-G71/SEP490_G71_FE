export interface MedicalService {
  id: string;
  name: string;
  description: string;
  price: number;
  vat: number;
  discount: number;
  serviceCode: string; // <- thêm mới
  department: Department;
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

export interface Role {
  id: string;
  name: string;
  description: string;
}
