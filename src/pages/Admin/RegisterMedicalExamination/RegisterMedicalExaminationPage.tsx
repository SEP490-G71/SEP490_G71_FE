import {
  Button,
  Container,
  Grid,
  Select,
  TextInput,
  Title,
  Group,
  Divider,
  Tabs,
  Paper,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Patient } from "../../../types/Admin/RegisterMedicalExamination/RegisterMedicalExamination";
import SearchPatientModal from "../../../components/admin/RegisterMedicalExamination/SearchPatientModal";
import CreateModal from "../../../components/admin/RegisterMedicalExamination/createModal";
import CustomTable from "../../../components/common/CustomTable";
import { Column } from "../../../types/table";
import { useRegisterMedicalExamination } from "../../../hooks/RegisterMedicalExamination/useRegisterMedicalExamination";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
export default function RegisterMedicalExaminationPage() {
  const [patientsToday, setPatientsToday] = useState<Patient[]>([]);
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [confirmedPatient, setConfirmedPatient] = useState<Patient | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tempSelectedPatient, setTempSelectedPatient] =
    useState<Patient | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [createModalOpened, setCreateModalOpened] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<keyof Patient | undefined>();
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | undefined
  >();
  const { setting } = useSettingAdminService();
  const [registerType, setRegisterType] = useState<string>("CONSULTATION");
  const [totalTodayPatients, setTotalTodayPatients] = useState(0);

  const columns: Column<Patient>[] = [
    {
      key: "patientCode",
      label: "Mã BN",
      sortable: false,
    },
    {
      key: "fullName",
      label: "Họ tên",
      sortable: false,
    },
    {
      key: "gender",
      label: "Giới tính",
      render: (row) => (row.gender === "MALE" ? "Nam" : "Nữ"),
    },
    {
      key: "phone",
      label: "Số điện thoại",
    },
    {
      key: "type",
      label: "Loại đăng ký",
      render: (row) => {
        switch (row.type) {
          case "CONSULTATION":
            return "Khám bệnh";
          case "LABORATORY":
            return "Xét nghiệm";
          case "ADMINISTRATION":
            return "Hành chính";
          default:
            return row.type;
        }
      },
    },
  ];

  const handleReset = () => {
    setConfirmedPatient(null);
    setSelectedDate(null);
  };
  const {
    fetchAllPatients,
    fetchTodayRegisteredPatients,
    queuePatient,
    createPatient,
  } = useRegisterMedicalExamination();

  useEffect(() => {
    const loadTodayPatients = async () => {
      const { content, totalElements } = await fetchTodayRegisteredPatients(
        page - 1,
        pageSize
      );

      const safePatients: Patient[] = content.map((p) => ({
        ...p,
        ngayDangKy: p.ngayDangKy ?? null,
        stt: p.stt ?? "",
        phongKham: p.phongKham ?? "",
      }));

      setPatientsToday(safePatients);
      setTotalTodayPatients(totalElements);
    };

    loadTodayPatients();
  }, [page, pageSize]);

  const handleSave = async () => {
    if (!confirmedPatient) return;

    let isoSelected: string | null = null;
    if (selectedDate) {
      const date = new Date(selectedDate);
      if (!isNaN(date.getTime())) {
        isoSelected = date.toISOString().split("T")[0];
      }
    }

    const isoDate =
      isoSelected && isoSelected !== confirmedPatient.ngayDangKy
        ? isoSelected
        : confirmedPatient.ngayDangKy;

    const updatedPatient = { ...confirmedPatient, ngayDangKy: isoDate };

    setPatientsToday((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    setConfirmedPatient(updatedPatient);

    // API đăng ký khám + cập nhật danh sách hôm nay
    await queuePatient(
      updatedPatient.id.toString(),
      registerType,
      `${isoDate}T00:00:00`,
      async () => {
        const { content, totalElements } = await fetchTodayRegisteredPatients(
          page - 1,
          pageSize
        );
        const safePatients: Patient[] = content.map((p) => ({
          ...p,
          ngayDangKy: p.ngayDangKy ?? null,
          stt: p.stt ?? "",
          phongKham: p.phongKham ?? "",
        }));
        setPatientsToday(safePatients);
        setTotalTodayPatients(totalElements);
      }
    );
  };

  const openModal = async () => {
    const { content } = await fetchAllPatients(0, 100);
    setSearchResults(content);
    setTempSelectedPatient(confirmedPatient);
    setModalOpened(true);
  };

  const handleCreatePatient = async (data: Patient, resetForm: () => void) => {
    const created = await createPatient(data);

    if (!created) {
      toast.error("Tạo bệnh nhân thất bại");
      return;
    }

    const newPatient = {
      ...created,
      ngayDangKy: new Date().toISOString().split("T")[0],
      stt: "",
      phongKham: "",
    };

    setPatientsToday((prev) => [...prev, newPatient]);
    setConfirmedPatient(newPatient);
    setSelectedDate(new Date(newPatient.ngayDangKy));
    setCreateModalOpened(false);
    resetForm();
  };

  useEffect(() => {
    try {
      if (
        confirmedPatient?.ngayDangKy &&
        !isNaN(Date.parse(confirmedPatient.ngayDangKy))
      ) {
        setSelectedDate(new Date(confirmedPatient.ngayDangKy));
      } else {
        setSelectedDate(new Date());
      }
    } catch (error) {
      console.error("❌ Lỗi khi xử lý ngày đăng ký:", error);
      setSelectedDate(new Date());
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
        patients={searchResults}
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
        <div className="w-full lg:flex-[1.3] min-w-[350px]">
          <Paper p="md" shadow="sm" radius="md" withBorder>
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

            <CustomTable
              data={patientsToday}
              columns={columns}
              page={page}
              pageSize={pageSize}
              totalItems={totalTodayPatients}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSortChange={(key, dir) => {
                setSortKey(key);
                setSortDirection(dir);
              }}
              showActions={false}
              pageSizeOptions={setting?.paginationSizeList
                .slice()
                .sort((a, b) => a - b)}
            />
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
                        value={confirmedPatient?.patientCode || ""}
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

                  {/* Họ và tên */}
                  <Grid.Col span={4}>
                    <TextInput
                      label="Họ tên"
                      placeholder="Nhập họ và tên"
                      value={
                        confirmedPatient
                          ? `${confirmedPatient.firstName ?? ""} ${
                              confirmedPatient.middleName ?? ""
                            } ${confirmedPatient.lastName ?? ""}`.trim()
                          : ""
                      }
                      disabled
                    />
                  </Grid.Col>

                  {/* Ngày sinh */}
                  <Grid.Col span={2}>
                    <TextInput
                      label="Ngày sinh"
                      placeholder="Ngày sinh"
                      value={
                        confirmedPatient?.dob
                          ? dayjs(confirmedPatient.dob).format("DD/MM/YYYY")
                          : ""
                      }
                      disabled
                    />
                  </Grid.Col>

                  {/* Giới tính */}
                  <Grid.Col span={2}>
                    <TextInput
                      label="Giới tính"
                      value={confirmedPatient?.gender === "MALE" ? "Nam" : "Nữ"}
                      disabled
                    />
                  </Grid.Col>

                  {/* Số điện thoại */}
                  <Grid.Col span={6}>
                    <TextInput
                      label="Điện thoại"
                      placeholder="Điện thoại"
                      value={confirmedPatient?.phone || ""}
                      disabled
                    />
                  </Grid.Col>

                  {/* Mã lịch hẹn */}
                  <Grid.Col span={6}>
                    <TextInput
                      label="Mã lịch hẹn"
                      placeholder="Mã lịch hẹn"
                      value={confirmedPatient?.maLichHen || ""}
                      disabled
                    />
                  </Grid.Col>
                </Grid>

                {/* Thông tin đăng ký */}
                <Divider label="2. Thông tin đăng ký" mt="md" mb="sm" />
                <Grid gutter="xs">
                  <Grid.Col span={4}>
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

                  <Grid.Col span={4}>
                    <Select
                      label="Loại đăng ký"
                      placeholder="Chọn loại"
                      value={registerType}
                      onChange={(value) =>
                        setRegisterType(value || "CONSULTATION")
                      }
                      data={[
                        { value: "CONSULTATION", label: "Khám bệnh" },
                        { value: "LABORATORY", label: "Xét nghiệm" },
                        { value: "ADMINISTRATION", label: "Hành chính" },
                      ]}
                    />
                  </Grid.Col>

                  <Grid.Col span={4}>
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

                  <Grid.Col span={4}>
                    <DatePickerInput
                      label="Ngày đăng ký"
                      value={selectedDate}
                      onChange={(dateValue) => {
                        const date = dateValue as Date | null;
                        setSelectedDate(date);
                      }}
                      valueFormat="DD/MM/YYYY"
                      placeholder="DD/MM/YYYY"
                      minDate={new Date()}
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
