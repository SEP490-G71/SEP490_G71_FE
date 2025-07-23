import { useForm } from "@mantine/form";

export const usePatientForm = () =>
  useForm<{
    firstName: string;
    middleName: string;
    lastName: string;
    dob: Date | null;
    gender: "MALE" | "FEMALE";
    phone: string;
    email: string;
  }>({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dob: null,
      gender: "MALE",
      phone: "",
      email: "",
    },
    validate: {
      firstName: validateText("Tên"),
      lastName: validateText("Họ"),
      dob: (value) => {
        if (!value) return "Ngày sinh là bắt buộc";
        const today = new Date();
        if (value >= today) return "Ngày sinh phải là trong quá khứ";
        return null;
      },
      gender: (value) => (!value ? "Giới tính là bắt buộc" : null),
      phone: (value) => {
        if (!value.trim()) return "Số điện thoại là bắt buộc";
        if (!/^\d{10}$/.test(value))
          return "Số điện thoại phải gồm đúng 10 chữ số";
        return null;
      },
      email: (value) => {
        if (!value.trim()) return "Email là bắt buộc";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Email không hợp lệ";
        return null;
      },
    },
    validateInputOnChange: true,
  });

// Hàm validate chuỗi
const validateText =
  (label: string, max: number = 100) =>
  (value?: string) => {
    value = value ?? "";
    if (!value.trim()) return `${label} là bắt buộc`;
    if (value.length > max) return `${label} tối đa ${max} ký tự`;
    return null;
  };
