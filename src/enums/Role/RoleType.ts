export enum RoleType {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  CASHIER = "CASHIER",
  RECEPTIONIST = "RECEPTIONIST",
  TECHNICIAN = "TECHNICIAN",
  PATIENT = "PATIENT",
}

export const RoleLabels: Record<RoleType, string> = {
  [RoleType.ADMIN]: "Quản trị viên",
  [RoleType.DOCTOR]: "Bác sĩ",
  [RoleType.CASHIER]: "Thu ngân",
  [RoleType.RECEPTIONIST]: "Lễ tân",
  [RoleType.TECHNICIAN]: "Kỹ thuật viên",
  [RoleType.PATIENT]: "Bệnh nhân",
};