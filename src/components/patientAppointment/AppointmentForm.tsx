import { Button, Grid, Select, TextInput, Textarea } from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";

export const AppointmentForm = () => {
  const form = useForm({
    initialValues: {
      lastName: "",
      middleName: "",
      firstName: "",
      email: "",
      phone: "",
      dob: null,
      gender: "",
      appointmentTime: null,
      note: "",
    },

    validate: {
      lastName: (v) => (v ? null : "Vui lòng nhập họ"),
      firstName: (v) => (v ? null : "Vui lòng nhập tên"),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : "Email không hợp lệ"),
      phone: (v) => (v ? null : "Vui lòng nhập số điện thoại"),
      dob: (v) => (v ? null : "Vui lòng chọn ngày sinh"),
      gender: (v) => (v ? null : "Vui lòng chọn giới tính"),
      appointmentTime: (v) => (v ? null : "Vui lòng chọn thời gian"),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("📅 Booking data:", values);
    // TODO: Gửi dữ liệu lên server
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Grid gutter="md">
        <Grid.Col span={4}>
          <TextInput
            label="Họ *"
            placeholder="Nhập họ"
            {...form.getInputProps("lastName")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Tên đệm"
            placeholder="Nhập tên đệm"
            {...form.getInputProps("middleName")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Tên *"
            placeholder="Nhập tên"
            {...form.getInputProps("firstName")}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label="Email *"
            placeholder="Email của bạn"
            {...form.getInputProps("email")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Số điện thoại *"
            placeholder="Nhập số điện thoại"
            {...form.getInputProps("phone")}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <DateInput
            label="Ngày sinh *"
            placeholder="Chọn ngày sinh"
            valueFormat="DD/MM/YYYY"
            {...form.getInputProps("dob")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Giới tính *"
            placeholder="Chọn giới tính"
            data={[
              { label: "Nam", value: "male" },
              { label: "Nữ", value: "female" },
              { label: "Khác", value: "other" },
            ]}
            {...form.getInputProps("gender")}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <TimeInput
            label="Thời gian đặt lịch *"
            placeholder="Chọn thời gian"
            {...form.getInputProps("appointmentTime")}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Textarea
            label="Ghi chú (tuỳ chọn)"
            placeholder="Bạn muốn gửi lời nhắn gì?"
            autosize
            minRows={3}
            {...form.getInputProps("note")}
          />
        </Grid.Col>
      </Grid>

      <div className="mt-4 text-center">
        <Button type="submit" color="blue">
          Đặt lịch hẹn
        </Button>
      </div>
    </form>
  );
};
