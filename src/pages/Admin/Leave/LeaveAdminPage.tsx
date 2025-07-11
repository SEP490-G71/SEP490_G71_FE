import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Group,
  Input,
  Popover,
  Select,
  Textarea,
} from "@mantine/core";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import { LeaveRequestResponse } from "../../../types/Admin/Leave/LeaveRequestResponse";
import {
  LeaveRequestStatus,
  LeaveRequestStatusLabels,
} from "../../../enums/Admin/LeaveRequestStatus";
import { ShiftLabels } from "../../../enums/Admin/Shift";
import PageMeta from "../../../components/common/PageMeta";
import dayjs from "dayjs";
import { ThumbsUp, X } from "lucide-react";
import { useUpdateLeaveRequestStatus } from "../../../hooks/leave/useUpdateLeaveRequestStatus";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import { DatePickerInput } from "@mantine/dates";
import {
  useDateFilterValidation,
  validateDateNotFuture,
  validateFromDateToDate,
} from "../../../hooks/useDateFilterValidation";

const LeaveAdminPage = () => {
  const [data, setData] = useState<LeaveRequestResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] =
    useState<keyof LeaveRequestResponse>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [filterStatus, setFilterStatus] = useState("");
  const [filterStaffId, setFilterStaffId] = useState("");
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);
  const [fromDateError, setFromDateError] = useState<string | null>(null);
  const [toDateError, setToDateError] = useState<string | null>(null);
  const { validate } = useDateFilterValidation();

  const fetchData = async () => {
    const isValid = validate(filterFromDate, filterToDate);

    // Nếu không hợp lệ, tự set lỗi để hiện ở ô input
    if (!isValid) {
      const error1 = validateDateNotFuture(filterFromDate);
      const error2 = validateDateNotFuture(filterToDate);
      const error3 = validateFromDateToDate(filterFromDate, filterToDate);

      setFromDateError(error1 || error3);
      setToDateError(error2 || error3);
      return;
    }

    // Nếu hợp lệ, clear lỗi và gọi API
    setFromDateError(null);
    setToDateError(null);
    setLoading(true);

    try {
      const params = {
        page: page - 1,
        size: pageSize,
        sortBy: sortKey,
        sortDir: sortDirection,
        status: filterStatus || undefined,
        staffId: filterStaffId || undefined,
        createdAtFrom: filterFromDate
          ? dayjs(filterFromDate).format("YYYY-MM-DD")
          : undefined,
        createdAtTo: filterToDate
          ? dayjs(filterToDate).format("YYYY-MM-DD")
          : undefined,
      };

      const res = await axiosInstance.get(`/leave-request`, { params });
      const result = res.data?.result;

      setData(result?.content || []);
      setTotalItems(result?.totalElements || 0);

      if (!result?.content?.length) {
        toast.info("Không có dữ liệu nghỉ phép");
      }
    } catch (err) {
      toast.error("Không thể tải danh sách nghỉ phép.");
    } finally {
      setLoading(false);
    }
  };

  const { updateStatus } = useUpdateLeaveRequestStatus();

  const handleStatusChange = async (
    leaveRequestId: string,
    newStatus: LeaveRequestStatus,
    note?: string
  ) => {
    try {
      const payload: any = {
        leaveRequestId,
        status: newStatus,
      };

      if (note !== undefined && note !== null) {
        payload.note = note;
      }

      console.log("🔍 Payload gửi lên BE:", payload);
      await updateStatus(payload);
      fetchData();
    } catch {}
  };

  useEffect(() => {
    fetchData();
  }, [
    page,
    pageSize,
    sortKey,
    sortDirection,
    filterStatus,
    filterStaffId,
    filterFromDate,
    filterToDate,
  ]);

  const [rejectNote, setRejectNote] = useState("");
  const [openedPopoverId, setOpenedPopoverId] = useState<string | null>(null);
  const handleDelete = async (row: LeaveRequestResponse) => {
    try {
      await axiosInstance.delete(`/leave-request/${row.id}`);
      toast.success("Xoá yêu cầu nghỉ phép thành công");
      fetchData();
    } catch {
      toast.error("Xoá yêu cầu nghỉ phép thất bại");
    }
  };

  const columns = [
    createColumn<LeaveRequestResponse>({
      key: "staffName",
      label: "Tên nhân viên",
    }),
    createColumn<LeaveRequestResponse>({
      key: "reason",
      label: "Lý do nghỉ",
    }),
    createColumn<LeaveRequestResponse>({
      key: "details",
      label: "Ngày nghỉ + Ca",
      render: (row) =>
        row.details.length > 0
          ? row.details
              .map(
                (d) =>
                  `${dayjs(d.date).format("DD/MM/YYYY")} (${
                    ShiftLabels[d.shift]
                  })`
              )
              .join(", ")
          : "—",
    }),
    createColumn<LeaveRequestResponse>({
      key: "status",
      label: "Trạng thái",
      render: (row) => (
        <Group gap={8} className="justify-end w-full">
          {row.status === "PENDING" && (
            <>
              <Badge color="yellow">Chờ Duyệt</Badge>
              <Button
                variant="subtle"
                color="blue"
                leftSection={<ThumbsUp size={14} />}
                size="xs"
                onClick={() =>
                  handleStatusChange(row.id, LeaveRequestStatus.APPROVED)
                }
              >
                Duyệt
              </Button>

              <Popover
                opened={openedPopoverId === row.id}
                onClose={() => setOpenedPopoverId(null)}
                width={260}
                position="bottom"
                withArrow
              >
                <Popover.Target>
                  <Button
                    variant="subtle"
                    color="red"
                    leftSection={<X size={14} />}
                    size="xs"
                    onClick={() => {
                      setOpenedPopoverId(row.id);
                      setRejectNote("");
                    }}
                  >
                    Từ chối
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <Textarea
                    placeholder="Nhập lý do từ chối"
                    minRows={2}
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.currentTarget.value)}
                  />
                  <Group justify="flex-end" mt="xs">
                    <Button
                      size="xs"
                      variant="default"
                      onClick={() => setOpenedPopoverId(null)}
                    >
                      Huỷ
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      onClick={async () => {
                        await handleStatusChange(
                          row.id,
                          LeaveRequestStatus.REJECTED,
                          rejectNote
                        );
                        setOpenedPopoverId(null);
                      }}
                      disabled={!rejectNote.trim()}
                    >
                      Xác nhận
                    </Button>
                  </Group>
                </Popover.Dropdown>
              </Popover>
            </>
          )}

          {row.status === "APPROVED" && <Badge color="blue">Đã Duyệt</Badge>}
          {row.status === "REJECTED" && <Badge color="red">Từ chối</Badge>}
        </Group>
      ),
    }),
  ];

  return (
    <>
      <PageMeta
        title="Quản lý nghỉ phép | Admin Dashboard"
        description="Trang quản lý yêu cầu nghỉ phép của nhân viên"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h1 className="text-xl font-bold">Yêu cầu nghỉ phép</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
        {/* Trạng thái */}
        <FloatingLabelWrapper label="Trạng thái">
          <Select
            placeholder="Chọn trạng thái"
            value={filterStatus}
            onChange={(val) => {
              setPage(1);
              setFilterStatus(val || "");
            }}
            data={[
              { value: "", label: "Tất cả" },
              ...Object.entries(LeaveRequestStatusLabels).map(
                ([key, label]) => ({
                  value: key,
                  label,
                })
              ),
            ]}
            className="w-full"
            styles={{ input: { height: 40, zIndex: 1 } }}
          />
        </FloatingLabelWrapper>

        {/* Tên nhân viên */}
        <FloatingLabelWrapper label="Nhân viên">
          <Input
            placeholder="Nhập tên nhân viên"
            value={filterStaffId}
            onChange={(e) => {
              setPage(1);
              setFilterStaffId(e.currentTarget.value);
            }}
            className="w-full"
            styles={{ input: { height: 40, zIndex: 1 } }}
          />
        </FloatingLabelWrapper>

        {/* Ngày tạo từ */}
        <FloatingLabelWrapper label="Ngày tạo từ">
          <DatePickerInput
            placeholder="Chọn ngày"
            value={filterFromDate}
            onChange={(val) => {
              const date = val as Date | null;
              setFilterFromDate(date);
              setPage(1);

              const error1 = validateDateNotFuture(date);
              const error2 = validateFromDateToDate(date, filterToDate);
              setFromDateError(error1 || error2);
            }}
            error={fromDateError}
            className="w-full"
            styles={{ input: { height: 40, zIndex: 1 } }}
            valueFormat="DD/MM/YYYY"
            clearable
          />
        </FloatingLabelWrapper>

        {/* Ngày tạo đến */}
        <FloatingLabelWrapper label="Ngày tạo đến">
          <DatePickerInput
            placeholder="Đến ngày"
            value={filterToDate}
            onChange={(val) => {
              const date = val as Date | null;
              setFilterToDate(date);
              setPage(1);

              const error1 = validateDateNotFuture(date);
              const error2 = validateFromDateToDate(filterFromDate, date);
              setToDateError(error1 || error2);
            }}
            error={toDateError}
            className="w-full"
            styles={{ input: { height: 40, zIndex: 1 } }}
            valueFormat="DD/MM/YYYY"
            clearable
          />
        </FloatingLabelWrapper>

        {/* Nút tải lại */}
        <div className="flex items-end col-span-1">
          <button
            onClick={() => {
              setFilterStatus("");
              setFilterStaffId("");
              setFilterFromDate(null);
              setFilterToDate(null);
              setPage(1);
            }}
            className="rounded-md bg-blue-400 text-white border border-blue-400 hover:bg-blue-500 transition w-16 h-10 flex items-center justify-center"
            title="Tải lại bộ lọc"
          >
            Tải lại
          </button>
        </div>
      </div>

      <CustomTable
        data={data}
        columns={columns}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        onSortChange={(key, dir) => {
          setSortKey(key);
          setSortDirection(dir);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        loading={loading}
        onDelete={handleDelete}
      />
    </>
  );
};

export default LeaveAdminPage;
