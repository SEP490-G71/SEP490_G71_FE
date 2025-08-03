export interface Patient {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  gender: "MALE" | "FEMALE";
  phone: string;
  email: string;
  patientCode?: string;
}

export interface CreateUpdatePatientRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  gender: "MALE" | "FEMALE";
  phone: string;
  email: string;
  patientCode?: string;
}
