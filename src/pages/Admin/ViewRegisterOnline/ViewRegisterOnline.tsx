import { Button, Select, TextInput, Modal, Group, Text } from "@mantine/core";
import { DatePickerInput, DateTimePicker } from "@mantine/dates";
import { useEffect, useState } from "react";
import dayjs from "dayjs"; // [ADDED] format ISO 'YYYY-MM-DDTHH:mm:ss'
import { useViewRegisterOnline } from "../../../hooks/ViewRegisterOnline/useViewRegisterOnline";
import { OnlineRegisteredPatient } from "../../../types/Admin/ViewRegisterOnline/ViewRegisterOnline";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import CustomTable from "../../../components/common/CustomTable";

const ViewRegisterOnlinePage = () => {
  const {
    fetchOnlinePatients,
    updateConfirmationStatus,
    updateRegisteredAt, // [ADDED]
    loading,
  } = useViewRegisterOnline();

  const [patients, setPatients] = useState<OnlineRegisteredPatient[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchFullNameInput, setSearchFullNameInput] = useState("");
  const [searchPhoneInput, setSearchPhoneInput] = useState("");
  const [searchEmailInput, setSearchEmailInput] = useState("");
  const [searchIsConfirmed, setSearchIsConfirmed] = useState<string | null>(
    null
  );
  const [registeredAt, setRegisteredAt] = useState<Date | null>(new Date());

  // [ADDED] state cho modal "Đổi lịch hẹn"
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleRow, setRescheduleRow] =
    useState<OnlineRegisteredPatient | null>(null);
  const [rescheduleDateTime, setRescheduleDateTime] = useState<Date | null>(
    null
  );

  // Hàm build filters từ state hiện tại
  const buildFilters = () => {
    const filters: any = {};
    if (searchFullNameInput) filters.fullName = searchFullNameInput;
    if (searchPhoneInput) filters.phoneNumber = searchPhoneInput;
    if (searchEmailInput) filters.email = searchEmailInput;
    if (searchIsConfirmed !== null)
      filters.isConfirmed = searchIsConfirmed === "true";
    if (registeredAt)
      filters.registeredAt = new Date(registeredAt).toISOString().split("T")[0];
    return filters;
  };

  const loadPatients = async (customFilters?: any) => {
    const filters = customFilters ?? buildFilters();
    const res = await fetchOnlinePatients(page - 1, pageSize, filters);
    setPatients(res.content);
    setTotalItems(res.totalElements);
  };

  useEffect(() => {
    loadPatients(); // lần đầu load với ngày hôm nay
  }, []);

  useEffect(() => {
    if (page !== 1) {
      loadPatients();
    }
  }, [page, pageSize]);

  const handleSearch = () => {
    setPage(1);
    loadPatients(); // dùng filters hiện tại
  };

  const handleReset = () => {
    setSearchFullNameInput("");
    setSearchPhoneInput("");
    setSearchEmailInput("");
    setSearchIsConfirmed(null);
    setRegisteredAt(null);
    setPage(1);
    loadPatients({});
  };

  const openReschedule = (row: OnlineRegisteredPatient) => {
    setRescheduleRow(row);
    setRescheduleDateTime(new Date(row.registeredAt));
    setRescheduleOpen(true);
  };

  const confirmReschedule = async () => {
    if (!rescheduleRow || !rescheduleDateTime) return;
    const iso = dayjs(rescheduleDateTime)
      .second(0)
      .millisecond(0)
      .format("YYYY-MM-DDTHH:mm:ss");
    await updateRegisteredAt(rescheduleRow.id, iso);
    setRescheduleOpen(false);
    setRescheduleRow(null);
    await loadPatients();
  };

  const columns = [
    { key: "fullName", label: "Họ tên" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "SĐT" },
    {
      key: "registeredAt",
      label: "Thời gian đăng ký",
      render: (row: OnlineRegisteredPatient) =>
        new Date(row.registeredAt).toLocaleString(),
    },
    {
      key: "isConfirmed",
      label: "Trạng thái",
      render: (row: OnlineRegisteredPatient) => (
        <span
          className={`font-semibold ${
            row.isConfirmed ? "text-green-600" : "text-red-600"
          }`}
        >
          {row.isConfirmed ? "Đã xác nhận" : "Chưa xác nhận"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Thao tác",

      render: (row: OnlineRegisteredPatient) => (
        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="subtle"
            onClick={() =>
              updateConfirmationStatus(row.id, !row.isConfirmed).then(
                loadPatients
              )
            }
          >
            {row.isConfirmed ? "Bỏ xác nhận" : "Xác nhận"}
          </Button>

          {/* Nút mới: Đổi lịch hẹn */}
          <Button size="xs" variant="light" onClick={() => openReschedule(row)}>
            Đổi lịch hẹn
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">
        Danh sách bệnh nhân đăng ký khám online
      </h1>

      <div className="grid grid-cols-12 gap-4 my-4">
        <div className="col-span-12 md:col-span-2">
          <FloatingLabelWrapper label="Tìm theo họ tên">
            <TextInput
              placeholder="Họ tên"
              value={searchFullNameInput}
              onChange={(e) => setSearchFullNameInput(e.currentTarget.value)}
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 md:col-span-2">
          <FloatingLabelWrapper label="Tìm theo SĐT">
            <TextInput
              placeholder="Số điện thoại"
              value={searchPhoneInput}
              onChange={(e) => setSearchPhoneInput(e.currentTarget.value)}
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 md:col-span-2">
          <FloatingLabelWrapper label="Tìm theo Email">
            <TextInput
              placeholder="Email"
              value={searchEmailInput}
              onChange={(e) => setSearchEmailInput(e.currentTarget.value)}
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 md:col-span-2">
          <FloatingLabelWrapper label="Trạng thái đến khám">
            <Select
              placeholder="Chọn trạng thái"
              data={[
                { value: "true", label: "Đã xác nhận" },
                { value: "false", label: "Chưa xác nhận" },
              ]}
              value={searchIsConfirmed}
              onChange={setSearchIsConfirmed}
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 md:col-span-2">
          <FloatingLabelWrapper label="Ngày đăng ký">
            <DatePickerInput
              type="default"
              value={registeredAt}
              onChange={(value) => setRegisteredAt(value as Date | null)}
              placeholder="Chọn ngày"
              valueFormat="DD/MM/YYYY"
              clearable
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 md:col-span-2 flex items-end gap-2">
          <Button variant="light" color="gray" onClick={handleReset}>
            Tải lại
          </Button>
          <Button variant="filled" color="blue" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </div>
      </div>

      <CustomTable
        data={patients}
        columns={columns}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => setPageSize(s)}
        loading={loading}
        showActions={false}
      />

      <Modal
        opened={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        title="Đổi lịch hẹn"
        centered
      >
        <div className="space-y-3">
          <Text size="sm" c="dimmed">
            Chọn ngày & giờ đăng ký mới cho:{" "}
            <strong>{rescheduleRow?.fullName}</strong>
          </Text>

          <DateTimePicker
            value={rescheduleDateTime}
            onChange={(v) => setRescheduleDateTime(v as Date | null)}
            valueFormat="DD/MM/YYYY HH:mm"
            placeholder="Chọn ngày giờ mới"
            clearable={false}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setRescheduleOpen(false)}>
              Hủy
            </Button>
            <Button onClick={confirmReschedule} disabled={!rescheduleDateTime}>
              Lưu
            </Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
};

export default ViewRegisterOnlinePage;
