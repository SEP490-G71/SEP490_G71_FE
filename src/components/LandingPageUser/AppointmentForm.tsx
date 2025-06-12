import { useState } from "react";

export const AppointmentForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    department: "",
    doctor: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

      <form className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            type="text"
            placeholder="Họ và Tên"
            value={form.name}
            onChange={handleChange}
            className="border px-4 py-3 w-full rounded-sm text-sm"
          />
          <input
            name="email"
            type="email"
            placeholder="Email của bạn"
            value={form.email}
            onChange={handleChange}
            className="border px-4 py-3 w-full rounded-sm text-sm"
          />
          <input
            name="phone"
            type="tel"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={handleChange}
            className="border px-4 py-3 w-full rounded-sm text-sm"
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="date"
            type="datetime-local"
            value={form.date}
            onChange={handleChange}
            className="border px-4 py-3 w-full rounded-sm text-sm"
          />
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="border px-4 py-3 w-full rounded-sm text-sm text-gray-700"
          >
            <option value="">Chọn chuyên khoa</option>
            <option value="cardiology">Nội tiết</option>
            <option value="dermatology">Xương Khớp</option>
            <option value="neurology">Tai mũi họng</option>
          </select>
          <select
            name="Bác sĩ"
            value={form.doctor}
            onChange={handleChange}
            className="border px-4 py-3 w-full rounded-sm text-sm text-gray-700"
          >
            <option value="">Chọn bác sĩ</option>
            <option value="dr-a">Dr. A</option>
            <option value="dr-b">Dr. B</option>
            <option value="dr-c">Dr. C</option>
          </select>
        </div>

        {/* Message */}
        <textarea
          name="message"
          rows={4}
          placeholder="Message (Optional)"
          value={form.message}
          onChange={handleChange}
          className="border px-4 py-3 w-full rounded-sm text-sm"
        />

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 !rounded-full hover:bg-blue-700 transition-all text-sm font-medium"
          >
            Đặt lịch hẹn
          </button>
        </div>
      </form>
    </section>
  );
};
