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
import { useSpecializations } from "../../../hooks/Specializations/useSpecializations";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import usePatientSearch from "../../../hooks/Medical-Record/usePatientSearch";

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

  const [totalTodayPatients, setTotalTodayPatients] = useState(0);
  const { options: patientOptions, searchPatients } = usePatientSearch();

  const [searchFilters, setSearchFilters] = useState({
    fullName: "",
    patientId: "",
    phone: "",
    patientCode: "",
    specialization: "",
    registeredTimeFrom: null as Date | null,
    registeredTimeTo: null as Date | null,
    status: "",
  });

  const [submittedFilters, setSubmittedFilters] = useState(searchFilters);

  const {
    specializations,
    fetchAllSpecializations,
    loading: loadingSpecializations,
  } = useSpecializations();

  useEffect(() => {
    fetchAllSpecializations();
  }, []);

  const {
    fetchAllPatients,
    fetchTodayRegisteredPatients,
    queuePatient,
    createPatient,
  } = useRegisterMedicalExamination();

  const columns: Column<Patient>[] = [
    { key: "patientCode", label: "Mã BN", sortable: false },
    { key: "fullName", label: "Họ tên", sortable: false },
    {
      key: "gender",
      label: "Giới tính",
      render: (row) => (row.gender === "MALE" ? "Nam" : "Nữ"),
    },
    { key: "phone", label: "Số điện thoại" },
    { key: "roomNumber", label: "Phòng khám" },
    {
      key: "specialization",
      label: "Chuyên khoa",
      render: (row) => row.specialization || "-",
    },
    {
      key: "registeredTime",
      label: "Ngày đăng ký",
      render: (row) =>
        row.registeredTime
          ? dayjs(row.registeredTime).format("DD/MM/YYYY")
          : "-",
    },

    {
      key: "status",
      label: "Trạng thái",
      render: (row) => {
        switch (row.status) {
          case "WAITING":
            return "Chờ khám";
          case "IN_PROGRESS":
            return "Đang khám";
          case "DONE":
            return "Hoàn thành";
          case "CANCELED":
            return "Đã hủy";
          case "ACTIVE":
            return "Hoạt động";
          case "INACTIVE":
            return "Không hoạt động";
          case "PENDING":
            return "Đang xử lý";
          case "FAILED":
            return "Thất bại";
          default:
            return row.status || "";
        }
      },
    },
  ];

  const handleReset = () => {
    setConfirmedPatient(null);
    setSelectedDate(null);
  };

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);

  useEffect(() => {
    const loadTodayPatients = async () => {
      const filters = {
        patientId: submittedFilters.patientId,
        fullName: submittedFilters.fullName,
        phone: submittedFilters.phone,
        patientCode: submittedFilters.patientCode,
        specialization: submittedFilters.specialization,
        registeredTimeFrom: submittedFilters.registeredTimeFrom
          ? dayjs(submittedFilters.registeredTimeFrom)
              .startOf("day")
              .format("YYYY-MM-DDTHH:mm:ss")
          : undefined,
        registeredTimeTo: submittedFilters.registeredTimeTo
          ? dayjs(submittedFilters.registeredTimeTo)
              .startOf("day")
              .format("YYYY-MM-DDTHH:mm:ss")
          : undefined,
        status: submittedFilters.status,
      };

      const { content, totalElements } = await fetchTodayRegisteredPatients(
        page - 1,
        pageSize,
        filters
      );

      const mappedPatients = content.map((p) => ({
        ...p,
        registeredTime: p.registeredTime ?? p.ngayDangKy ?? null,
      }));

      setPatientsToday(mappedPatients);
      setTotalTodayPatients(totalElements);
    };

    loadTodayPatients();
  }, [page, pageSize, submittedFilters]);

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

    await queuePatient(
      updatedPatient.id.toString(),
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
      },
      updatedPatient.phongKham,
      updatedPatient.specializationId
    );
  };

  const openModal = async () => {
    const { content } = await fetchAllPatients(0, 100);
    setSearchResults(content);
    setTempSelectedPatient(confirmedPatient);
    setModalOpened(true);
  };

  const handleCreatePatient = async (
    data: Partial<Patient>,
    resetForm: () => void
  ): Promise<void> => {
    if (!data.firstName || !data.lastName || !data.dob || !data.gender) {
      toast.error("Vui lòng nhập đầy đủ thông tin bệnh nhân");
      return;
    }

    // Ép kiểu an toàn
    const created = await createPatient(data as Patient);
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

    // setPatientsToday((prev) => [...prev, newPatient]);
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
          <div className="w-full lg:flex-[1.3] min-w-[350px]">
            <Paper p="md" shadow="sm" radius="md" withBorder>
              <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-12 md:col-span-6">
                  <FloatingLabelWrapper label="Họ tên">
                    <Select
                      placeholder="Nhập họ tên"
                      searchable
                      data={patientOptions}
                      onSearchChange={(query) => searchPatients(query)}
                      onChange={(value) => {
                        setSearchFilters({
                          ...searchFilters,
                          patientId: value || "",
                        });
                      }}
                      value={searchFilters.patientId}
                    />
                  </FloatingLabelWrapper>
                </div>

                <div className="col-span-12 md:col-span-6">
                  <FloatingLabelWrapper label="Mã BN">
                    <TextInput
                      placeholder="Nhập mã bệnh nhân"
                      value={searchFilters.patientCode}
                      onChange={(e) =>
                        setSearchFilters({
                          ...searchFilters,
                          patientCode: e.target.value,
                        })
                      }
                    />
                  </FloatingLabelWrapper>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <FloatingLabelWrapper label="Số điện thoại">
                    <TextInput
                      placeholder="Nhập số điện thoại"
                      value={searchFilters.phone}
                      onChange={(e) =>
                        setSearchFilters({
                          ...searchFilters,
                          phone: e.target.value,
                        })
                      }
                    />
                  </FloatingLabelWrapper>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <FloatingLabelWrapper label="Chuyên khoa">
                    <Select
                      placeholder="Chọn chuyên khoa"
                      data={specializations.map((s) => ({
                        value: s.name,
                        label: s.name,
                      }))}
                      value={searchFilters.specialization}
                      onChange={(value) =>
                        setSearchFilters({
                          ...searchFilters,
                          specialization: value || "",
                        })
                      }
                      searchable
                      clearable
                    />
                  </FloatingLabelWrapper>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <FloatingLabelWrapper label="Trạng thái">
                    <Select
                      placeholder="Chọn trạng thái"
                      data={[
                        { value: "WAITING", label: "Chờ khám" },
                        { value: "IN_PROGRESS", label: "Đang khám" },
                        { value: "DONE", label: "Hoàn thành" },
                        { value: "CANCELED", label: "Đã hủy" },
                        { value: "ACTIVE", label: "Hoạt động" },
                        { value: "INACTIVE", label: "Không hoạt động" },
                        { value: "PENDING", label: "Đang xử lý" },
                        { value: "FAILED", label: "Thất bại" },
                      ]}
                      value={searchFilters.status}
                      onChange={(value) =>
                        setSearchFilters({
                          ...searchFilters,
                          status: value || "",
                        })
                      }
                      searchable
                      clearable
                    />
                  </FloatingLabelWrapper>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <FloatingLabelWrapper label="Từ ngày">
                    <DatePickerInput
                      placeholder="Chọn ngày"
                      value={searchFilters.registeredTimeFrom}
                      valueFormat="DD/MM/YYYY"
                      maxDate={new Date()}
                      onChange={(value) =>
                        setSearchFilters({
                          ...searchFilters,
                          registeredTimeFrom: value ? new Date(value) : null,
                        })
                      }
                    />
                  </FloatingLabelWrapper>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <FloatingLabelWrapper label="Đến ngày">
                    <DatePickerInput
                      placeholder="Chọn ngày"
                      value={searchFilters.registeredTimeTo}
                      onChange={(value) =>
                        setSearchFilters({
                          ...searchFilters,
                          registeredTimeTo: value ? new Date(value) : null,
                        })
                      }
                      valueFormat="DD/MM/YYYY"
                    />
                  </FloatingLabelWrapper>
                </div>

                <div className="col-span-12 md:col-span-4 flex items-end gap-2">
                  <Button
                    variant="light"
                    color="gray"
                    className="flex-1"
                    onClick={() => {
                      const reset = {
                        fullName: "",
                        patientId: "",
                        phone: "",
                        patientCode: "",
                        specialization: "",
                        registeredTimeFrom: null,
                        registeredTimeTo: null,
                        status: "",
                      };
                      setSearchFilters(reset);
                      setSubmittedFilters(reset);
                      setPage(1);
                    }}
                  >
                    Tải lại
                  </Button>
                  <Button
                    variant="filled"
                    color="blue"
                    className="flex-1"
                    onClick={() => {
                      setSubmittedFilters(searchFilters);
                      setPage(1);
                    }}
                  >
                    Tìm kiếm
                  </Button>
                </div>
              </div>

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
                  ?.slice()
                  .sort((a, b) => a - b)}
              />
            </Paper>
          </div>
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
                    <Select
                      label="Chuyên khoa"
                      placeholder="Chọn chuyên khoa"
                      data={specializations.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      value={confirmedPatient?.specializationId || ""}
                      onChange={(value) =>
                        setConfirmedPatient((prev) =>
                          prev
                            ? {
                                ...prev,
                                specializationId: value || "",
                                specialization:
                                  specializations.find((s) => s.id === value)
                                    ?.name || "",
                              }
                            : prev
                        )
                      }
                      searchable
                      disabled={loadingSpecializations}
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

                  {/* Ngày đăng ký giữ nguyên */}
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
