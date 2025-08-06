export const vitalSignValidators = {
  temperature: (value: number) =>
    value < 30 || value > 45 ? "Nhiệt độ phải trong khoảng 30°C - 45°C" : null,

  respiratoryRate: (value: number) =>
    value < 5 || value > 60
      ? "Nhịp thở phải trong khoảng 5 - 60 lần/phút"
      : null,

  bloodPressure: (value: string) => {
    const regex = /^\d{2,3}\/\d{2,3}$/;
    return !regex.test(value)
      ? "Huyết áp không hợp lệ (ví dụ: 120/80)"
      : null;
  },

  heartRate: (value: number) =>
    value < 20 || value > 200
      ? "Mạch phải trong khoảng 20 - 200 lần/phút"
      : null,

  spo2: (value: number) =>
    value < 50 || value > 100 ? "SpO2 phải trong khoảng 50 - 100%" : null,

  heightCm: (value: number) =>
    value < 30 ? "Chiều cao phải lớn hơn hoặc bằng 30 cm" : null,

  weightKg: (value: number) =>
    value < 1 ? "Cân nặng phải lớn hơn hoặc bằng 1 kg" : null,

  bmi: (value: number) =>
    value < 5 || value > 80 ? "BMI phải trong khoảng 5 - 80" : null,
};
