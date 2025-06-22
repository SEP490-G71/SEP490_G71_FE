import { Paper, Title, Grid, Button, Group, Text } from "@mantine/core";
import { Patient } from "../../types/Patient/Patient";
import { useLocation, useNavigate } from "react-router";

interface Props {
  patient: Patient | null;
}

const PatientInfoPanel = ({ patient }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isServicePage = location.pathname.includes("service");
  const activeTab: "thongtin" | "dichvu" = isServicePage
    ? "dichvu"
    : "thongtin";

  return (
    <>
      <Group mb="xs" gap="xs" style={{ fontSize: "14px" }}>
        <Button
          size="xs"
          variant="default"
          color="gray"
          onClick={() => navigate("/admin/medical-examination")}
          style={{
            backgroundColor: activeTab === "thongtin" ? "#e0f7ff" : undefined,
            fontSize: activeTab === "thongtin" ? "16px" : "14px",
            fontWeight: activeTab === "thongtin" ? 600 : 400,
            color: activeTab === "thongtin" ? "#1c7ed6" : undefined,
          }}
        >
          Thông tin khám bệnh
        </Button>

        <Button
          size="xs"
          variant="default"
          color="gray"
          onClick={() => navigate("/admin/medical-examination/service")}
          style={{
            backgroundColor: activeTab === "dichvu" ? "#e0f7ff" : undefined,
            fontSize: activeTab === "dichvu" ? "16px" : "14px",
            fontWeight: activeTab === "dichvu" ? 600 : 400,
            color: activeTab === "dichvu" ? "#1c7ed6" : undefined,
          }}
        >
          Kê dịch vụ
        </Button>

        <Button
          variant="default"
          size="xs"
          disabled
          style={{ marginLeft: "auto" }}
        >
          Kết thúc khám
        </Button>
      </Group>

      <Paper p="sm" mb="md" withBorder={false}>
        <Title order={5} mb="xs">
          Thông tin người đăng ký
        </Title>

        <Grid gutter="xs">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            Mã lịch hẹn:{" "}
            <Text span fw={600}>
              ---
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            Mã KCB:{" "}
            <Text span fw={600}>
              {patient?.maKcb ?? "---"}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            Mã BN:{" "}
            <Text span fw={600}>
              {patient?.maBn ?? "---"}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            Họ tên:{" "}
            <Text span fw={600}>
              {patient?.ten ?? "---"}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            Điện thoại:{" "}
            <Text span fw={600}>
              {patient?.sdt ?? "---"}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            Ngày sinh:{" "}
            <Text span fw={600}>
              {patient?.ngaySinh ?? "---"}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            Giới tính:{" "}
            <Text span fw={600}>
              {patient?.gioiTinh ?? "---"}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            Ngày đăng ký:{" "}
            <Text span fw={600}>
              {patient?.ngayDangKy ?? "---"}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            Phòng đăng ký:{" "}
            <Text span fw={600}>
              {patient?.phong ?? "---"}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            Số đăng ký:{" "}
            <Text span fw={600}>
              {patient?.soDangKy ?? "---"}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            Địa chỉ:{" "}
            <Text span fw={600}>
              {patient?.diaChi ?? "---"}
            </Text>
          </Grid.Col>
        </Grid>
      </Paper>
    </>
  );
};

export default PatientInfoPanel;
