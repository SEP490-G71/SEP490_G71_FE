import { useState } from "react";
import { useAppointmentForm } from "../../hooks/LandingPagesUser/useAppointmentForm";
import {
  Button,
  TextInput,
  Textarea,
  Select,
  Grid,
  Title,
  Text,
} from "@mantine/core";
import { DateInput, DateTimePicker } from "@mantine/dates";
import dayjs from "dayjs";

export const AppointmentForm = () => {
  const { loading, submitAppointment } = useAppointmentForm();

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

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
    <section className="py-16 px-4 max-w-5xl mx-auto text-center">
      <Title order={2} className="text-blue-900 mb-2">
        Đặt lịch khám bệnh
      </Title>
      <div className="h-1 w-24 bg-blue-500 mx-auto mb-4" />
      <Text className="text-gray-600 mb-12">
        Vui lòng điền thông tin bên dưới để đặt lịch hẹn với bác sĩ của chúng
        tôi. Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.
      </Text>

      <form className="space-y-6 text-left" onSubmit={handleSubmit}>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label="Họ"
              placeholder="Nhập họ"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.currentTarget.value)}
              required
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label="Tên đệm"
              placeholder="Nhập tên đệm"
              value={form.middleName}
              onChange={(e) =>
                handleChange("middleName", e.currentTarget.value)
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label="Tên"
              placeholder="Nhập tên"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.currentTarget.value)}
              required
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Email"
              placeholder="Email của bạn"
              value={form.email}
              type="email"
              onChange={(e) => handleChange("email", e.currentTarget.value)}
              required
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              value={form.phoneNumber}
              onChange={(e) =>
                handleChange("phoneNumber", e.currentTarget.value)
              }
              required
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <DateInput
              label="Ngày sinh"
              placeholder="Chọn ngày sinh"
              value={form.dob ? new Date(form.dob) : null}
              onChange={(date) =>
                handleChange(
                  "dob",
                  date ? dayjs(date).format("YYYY-MM-DD") : ""
                )
              }
              valueFormat="DD/MM/YYYY"
              required
              className="w-full"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Giới tính"
              placeholder="Chọn giới tính"
              value={form.gender}
              onChange={(value) => handleChange("gender", value || "")}
              data={[
                { value: "MALE", label: "Nam" },
                { value: "FEMALE", label: "Nữ" },
                { value: "OTHER", label: "Khác" },
              ]}
              required
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <DateTimePicker
              label="Thời gian đặt lịch"
              placeholder="Chọn thời gian"
              value={form.registeredAt ? new Date(form.registeredAt) : null}
              onChange={(date) =>
                handleChange(
                  "registeredAt",
                  date ? dayjs(date).format("YYYY-MM-DDTHH:mm") : ""
                )
              }
              valueFormat="DD/MM/YYYY HH:mm"
              dropdownType="modal"
              required
              className="w-full"
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea
              label="Ghi chú (tuỳ chọn)"
              placeholder="Bạn muốn gửi lời nhắn gì?"
              value={form.message}
              onChange={(e) => handleChange("message", e.currentTarget.value)}
              autosize
              minRows={3}
            />
          </Grid.Col>
        </Grid>

        <div className="text-center pt-4">
          <Button
            type="submit"
            loading={loading}
            size="md"
            radius="xl"
            color="blue"
          >
            Đặt lịch hẹn
          </Button>
        </div>
      </form>
    </section>
  );
};
