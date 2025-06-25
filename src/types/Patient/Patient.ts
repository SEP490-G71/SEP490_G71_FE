export interface Patient {
  id: string;
  patientCode: string; // Mã bệnh nhân
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  dob: string; // Date of birth (ISO format)
  gender: "MALE" | "FEMALE" | string;
  phone: string;
  email: string;
}
