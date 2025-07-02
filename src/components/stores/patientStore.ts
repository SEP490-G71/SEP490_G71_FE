// patientStore.ts
import { create } from "zustand";
import { Patient } from "../../types/Patient/Patient";

type PatientStore = {
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  clearPatient: () => void;
};

export const usePatientStore = create<PatientStore>((set) => ({
  selectedPatient: null,
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  clearPatient: () => set({ selectedPatient: null }),
}));
