import { useEffect, useState } from "react";
import { Badge, Button, Group, Popover, Select, Textarea } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { ThumbsUp, X } from "lucide-react";

import PageMeta from "../../../components/common/PageMeta";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";

import axiosInstance from "../../../services/axiosInstance";
import { useUpdateLeaveRequestStatus } from "../../../hooks/leave/useUpdateLeaveRequestStatus";
import { useSearchStaffs } from "../../../hooks/staffs-service/useSearchStaffs";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import {
  useDateFilterValidation,
  validateDateNotFuture,
  validateFromDateToDate,
} from "../../../hooks/useDateFilterValidation";
import { isFullDayLeave } from "../../../hooks/leave/isFullDayLeave";
import useDivideShift from "../../../hooks/DivideShift/useDivideShift";

import { LeaveRequestResponse } from "../../../types/Admin/Leave/LeaveRequestResponse";
import {
  LeaveRequestStatus,
  LeaveRequestStatusLabels,
} from "../../../enums/Admin/LeaveRequestStatus";
import { useDeleteLeaveRequest } from "../../../hooks/leave/useDeleteLeaveRequest";

const LeaveAdminPage = () => {
  const [data, setData] = useState<LeaveRequestResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStaffId, setFilterStaffId] = useState("");
  const [selectedStaffOption, setSelectedStaffOption] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);
  const [fromDateError, setFromDateError] = useState<string | null>(null);
  const [toDateError, setToDateError] = useState<string | null>(null);
  const { validate } = useDateFilterValidation();
  const [staffSearch, setStaffSearch] = useState("");
  const { setting } = useSettingAdminService();
  const { shifts, fetchAllShifts } = useDivideShift();
  const { options: rawStaffOptions, loading: loadingStaffSearch } =
    useSearchStaffs(staffSearch);
  const { updateStatus } = useUpdateLeaveRequestStatus();
  const [rejectNote, setRejectNote] = useState("");
  const [openedPopoverId, setOpenedPopoverId] = useState<string | null>(null);
  const { deleteLeaveRequest } = useDeleteLeaveRequest();
  const staffOptions = selectedStaffOption
    ? [
        selectedStaffOption,
        ...rawStaffOptions.filter(
          (opt) => opt.value !== selectedStaffOption.value
        ),
      ]
    : rawStaffOptions;

  const fetchData = async (
    overrides?: Partial<{
      status: string;
      staffId: string;
      fromDate: Date | null;
      toDate: Date | null;
      page: number;
      pageSize: number;
    }>
  ) => {
    const _status = overrides?.status ?? filterStatus;
    const _staffId = overrides?.staffId ?? filterStaffId;
    const _fromDate = overrides?.fromDate ?? filterFromDate;
    const _toDate = overrides?.toDate ?? filterToDate;
    const _page = overrides?.page ?? page;
    const _pageSize = overrides?.pageSize ?? pageSize;

    const isValid = validate(_fromDate, _toDate);
    if (!isValid) {
      setFromDateError(
        validateDateNotFuture(_fromDate) ||
          validateFromDateToDate(_fromDate, _toDate)
      );
      setToDateError(
        validateDateNotFuture(_toDate) ||
          validateFromDateToDate(_fromDate, _toDate)
      );
      return;
    }
    setFromDateError(null);
    setToDateError(null);
    setLoading(true);

    try {
      const params = {
        page: _page - 1,
        size: _pageSize,
        status: _status || undefined,
        staffId: _staffId || undefined,
        createdAtFrom: _fromDate
          ? dayjs(_fromDate).format("YYYY-MM-DD")
          : undefined,
        createdAtTo: _toDate ? dayjs(_toDate).format("YYYY-MM-DD") : undefined,
      };

      const res = await axiosInstance.get(`/leave-requests`, { params });
      const result = res.data?.result;
      setData(result?.content || []);
      setTotalItems(result?.totalElements || 0);
      if (!result?.content?.length) toast.info("Không có dữ liệu nghỉ phép");
    } catch {
      toast.error("Không thể tải danh sách nghỉ phép.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
    fetchAllShifts();
    fetchData();
  }, [setting]);

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  const handleSearch = () => {
    setPage(1);
    setStaffSearch("");
    fetchData();
  };
  const handleResetFilters = () => {
    setFilterStatus("");
    setFilterStaffId("");
    setSelectedStaffOption(null);
    setFilterFromDate(null);
    setFilterToDate(null);
    setStaffSearch("");
    setPage(1);

    fetchData({
      status: "",
      staffId: "",
      fromDate: null,
      toDate: null,
      page: 1,
    });
  };
  const handleStatusChange = async (
    leaveRequestId: string,
    newStatus: LeaveRequestStatus,
    note?: string
  ) => {
    try {
      const payload = {
        leaveRequestId,
        status: newStatus,
        ...(note && { note }),
      };
      await updateStatus(payload);
      fetchData();
    } catch {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleDelete = async (row: LeaveRequestResponse) => {
    const ok = await deleteLeaveRequest(row.id);
    if (ok) {
      fetchData();
    }
  };

  const columns = [
    createColumn<LeaveRequestResponse>({
      key: "staffName",
      label: "Tên nhân viên",
    }),
    createColumn<LeaveRequestResponse>({ key: "reason", label: "Lý do nghỉ" }),
    createColumn<LeaveRequestResponse>({
      key: "details",
      label: "Ngày nghỉ + Ca",
      render: (row) => {
        const details = row.details ?? [];
        if (details.length === 0) return "—";

        if (isFullDayLeave(details)) {
          const sortedDates = [...new Set(details.map((d) => d.date))].sort();
          return `Từ ${dayjs(sortedDates[0]).format("DD/MM/YYYY")} đến ${dayjs(
            sortedDates[sortedDates.length - 1]
          ).format("DD/MM/YYYY")} (Cả ngày)`;
        }

        return details
          .map((d) => {
            const shiftName =
              shifts.find((s) => s.id === d.shiftId)?.name || "Ca?";
            return `${dayjs(d.date).format("DD/MM/YYYY")} (${shiftName})`;
          })
          .join(", ");
      },
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

      <div className="grid grid-cols-12 gap-4 my-4">
        <div className="col-span-12 md:col-span-3">
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
                  ([key, label]) => ({ value: key, label })
                ),
              ]}
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 md:col-span-3">
          <FloatingLabelWrapper label="Nhân viên">
            <Select
              searchable
              clearable
              placeholder="Nhập tên hoặc mã nhân viên"
              value={filterStaffId || null}
              searchValue={staffSearch}
              onSearchChange={setStaffSearch}
              onDropdownClose={() => setStaffSearch("")}
              onChange={(val) => {
                const selected = staffOptions.find((opt) => opt.value === val);
                setSelectedStaffOption(selected || null);
                setFilterStaffId(val || "");
                setPage(1);
              }}
              data={staffOptions}
              className="w-full"
              styles={{
                input: {
                  height: 36,
                  marginTop: "2px",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                },
              }}
              rightSection={
                loadingStaffSearch ? <span className="mr-2">⏳</span> : null
              }
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 md:col-span-2">
          <FloatingLabelWrapper label="Ngày tạo từ">
            <DatePickerInput
              placeholder="Chọn ngày"
              value={filterFromDate}
              onChange={(val) => {
                const date = val as Date | null;
                setFilterFromDate(date);
                setPage(1);
                setFromDateError(
                  validateDateNotFuture(date) ||
                    validateFromDateToDate(date, filterToDate)
                );
              }}
              error={fromDateError}
              className="w-full"
              styles={{
                input: {
                  height: 36,
                  marginTop: "2px",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                },
              }}
              valueFormat="DD/MM/YYYY"
              clearable
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 md:col-span-2">
          <FloatingLabelWrapper label="Ngày tạo đến">
            <DatePickerInput
              placeholder="Đến ngày"
              value={filterToDate}
              onChange={(val) => {
                const date = val as Date | null;
                setFilterToDate(date);
                setPage(1);
                setToDateError(
                  validateDateNotFuture(date) ||
                    validateFromDateToDate(filterFromDate, date)
                );
              }}
              error={toDateError}
              className="w-full"
              styles={{
                input: {
                  height: 36,
                  marginTop: "2px",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                },
              }}
              valueFormat="DD/MM/YYYY"
              clearable
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 md:col-span-2 flex items-end gap-2 justify-end">
          <Button variant="light" color="gray" onClick={handleResetFilters}>
            Tải lại
          </Button>
          <Button variant="filled" color="blue" onClick={handleSearch}>
            Tìm kiếm
          </Button>
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
        loading={loading}
        onDelete={handleDelete}
      />
    </>
  );
};

export default LeaveAdminPage;
