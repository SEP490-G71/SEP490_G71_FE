import {
  Button,
  Container,
  Grid,
  Select,
  Table,
  TextInput,
  Title,
  Group,
  Divider,
  Tabs,
  Text,
  Pagination,
  Paper,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Patient } from "../../../types/Admin/RegisterMedicalExamination/RegisterMedicalExamination";
import SearchPatientModal from "../../../components/admin/RegisterMedicalExamination/SearchPatientModal";
import CreateModal from "../../../components/admin/RegisterMedicalExamination/createModal";

export default function RegisterMedicalExaminationPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [confirmedPatient, setConfirmedPatient] = useState<Patient | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tempSelectedPatient, setTempSelectedPatient] =
    useState<Patient | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [createModalOpened, setCreateModalOpened] = useState(false);

  const handleReset = () => {
    setConfirmedPatient(null);
    setSelectedDate(null);
  };

  const handleSave = () => {
    if (!confirmedPatient) return;

    // Lấy ngày mới từ selectedDate

    let isoSelected: string | null = null;

    if (selectedDate) {
      const date = new Date(selectedDate); // xử lý cả khi là string
      if (!isNaN(date.getTime())) {
        isoSelected = date.toISOString().split("T")[0];
      }
    }

    const isoDate =
      isoSelected && isoSelected !== confirmedPatient.ngayDangKy
        ? isoSelected
        : confirmedPatient.ngayDangKy;
    const updatedPatient = {
      ...confirmedPatient,
      ngayDangKy: isoDate,
    };

    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    setConfirmedPatient(updatedPatient); // cập nhật lại ngay sau lưu
    alert("Lưu thông tin bệnh nhân thành công!");
  };

  const openModal = () => {
    setTempSelectedPatient(confirmedPatient);
    setModalOpened(true);
  };

  const handleCreatePatient = (data: Patient, resetForm: () => void) => {
    const newPatient = {
      ...data,
      id: Date.now(),
      maBN: "00000" + (patients.length + 1),
      maLichHen: "LH00" + (patients.length + 1),
      ngayDangKy: new Date().toISOString().split("T")[0],
    };

    setPatients((prev) => [...prev, newPatient]);
    setConfirmedPatient(newPatient);
    setSelectedDate(new Date(newPatient.ngayDangKy));
    setCreateModalOpened(false);
    resetForm();
  };

  // Đồng bộ selectedDate mỗi khi confirmedPatient thay đổi
  useEffect(() => {
    if (
      confirmedPatient?.ngayDangKy &&
      !isNaN(Date.parse(confirmedPatient.ngayDangKy))
    ) {
      setSelectedDate(new Date(confirmedPatient.ngayDangKy));
    } else {
      setSelectedDate(null);
    }
  }, [confirmedPatient]);

  return (
    <Container fluid size="100%" className="p-4 max-w-[1600px] mx-auto">
      <Title order={3} className="mb-4 text-xl font-semibold">
        Đăng ký khám bệnh
      </Title>

      <SearchPatientModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        patients={patients}
        selected={tempSelectedPatient}
        onSelect={setTempSelectedPatient}
        onConfirm={() => {
          setConfirmedPatient(tempSelectedPatient);
          setModalOpened(false);
        }}
      />

      <CreateModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
        onSubmit={handleCreatePatient}
      />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Bên trái: Bộ lọc và danh sách đăng ký */}
        <div className="w-full lg:flex-[1.3] min-w-[350px]">
          <Paper p="md" shadow="sm" radius="md" withBorder>
            {/* Bộ lọc */}
            <Grid gutter="xs" mb="sm">
              <Grid.Col span={6}>
                <Select
                  label="Trạng thái"
                  data={[]}
                  placeholder="Chọn trạng thái"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Mã KCB" placeholder="Nhập mã KCB" />
              </Grid.Col>
              <Grid.Col span={6}>
                <DatePickerInput label="Từ ngày" placeholder="Chọn ngày" />
              </Grid.Col>
              <Grid.Col span={6}>
                <DatePickerInput label="Đến ngày" placeholder="Chọn ngày" />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Mã BN" placeholder="Nhập mã bệnh nhân" />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Họ tên" placeholder="Nhập họ tên" />
              </Grid.Col>
            </Grid>

            {/* Danh sách bệnh nhân */}
            <Table highlightOnHover withColumnBorders>
              <thead>
                <tr>
                  <th>TT</th>
                  <th>STT</th>
                  <th>Mã BN</th>
                  <th>Tên BN</th>
                  <th>Điện thoại</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <tr key={patient.id}>
                    <td>{index + 1}</td>
                    <td>{index + 1}</td>
                    <td>{patient.maBN}</td>
                    <td>{patient.name}</td>
                    <td>{patient.phone}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Group justify="space-between" mt="sm">
              <Text size="sm">1–10 của 10</Text>
              <Group>
                <Select data={["10", "20", "50"]} defaultValue="10" w={100} />
                <Pagination total={1} value={1} />
              </Group>
            </Group>
          </Paper>
        </div>

        {/* Bên phải: Tabs thông tin chi tiết */}
        <div className="w-full lg:flex-[2] min-w-[500px]">
          <Paper p="md" shadow="sm" radius="md" withBorder>
            <Tabs defaultValue="register-info">
              <div className="w-full flex justify-between items-center mb-4">
                <Tabs.Tab value="register-info">Thông tin đăng ký</Tabs.Tab>

                <div className="flex gap-2">
                  <Button variant="default" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button
                    variant="light"
                    onClick={() => setCreateModalOpened(true)}
                  >
                    Thêm
                  </Button>

                  <Button variant="filled" onClick={handleSave}>
                    Lưu
                  </Button>
                </div>
              </div>

              <Tabs.Panel value="register-info" pt="xs">
                {/* Thông tin người đăng ký */}
                <Divider label="1. Thông tin người đăng ký" mb="sm" />
                <Grid gutter="xs">
                  {/* Mã bệnh nhân + tìm kiếm */}
                  <Grid.Col span={4}>
                    <Group align="end">
                      <TextInput
                        label="Mã bệnh nhân"
                        placeholder="Mã bệnh nhân"
                        style={{ flex: 1 }}
                        value={confirmedPatient?.maBN || ""}
                        disabled
                      />
                      <Button
                        variant="filled"
                        leftSection={<IconSearch size={16} />}
                        onClick={openModal}
                      >
                        Tìm kiếm
                      </Button>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="Họ tên"
                      placeholder="Họ tên"
                      value={confirmedPatient?.name || ""}
                      disabled
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <DatePickerInput
                      label="Ngày sinh"
                      placeholder="Ngày sinh"
                      value={
                        confirmedPatient?.dob &&
                        !isNaN(Date.parse(confirmedPatient.dob))
                          ? new Date(confirmedPatient.dob)
                          : null
                      }
                      disabled
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <Select
                      label="Giới tính"
                      data={[
                        { value: "Nam", label: "Nam" },
                        { value: "Nữ", label: "Nữ" },
                      ]}
                      value={confirmedPatient?.gender || null}
                      disabled
                    />
                  </Grid.Col>

                  <Grid.Col span={4}>
                    <TextInput
                      label="Điện thoại"
                      placeholder="Điện thoại"
                      value={confirmedPatient?.phone || ""}
                      onChange={(e) =>
                        setConfirmedPatient((prev) =>
                          prev ? { ...prev, phone: e.target.value } : prev
                        )
                      }
                      disabled
                    />
                  </Grid.Col>

                  <Grid.Col span={4}>
                    <TextInput
                      label="Mã lịch hẹn"
                      placeholder="Mã lịch hẹn"
                      value={confirmedPatient?.maLichHen || ""}
                      disabled
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="Tài khoản"
                      placeholder="Tài khoản"
                      value={confirmedPatient?.account || ""}
                      disabled
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Địa chỉ"
                      placeholder="Địa chỉ"
                      value={confirmedPatient?.address || ""}
                      onChange={(e) =>
                        setConfirmedPatient((prev) =>
                          prev ? { ...prev, address: e.target.value } : prev
                        )
                      }
                      disabled
                    />
                  </Grid.Col>
                </Grid>

                {/* Thông tin đăng ký */}
                <Divider label="2. Thông tin đăng ký" mt="md" mb="sm" />
                <Grid gutter="xs">
                  <Grid.Col span={3}>
                    <TextInput
                      label="Mã KCB"
                      placeholder="Mã KCB"
                      value={confirmedPatient?.maKCB || ""}
                      onChange={(e) =>
                        setConfirmedPatient((prev) =>
                          prev ? { ...prev, maKCB: e.target.value } : prev
                        )
                      }
                    />
                  </Grid.Col>

                  <Grid.Col span={3}>
                    <TextInput
                      label="Số thứ tự"
                      placeholder="STT"
                      value={confirmedPatient?.stt || ""}
                      onChange={(e) =>
                        setConfirmedPatient((prev) =>
                          prev ? { ...prev, stt: e.target.value } : prev
                        )
                      }
                    />
                  </Grid.Col>

                  <Grid.Col span={3}>
                    <TextInput
                      label="Phòng khám"
                      placeholder="Phòng khám"
                      value={confirmedPatient?.phongKham || ""}
                      onChange={(e) =>
                        setConfirmedPatient((prev) =>
                          prev ? { ...prev, phongKham: e.target.value } : prev
                        )
                      }
                    />
                  </Grid.Col>

                  <Grid.Col span={3}>
                    <DatePickerInput
                      label="Ngày đăng ký"
                      value={selectedDate}
                      onChange={(dateValue) => {
                        const date = dateValue as Date | null;
                        setSelectedDate(date);
                      }}
                      valueFormat="DD/MM/YYYY"
                    />
                  </Grid.Col>
                </Grid>
              </Tabs.Panel>
            </Tabs>
          </Paper>
        </div>
      </div>
    </Container>
  );
}
