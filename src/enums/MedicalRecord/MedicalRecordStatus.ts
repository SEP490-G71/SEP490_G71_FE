export enum MedicalRecordStatus {
  WAITING_FOR_PAYMENT = "WAITING_FOR_PAYMENT",
  TESTING = "TESTING",
  TESTING_COMPLETED = "TESTING_COMPLETED",
  WAITING_FOR_RESULT = "WAITING_FOR_RESULT",
  RESULT_COMPLETED = "RESULT_COMPLETED",
}

export const MedicalRecordStatusMap: Record<MedicalRecordStatus, string> = {
  [MedicalRecordStatus.WAITING_FOR_PAYMENT]: "Chờ thanh toán",
  [MedicalRecordStatus.TESTING]: "Đang thực hiện",
  [MedicalRecordStatus.TESTING_COMPLETED]: "Đã hoàn tất xét nghiệm",
  [MedicalRecordStatus.WAITING_FOR_RESULT]: "Chờ nhập kết quả",
  [MedicalRecordStatus.RESULT_COMPLETED]: "Đã hoàn tất kết quả",
};
