import { Patient } from "../Patient-Management/PatientManagement";

export const normalizePatient = (raw: any): Patient => {
  return {
    ...raw,
    gender:
      raw.gender === "MALE" || raw.gender === "FEMALE"
        ? raw.gender
        : raw.gender?.toUpperCase() === "NAM"
        ? "MALE"
        : "FEMALE",
  };
};
