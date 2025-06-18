import {
  Button,
  Flex,
  Grid,
  Paper,
  ScrollArea,
  Select,
  Table,
  TextInput,
  Textarea,
  Title,
  Divider,
  Loader,
  Tooltip,
  Text,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { IconDeviceFloppy } from "@tabler/icons-react";
import {
  IconPlayerPause,
  IconCheck,
  IconClock,
  IconX,
  IconStethoscope,
} from "@tabler/icons-react";

const StatusCell = ({ status }: { status: string }) => {
  let icon = null;
  let label = status;

  switch (status.toLowerCase()) {
    case "chờ khám":
      icon = <IconClock size={16} color="orange" />;
      break;
    case "đang khám":
      icon = <Loader size="xs" color="green" />;
      break;
    case "tạm dừng":
      icon = <IconPlayerPause size={16} color="orange" />;
      break;
    case "đã khám":
    case "hoàn thành":
    case "hoàn thành khám":
      icon = <IconCheck size={16} color="blue" />;
      break;
    case "bỏ khám":
      icon = <IconX size={16} color="red" />;
      break;
    default:
      icon = <IconStethoscope size={16} color="gray" />;
      break;
  }

  return (
    <Tooltip label={label} withArrow>
      <Flex justify="center" align="center" style={{ height: "100%" }}>
        {icon}
      </Flex>
    </Tooltip>
  );
};

const MedicalExaminationPage = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      appointmentDate: new Date(),
      doctor: "",
      department: "",
      temperature: "",
      breathingRate: "",
      bloodPressure: "",
      heartRate: "",
      height: "",
      weight: "",
      bmi: "",
      spo2: "",
      symptoms: "",
      notes: "Không",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      console.log("Submitted values:", values);
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid p="md" gutter="md" align="start">
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Flex direction="column">
          <Paper shadow="xs" p="md" radius="md" mb="md">
            <Grid gutter="xs">
              <Grid.Col span={6}>
                <Select
                  label="Trạng thái"
                  placeholder="Chọn trạng thái"
                  data={[]}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Mã KCB" placeholder="Nhập mã KCB" />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Từ ngày" placeholder="dd/mm/yyyy" />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Đến ngày" placeholder="dd/mm/yyyy" />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Họ tên" placeholder="Nhập họ tên" />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Mã BN" placeholder="Nhập mã BN" />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Phòng đăng ký"
                  placeholder="Chọn phòng"
                  data={["Phòng nội tổng quát", "Phòng tim mạch"]}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Ưu tiên"
                  placeholder="Chọn mức ưu tiên"
                  data={["Cao", "Trung bình", "Thấp"]}
                />
              </Grid.Col>
            </Grid>
          </Paper>

          <Paper shadow="xs" p="md" radius="md">
            <Title order={5} mb="md">
              Danh sách đăng ký
            </Title>
            <ScrollArea
              offsetScrollbars
              scrollbarSize={8}
              h="auto"
              style={{ overflowX: "auto" }}
            >
              <Table
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
                style={{
                  minWidth: "700px",
                  borderCollapse: "separate",
                  borderSpacing: "2px",
                }}
              >
                <thead style={{ backgroundColor: "#f0f0f0" }}>
                  <tr>
                    <th style={{ textAlign: "center" }}>TT</th>
                    <th style={{ textAlign: "center" }}>STT</th>
                    <th style={{ textAlign: "center" }}>Mã KCB</th>
                    <th style={{ textAlign: "center" }}>Mã BN</th>
                    <th style={{ textAlign: "center" }}>Tên BN</th>
                  </tr>
                </thead>
                <tbody style={{ lineHeight: "1.4rem" }}>
                  <tr style={{ backgroundColor: "#e0ffe0" }}>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <StatusCell status="hoàn thành" />
                    </td>
                    <td style={{ textAlign: "center" }}>1</td>
                    <td style={{ textAlign: "center" }}>2506180001</td>
                    <td style={{ textAlign: "center" }}>00000141</td>
                    <td style={{ textAlign: "center" }}>Nguyễn Văn A</td>
                  </tr>
                  <tr>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <StatusCell status="tạm dừng" />
                    </td>
                    <td style={{ textAlign: "center" }}>2</td>
                    <td style={{ textAlign: "center" }}>2506180002</td>
                    <td style={{ textAlign: "center" }}>00000143</td>
                    <td style={{ textAlign: "center" }}>Nguyễn Văn B</td>
                  </tr>
                  <tr style={{ backgroundColor: "#fff8e1" }}>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <StatusCell status="chờ khám" />
                    </td>
                    <td style={{ textAlign: "center" }}>3</td>
                    <td style={{ textAlign: "center" }}>2506180003</td>
                    <td style={{ textAlign: "center" }}>00000144</td>
                    <td style={{ textAlign: "center" }}>Nguyễn Văn C</td>
                  </tr>
                  <tr>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <StatusCell status="đang khám" />
                    </td>
                    <td style={{ textAlign: "center" }}>4</td>
                    <td style={{ textAlign: "center" }}>2506180004</td>
                    <td style={{ textAlign: "center" }}>00000145</td>
                    <td style={{ textAlign: "center" }}>Đinh Công</td>
                  </tr>
                </tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </Flex>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 8 }}>
        <Flex
          justify="space-between"
          align="center"
          mb="sm"
          wrap="wrap"
          gap="xs"
        >
          <Flex gap="xs" wrap="wrap">
            <Button variant="light" color="blue" size="xs">
              Thông tin khám bệnh
            </Button>
            <Button variant="default" size="xs">
              Kê dịch vụ
            </Button>
            <Button variant="default" size="xs">
              Đơn thuốc
            </Button>
            <Button variant="default" size="xs">
              Lịch sử khám
            </Button>
          </Flex>
          <Button variant="default" color="gray" size="xs" disabled>
            Kết thúc khám
          </Button>
        </Flex>
        <Paper shadow="xs" p="md" radius="md">
          <Title order={4} mb="xs">
            Thông tin người đăng ký
          </Title>

          <Grid gutter={{ base: 8, md: 12 }} mb="md">
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text>Mã lịch hẹn: 2506180001</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text>Mã KCB: 2506180001</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text>Mã bệnh nhân: 00000141</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text>Họ tên: Nguyễn Văn A</Text>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text>Điện thoại: 0967622356</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text>Ngày sinh: 15/08/2019</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text>Giới tính: Nam</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text>Ngày đăng ký: 09/08/2023</Text>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Text>Phòng đăng ký: Phòng nội tổng quát</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Text>Số đăng ký: 1</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Text>Địa chỉ: Thanh Hoá</Text>
            </Grid.Col>
          </Grid>

          <Divider my="sm" label="Khám lâm sàng" labelPosition="left" />

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Grid gutter="xs">
              {/* Row 1: Ngày khám, Bác sĩ, Phòng khám */}
              <Grid.Col span={4}>
                <DateTimePicker
                  label="Ngày khám"
                  value={form.values.appointmentDate}
                  // onChange={(val) => {
                  //   if (val instanceof Date && !isNaN(val.getTime())) {
                  //     form.setFieldValue("appointmentDate", val);
                  //   }
                  // }}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="Bác sĩ"
                  data={["Đinh Văn Dũng", "Nguyễn Văn A"]}
                  {...form.getInputProps("doctor")}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="Phòng khám"
                  data={["Phòng nội tổng quát", "Phòng tim mạch"]}
                  {...form.getInputProps("department")}
                  required
                />
              </Grid.Col>

              {/* Row 2: Sinh tồn 1 */}
              <Grid.Col span={3}>
                <TextInput
                  label="Nhiệt độ"
                  rightSection={
                    <Text size="sm" c="dimmed">
                      °C
                    </Text>
                  }
                  {...form.getInputProps("temperature")}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Nhịp thở"
                  rightSection={
                    <Text size="sm" c="dimmed">
                      L/P
                    </Text>
                  }
                  {...form.getInputProps("breathingRate")}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Huyết áp"
                  rightSection={
                    <Text size="sm" c="dimmed">
                      mmHg
                    </Text>
                  }
                  {...form.getInputProps("bloodPressure")}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Mạch"
                  rightSection={
                    <Text size="sm" c="dimmed">
                      L/P
                    </Text>
                  }
                  {...form.getInputProps("heartRate")}
                />
              </Grid.Col>

              {/* Row 3: Sinh tồn 2 */}
              <Grid.Col span={3}>
                <TextInput
                  label="Chiều cao"
                  rightSection={
                    <Text size="sm" c="dimmed">
                      cm
                    </Text>
                  }
                  {...form.getInputProps("height")}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Cân nặng"
                  rightSection={
                    <Text size="sm" c="dimmed">
                      kg
                    </Text>
                  }
                  {...form.getInputProps("weight")}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="BMI"
                  rightSection={
                    <Text size="sm" c="dimmed">
                      kg/m²
                    </Text>
                  }
                  {...form.getInputProps("bmi")}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="SPO2"
                  rightSection={
                    <Text size="sm" c="dimmed">
                      %
                    </Text>
                  }
                  {...form.getInputProps("spo2")}
                />
              </Grid.Col>
            </Grid>

            <Textarea
              mt="md"
              label="Triệu chứng"
              autosize
              minRows={2}
              {...form.getInputProps("symptoms")}
            />
            <Textarea
              mt="md"
              label="Ghi chú"
              autosize
              minRows={2}
              {...form.getInputProps("notes")}
            />

            <Flex mt="md" gap="sm">
              <Button
                type="submit"
                leftSection={<IconDeviceFloppy size={16} />}
                loading={loading}
              >
                Lưu
              </Button>
              <Button variant="outline" color="red">
                Kết thúc khám
              </Button>
            </Flex>
          </form>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default MedicalExaminationPage;
