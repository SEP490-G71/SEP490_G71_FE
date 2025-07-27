import { QueuePatient } from "../../types/Queue-patient/QueuePatient";

export const mapDetailToQueuePatient = (
  detail: any,
  override?: Partial<QueuePatient>
): QueuePatient => ({
  id: detail.patientId,
  patientId: detail.patientId,
  patientCode: detail.patientCode ?? "",
  fullName: detail.patientName ?? "",
  firstName: detail.firstName ?? "",
  middleName: detail.middleName ?? "",
  lastName: detail.lastName ?? "",
  dob: detail.dateOfBirth ?? "",
  gender: detail.gender ?? "UNKNOWN",
  phone: detail.phone ?? "",
  email: detail.email ?? "",
  type: detail.visit?.type ?? "",
  roomNumber: detail.visit?.roomNumber ?? "",
  specialization: detail.visit?.specialization?.name ?? "",
  status: detail.visit?.status ?? "WAITING",
  registeredTime: detail.visit?.registeredTime ?? "",
  ...override,
});
