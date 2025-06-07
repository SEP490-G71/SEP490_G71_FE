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
