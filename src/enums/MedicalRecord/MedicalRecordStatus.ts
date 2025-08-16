export enum MedicalRecordStatus {
  WAITING_FOR_PAYMENT = "WAITING_FOR_PAYMENT",
  TESTING = "TESTING",
  TESTING_COMPLETED="TESTING_COMPLETED",
  COMPLETED = "COMPLETED",
  WAITING_FOR_RESULT = "WAITING_FOR_RESULT",
  // RESULT_COMPLETED = "RESULT_COMPLETED",
}

export const MedicalRecordStatusMap: Record<MedicalRecordStatus, string> = {
  [MedicalRecordStatus.WAITING_FOR_PAYMENT]: "Chờ thanh toán",
  [MedicalRecordStatus.TESTING]: "Đang thực hiện",
  [MedicalRecordStatus.TESTING_COMPLETED]: "Đã hoàn tất xét nghiệm",
  [MedicalRecordStatus.WAITING_FOR_RESULT]: "Chờ nhập kết quả",
  [MedicalRecordStatus.COMPLETED]: "Đã hoàn tất kết quả",
  
};


export const MedicalRecordStatusColor: Record<MedicalRecordStatus, string> = {
  [MedicalRecordStatus.WAITING_FOR_PAYMENT]: "orange",
  [MedicalRecordStatus.TESTING]: "blue",
  [MedicalRecordStatus.TESTING_COMPLETED]: "green.6",
  [MedicalRecordStatus.WAITING_FOR_RESULT]: "yellow",
  [MedicalRecordStatus.COMPLETED]: "#bb65f4ff",
};