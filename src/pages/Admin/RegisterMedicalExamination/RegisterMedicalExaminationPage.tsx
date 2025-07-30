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
  Checkbox,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Patient } from "../../../types/Admin/RegisterMedicalExamination/RegisterMedicalExamination";
import SearchPatientModal from "../../../components/admin/RegisterMedicalExamination/SearchPatientModal";
import CreateModal from "../../../components/admin/RegisterMedicalExamination/createModal";
import CustomTable from "../../../components/common/CustomTable";
import { Column } from "../../../types/table";
import {
  Department,
  useRegisterMedicalExamination,
} from "../../../hooks/RegisterMedicalExamination/useRegisterMedicalExamination";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { useSpecializations } from "../../../hooks/Specializations/useSpecializations";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import usePatientSearch from "../../../hooks/Medical-Record/usePatientSearch";
import axiosInstance from "../../../services/axiosInstance";
import { Switch } from "@mantine/core";

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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [onlinePatients, setOnlinePatients] = useState<Patient[]>([]);
  const [totalOnlinePatients, setTotalOnlinePatients] = useState(0);
  const [onlinePage, setOnlinePage] = useState(1);
  const [onlinePageSize, setOnlinePageSize] = useState(10);
  const [onlineDate, setOnlineDate] = useState<Date | null>(new Date());

  const today = dayjs().startOf("day").toDate();
  const [searchFilters, setSearchFilters] = useState({
    fullName: "",
    patientId: "",
    phone: "",
    patientCode: "",
    specialization: "",
    registeredTimeFrom: today,
    registeredTimeTo: today,
    status: "",
  });

  const [onlineSearchFilters, setOnlineSearchFilters] = useState({
    registeredAt: dayjs().format("YYYY-MM-DD"),
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [submittedFilters, setSubmittedFilters] = useState(searchFilters);
  const [submittedOnlineFilters, setSubmittedOnlineFilters] =
    useState(onlineSearchFilters);

  const {
    specializations,
    fetchAllSpecializations,
    loading: loadingSpecializations,
  } = useSpecializations();

  useEffect(() => {
    fetchAllSpecializations();

    // Gán filter mặc định là ngày hôm nay ngay khi load
    const today = dayjs().startOf("day").toDate();
    const defaultFilters = {
      fullName: "",
      patientId: "",
      phone: "",
      patientCode: "",
      specialization: "",
      registeredTimeFrom: today,
      registeredTimeTo: today,
      status: "",
    };

    setSearchFilters(defaultFilters);
    setSubmittedFilters(defaultFilters);
  }, []);

  // Định nghĩa ở ngoài useEffect
  const loadOnlinePatients = async () => {
    if (!onlineDate) return;

    const formattedDate = dayjs(onlineDate).format("YYYY-MM-DD");
    const res = await fetchOnlineRegisteredPatients(
      {
        registeredAt: formattedDate,
        fullName: submittedOnlineFilters.fullName,
        email: submittedOnlineFilters.email,
        phoneNumber: submittedOnlineFilters.phoneNumber,
      },
      onlinePage - 1,
      onlinePageSize
    );

    const mapped = res.content.map((p) => ({
      ...p,
      registeredTime: (p as any).registeredAt,
    }));

    setOnlinePatients(mapped);
    setTotalOnlinePatients(res.totalElements);
  };

  // Gọi tự động khi các dependency thay đổi
  useEffect(() => {
    loadOnlinePatients();
  }, [submittedOnlineFilters, onlinePage, onlinePageSize]);

  const {
    fetchAllPatients,
    fetchTodayRegisteredPatients,
    queuePatient,
    createPatient,
    fetchDepartmentsBySpecialization,
    fetchOnlineRegisteredPatients,
  } = useRegisterMedicalExamination();

  const onlineColumns: Column<Patient>[] = [
    { key: "fullName", label: "Họ tên", align: "left" },
    {
      key: "gender",
      label: "Giới tính",
      align: "left",
      render: (row) => (row.gender === "MALE" ? "Nam" : "Nữ"),
    },
    {
      key: "status",
      label: "Trạng trái",
      align: "left",
      render: (row) =>
        row.status === "ACTIVE"
          ? "Chưa đến"
          : row.status === "INACTIVE"
          ? "Đã đến"
          : row.status ?? "-",
    },
    {
      key: "updateStatus",
      label: "Trạng thái",
      align: "center",
      render: (row) => (
        <Switch
          size="sm"
          color="teal"
          checked={row.status === "INACTIVE"}
          onChange={() => handleUpdateStatus(row)}
        />
      ),
    },

    {
      key: "registeredAt",
      label: "Ngày đăng ký",
      align: "left",
      render: (row) =>
        row.registeredAt
          ? dayjs(row.registeredAt).format("DD/MM/YYYY HH:mm")
          : "-",
    },
    { key: "email", label: "Email", align: "left" },
    { key: "phoneNumber", label: "Số điện thoại", align: "left" },
    { key: "message", label: "Ghi chú", align: "left" },
  ];

  const columns: Column<Patient>[] = [
    { key: "patientCode", label: "Mã BN", sortable: false, align: "left" },
    { key: "fullName", label: "Họ tên", sortable: false, align: "left" },
    {
      key: "gender",
      label: "Giới tính",
      align: "left",
      render: (row) => (row.gender === "MALE" ? "Nam" : "Nữ"),
    },
    { key: "roomNumber", label: "Phòng khám", align: "center" },
    {
      key: "status",
      label: "Trạng thái",
      align: "left",
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
    {
      key: "specialization",
      label: "Chuyên khoa",
      align: "left",
      render: (row) => row.specialization || "-",
    },
    { key: "phone", label: "Số điện thoại", align: "right" },
    {
      key: "registeredTime",
      label: "Ngày đăng ký",
      align: "right",
      render: (row) =>
        row.registeredTime
          ? dayjs(row.registeredTime).format("DD/MM/YYYY")
          : "-",
    },
  ];

  const handleUpdateStatus = async (patient: Patient) => {
    const newStatus = patient.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      await axiosInstance.put(`/registered-online/status/${patient.id}`, {
        status: newStatus,
      });

      toast.success("Cập nhật trạng thái thành công!");
      loadOnlinePatients(); // ✅ reload lại bảng
    } catch (error) {
      console.error("❌ Lỗi cập nhật trạng thái:", error);
      toast.error("Cập nhật thất bại!");
    }
  };

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
    const loadDepartments = async () => {
      if (!confirmedPatient?.specializationId) {
        setDepartments([]);
        return;
      }

      setLoadingDepartments(true);
      const result = await fetchDepartmentsBySpecialization(
        confirmedPatient.specializationId
      );
      setDepartments(result);
      setLoadingDepartments(false);
    };

    loadDepartments();
  }, [confirmedPatient?.specializationId]);

  useEffect(() => {
    const loadTodayPatients = async () => {
      const filters = {
        patientId: submittedFilters.patientId,
        fullName: submittedFilters.fullName,
        phone: submittedFilters.phone,
        patientCode: submittedFilters.patientCode,
        specialization: submittedFilters.specialization,
        registeredTimeFrom: submittedFilters.registeredTimeFrom
          ? dayjs(submittedFilters.registeredTimeFrom).format("YYYY-MM-DD")
          : undefined,
        registeredTimeTo: submittedFilters.registeredTimeTo
          ? dayjs(submittedFilters.registeredTimeTo).format("YYYY-MM-DD")
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

    try {
      const date =
        selectedDate instanceof Date
          ? selectedDate
          : new Date(selectedDate ?? "");
      if (!isNaN(date.getTime())) {
        isoSelected = dayjs(date).format("YYYY-MM-DD");
      }
    } catch (error) {
      console.error("❌ Lỗi khi xử lý selectedDate:", error);
    }

    const isoDate =
      isoSelected && isoSelected !== confirmedPatient.ngayDangKy
        ? isoSelected
        : confirmedPatient.ngayDangKy;

    const updatedPatient = { ...confirmedPatient, ngayDangKy: isoDate };
    setConfirmedPatient(updatedPatient);

    await queuePatient(
      updatedPatient.id.toString(),
      `${isoDate}T00:00:00`,
      async () => {
        const filters = {
          patientId: submittedFilters.patientId,
          fullName: submittedFilters.fullName,
          phone: submittedFilters.phone,
          patientCode: submittedFilters.patientCode,
          specialization: submittedFilters.specialization,
          registeredTimeFrom: submittedFilters.registeredTimeFrom
            ? dayjs(submittedFilters.registeredTimeFrom).format("YYYY-MM-DD")
            : undefined,
          registeredTimeTo: submittedFilters.registeredTimeTo
            ? dayjs(submittedFilters.registeredTimeTo).format("YYYY-MM-DD")
            : undefined,

          status: submittedFilters.status,
        };

        const { content, totalElements } = await fetchTodayRegisteredPatients(
          page - 1,
          pageSize,
          filters
        );

        const safePatients: Patient[] = content.map((p) => ({
          ...p,
          ngayDangKy: p.ngayDangKy ?? null,
          stt: p.stt ?? "",
          phongKham: p.phongKham ?? "",
        }));
        setPatientsToday(safePatients);
        setTotalTodayPatients(totalElements);
        setConfirmedPatient(null);
        setSelectedDate(null);
      },
      updatedPatient.phongKham || undefined,
      updatedPatient.specializationId,
      updatedPatient.isPriority
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
    if (
      confirmedPatient?.ngayDangKy &&
      !isNaN(Date.parse(confirmedPatient.ngayDangKy))
    ) {
      const date = new Date(confirmedPatient.ngayDangKy);
      const isDifferent =
        !(selectedDate instanceof Date) ||
        date.toDateString() !== selectedDate.toDateString();

      if (isDifferent) {
        setSelectedDate(date);
      }
    }
  }, [confirmedPatient?.ngayDangKy]);

  return (
    <Container fluid size="100%" className="pt-6 px-6   max-w-[1600px] mx-auto">
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

      <div className="flex flex-col lg:flex-row gap-4 mt-6">
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
                      onChange={(value) =>
                        setSearchFilters({
                          ...searchFilters,
                          registeredTimeFrom: value ? new Date(value) : today,
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
                          registeredTimeTo: value ? new Date(value) : today,
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
                      const now = dayjs().startOf("day").toDate();
                      const reset = {
                        fullName: "",
                        patientId: "",
                        phone: "",
                        patientCode: "",
                        specialization: "",
                        registeredTimeFrom: now,
                        registeredTimeTo: now,
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
                <Tabs.List className="flex gap-4">
                  <Tabs.Tab value="register-info">Thông tin đăng ký</Tabs.Tab>
                  <Tabs.Tab value="register-info-2">
                    Thông tin đăng ký online
                  </Tabs.Tab>
                </Tabs.List>

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
                {confirmedPatient && (
                  <div className="grid grid-cols-12 gap-2">
                    {/* Chuyên khoa */}
                    <div className="col-span-12 md:col-span-3">
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
                                  phongKham: "", // 👉 reset lại phòng khám khi đổi chuyên khoa
                                }
                              : prev
                          )
                        }
                        searchable
                        disabled={loadingSpecializations}
                      />
                    </div>

                    {/* Phòng khám */}
                    <div className="col-span-12 md:col-span-3">
                      <Select
                        label="Phòng khám"
                        placeholder="Chọn phòng khám"
                        data={departments
                          .filter((dep) => !!dep.roomNumber)
                          .map((dep) => ({
                            value: dep.roomNumber as string,
                            label: dep.roomNumber as string,
                          }))}
                        value={confirmedPatient?.phongKham || ""}
                        onChange={(value) =>
                          setConfirmedPatient((prev) =>
                            prev ? { ...prev, phongKham: value || "" } : prev
                          )
                        }
                        searchable
                        disabled={
                          !confirmedPatient?.specializationId ||
                          loadingDepartments
                        }
                      />
                    </div>

                    {/* Ngày đăng ký */}
                    <div className="col-span-12 md:col-span-3">
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
                    </div>

                    {/* Ưu tiên */}
                    <div className="col-span-12 md:col-span-3 flex items-end">
                      <Checkbox
                        label="Ưu tiên"
                        disabled={!confirmedPatient}
                        checked={confirmedPatient?.isPriority ?? false}
                        onChange={(e) => {
                          if (!confirmedPatient) return;
                          setConfirmedPatient({
                            ...confirmedPatient,
                            isPriority: e.currentTarget.checked,
                          });
                        }}
                      />
                    </div>
                  </div>
                )}
              </Tabs.Panel>

              <Tabs.Panel value="register-info-2" pt="xs">
                <Divider
                  label="Danh sách bệnh nhân đăng ký khám online"
                  mb="sm"
                />

                <div className="grid grid-cols-12 gap-4 my-4">
                  <div className="col-span-12 md:col-span-3">
                    <FloatingLabelWrapper label="Họ tên">
                      <TextInput
                        placeholder="Nhập họ tên"
                        value={onlineSearchFilters.fullName}
                        onChange={(e) =>
                          setOnlineSearchFilters((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                      />
                    </FloatingLabelWrapper>
                  </div>

                  <div className="col-span-12 md:col-span-2">
                    <FloatingLabelWrapper label="Email">
                      <TextInput
                        placeholder="Nhập email"
                        value={onlineSearchFilters.email}
                        onChange={(e) =>
                          setOnlineSearchFilters((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </FloatingLabelWrapper>
                  </div>

                  <div className="col-span-12 md:col-span-2">
                    <FloatingLabelWrapper label="Số điện thoại">
                      <TextInput
                        placeholder="Nhập số điện thoại"
                        value={onlineSearchFilters.phoneNumber}
                        onChange={(e) =>
                          setOnlineSearchFilters((prev) => ({
                            ...prev,
                            phoneNumber: e.target.value,
                          }))
                        }
                      />
                    </FloatingLabelWrapper>
                  </div>

                  <div className="col-span-12 md:col-span-3">
                    <FloatingLabelWrapper label="Chọn Ngày đăng ký">
                      <DatePickerInput
                        placeholder="Chọn ngày"
                        value={onlineDate}
                        onChange={
                          (value) =>
                            setOnlineDate(value ? new Date(value) : new Date()) // hoặc today
                        }
                        valueFormat="DD/MM/YYYY"
                      />
                    </FloatingLabelWrapper>
                  </div>

                  <div className="col-span-12 md:col-span-2 flex items-end gap-2">
                    <Button
                      variant="light"
                      color="gray"
                      onClick={() => {
                        const reset = {
                          registeredAt: dayjs().format("YYYY-MM-DD"),
                          fullName: "",
                          email: "",
                          phoneNumber: "",
                        };

                        setOnlineSearchFilters(reset);
                        setSubmittedOnlineFilters(reset);
                        setOnlineDate(new Date());
                        setOnlinePage(1);
                      }}
                    >
                      Tải lại
                    </Button>

                    <Button
                      variant="filled"
                      onClick={() => {
                        const updatedFilters = {
                          ...onlineSearchFilters,
                          registeredAt: dayjs(onlineDate).format("YYYY-MM-DD"),
                        };
                        setSubmittedOnlineFilters(updatedFilters);
                        setOnlinePage(1);
                      }}
                    >
                      Tìm kiếm
                    </Button>
                  </div>
                </div>

                <CustomTable
                  data={onlinePatients}
                  columns={onlineColumns}
                  page={onlinePage}
                  pageSize={onlinePageSize}
                  totalItems={totalOnlinePatients}
                  onPageChange={setOnlinePage}
                  onPageSizeChange={setOnlinePageSize}
                  showActions={false}
                  pageSizeOptions={setting?.paginationSizeList
                    ?.slice()
                    .sort((a, b) => a - b)}
                />
              </Tabs.Panel>
            </Tabs>
          </Paper>
        </div>
      </div>
    </Container>
  );
}
