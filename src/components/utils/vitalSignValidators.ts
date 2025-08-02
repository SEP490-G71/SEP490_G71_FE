export const vitalSignValidators = {
  temperature: (value: number) =>
    value < 35 || value > 42 ? "Nhiệt độ phải trong khoảng 35°C - 42°C" : null,

  respiratoryRate: (value: number) =>
    value < 8 || value > 30
      ? "Nhịp thở phải trong khoảng 8 - 30 lần/phút"
      : null,

  bloodPressure: (value: string) => {
    const regex = /^\d{2,3}\/\d{2,3}$/;
    return !regex.test(value)
      ? "Huyết áp không hợp lệ (ví dụ: 120/80)"
      : null;
  },

  heartRate: (value: number) =>
    value < 40 || value > 180
      ? "Mạch phải trong khoảng 40 - 180 lần/phút"
      : null,

  spo2: (value: number) =>
    value < 70 || value > 100 ? "SpO2 phải trong khoảng 70 - 100%" : null,

  heightCm: (value: number) =>
    value < 50 || value > 250
      ? "Chiều cao phải trong khoảng 50 - 250 cm"
      : null,

  weightKg: (value: number) =>
    value < 15 || value > 120
      ? "Cân nặng phải trong khoảng 15 - 120 kg"
      : null,

  bmi: (value: number) =>
    value < 10 || value > 60 ? "BMI phải trong khoảng 10 - 60" : null,
};
