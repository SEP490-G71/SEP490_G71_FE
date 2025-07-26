import { useState } from "react";
import { useAppointmentForm } from "../../hooks/LandingPagesUser/useAppointmentForm";

export const AppointmentForm = () => {
  const { loading, submitAppointment } = useAppointmentForm();

  // 1️⃣ Sửa: tách fullName thành các trường riêng
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    registeredAt: "",
    dob: "",
    gender: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 3️⃣ Sửa: dùng trực tiếp firstName, middleName, lastName
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedData = {
      firstName: form.firstName,
      middleName: form.middleName,
      lastName: form.lastName,
      dob: form.dob,
      gender: form.gender as "MALE" | "FEMALE" | "OTHER",
      email: form.email,
      phoneNumber: form.phoneNumber,
      registeredAt: form.registeredAt,
      message: form.message,
    };

    const success = await submitAppointment(formattedData);
    if (success) {
      // 4️⃣ Reset form
      setForm({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        registeredAt: "",
        dob: "",
        gender: "",
        message: "",
      });
    }
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto text-center">
      <h2 className="text-4xl font-bold text-blue-900 mb-2">
        Đặt lịch khám bệnh
      </h2>
      <div className="h-1 w-24 bg-blue-500 mx-auto mb-4" />
      <p className="text-gray-600 mb-12">
        Vui lòng điền thông tin bên dưới để đặt lịch hẹn với bác sĩ của chúng
        tôi. Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* 2️⃣ Sửa: tách Họ - Tên đệm - Tên */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="firstName"
            type="text"
            placeholder="Họ"
            value={form.firstName}
            onChange={handleChange}
            className="border px-4 py-3 w-full rounded-sm text-sm"
          />
          <input
            name="middleName"
            type="text"
            placeholder="Tên đệm"
            value={form.middleName}
            onChange={handleChange}
            className="border px-4 py-3 w-full rounded-sm text-sm"
          />
          <input
            name="lastName"
            type="text"
            placeholder="Tên"
            value={form.lastName}
            onChange={handleChange}
            className="border px-4 py-3 w-full rounded-sm text-sm"
          />
        </div>

        {/* Email, SĐT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email của bạn"
            value={form.email}
            onChange={handleChange}
            className="border px-4 py-3 w-full rounded-sm text-sm"
          />
          <input
            name="phoneNumber"
            type="tel"
            placeholder="Số điện thoại"
            value={form.phoneNumber}
            onChange={handleChange}
            className="border px-4 py-3 w-full rounded-sm text-sm"
          />
        </div>

        {/* Ngày sinh & Giới tính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            className="border px-4 py-3 w-full rounded-sm text-sm"
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="border px-4 py-3 w-full rounded-sm text-sm text-gray-700"
          >
            <option value="">Chọn giới tính</option>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>

        {/* Ngày hẹn */}
        <input
          name="registeredAt"
          type="datetime-local"
          value={form.registeredAt}
          onChange={handleChange}
          className="border px-4 py-3 w-full rounded-sm text-sm"
        />

        {/* Ghi chú */}
        <textarea
          name="message"
          rows={4}
          placeholder="Lời nhắn (tuỳ chọn)"
          value={form.message}
          onChange={handleChange}
          className="border px-4 py-3 w-full rounded-sm text-sm"
        />

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 !rounded-full hover:bg-blue-700 transition-all text-sm font-medium"
          >
            {loading ? "Đang xử lý..." : "Đặt lịch hẹn"}
          </button>
        </div>
      </form>
    </section>
  );
};
