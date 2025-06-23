import { create } from "zustand";
import { Patient } from "../../types/Patient/Patient";


type PatientStore = {
  // ✅ Danh sách toàn bộ bệnh nhân
  patientList: Patient[];
  setPatientList: (list: Patient[]) => void;

  // ✅ Bệnh nhân đang chọn
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  clearPatient: () => void;
};

export const usePatientStore = create<PatientStore>((set) => ({
  patientList: [],
  setPatientList: (list) => set({ patientList: list }),

  selectedPatient: null,
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  clearPatient: () => set({ selectedPatient: null }),
}));
