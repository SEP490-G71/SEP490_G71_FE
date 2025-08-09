export const vitalSignValidators = {
  temperature: (value: number | null) =>
    value === null
      ? "Nhiệt độ không được để trống"
      : value < 30 || value > 45
      ? "Nhiệt độ phải trong khoảng 30°C - 45°C"
      : null,

  respiratoryRate: (value: number | null) =>
    value === null
      ? "Nhịp thở không được để trống"
      : value < 5 || value > 60
      ? "Nhịp thở phải trong khoảng 5 - 60 lần/phút"
      : null,

  bloodPressure: (value: string | null) => {
    if (!value || value.trim() === "") return "Huyết áp không được để trống";
    const regex = /^\d{2,3}\/\d{2,3}$/;
    return !regex.test(value)
      ? "Huyết áp không hợp lệ (ví dụ: 120/80)"
      : null;
  },

  heartRate: (value: number | null) =>
    value === null
      ? "Mạch không được để trống"
      : value < 20 || value > 200
      ? "Mạch phải trong khoảng 20 - 200 lần/phút"
      : null,

  spo2: (value: number | null) =>
    value === null
      ? "SpO2 không được để trống"
      : value < 50 || value > 100
      ? "SpO2 phải trong khoảng 50 - 100%"
      : null,

  heightCm: (value: number | null) =>
    value === null
      ? "Chiều cao không được để trống"
      : value < 30
      ? "Chiều cao phải lớn hơn hoặc bằng 30 cm"
      : null,

  weightKg: (value: number | null) =>
    value === null
      ? "Cân nặng không được để trống"
      : value < 1
      ? "Cân nặng phải lớn hơn hoặc bằng 1 kg"
      : null,

  bmi: (value: number | null) =>
    value === null
      ? "BMI không được để trống"
      : value < 5 || value > 80
      ? "BMI phải trong khoảng 5 - 80"
      : null,
};
