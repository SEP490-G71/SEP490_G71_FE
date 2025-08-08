import { Button, Select, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { useViewRegisterOnline } from "../../../hooks/ViewRegisterOnline/useViewRegisterOnline";
import { OnlineRegisteredPatient } from "../../../types/Admin/ViewRegisterOnline/ViewRegisterOnline";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import CustomTable from "../../../components/common/CustomTable";

const ViewRegisterOnlinePage = () => {
  const { fetchOnlinePatients, updateConfirmationStatus, loading } =
    useViewRegisterOnline();

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
  const [registeredAt, setRegisteredAt] = useState<Date | null>(new Date()); // Mặc định ngày hôm nay

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

  const columns = [
    {
      key: "fullName",
      label: "Họ tên",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phoneNumber",
      label: "SĐT",
    },
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
        showActions
        onEdit={(row) =>
          updateConfirmationStatus(row.id, !row.isConfirmed).then(loadPatients)
        }
      />
    </div>
  );
};

export default ViewRegisterOnlinePage;
