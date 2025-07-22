import { useEffect, useState } from "react";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { useWorkSchedule } from "../../../hooks/workSchedule/useWorkSchedule";
import { WorkSchedule } from "../../../types/Admin/WorkSchedule/WorkSchedule";
import WorkScheduleFormModal from "../../../components/admin/WorkSchedule/WorkScheduleFormModal";
import { Button, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import useStaffSearch from "../../../hooks/StatisticSchedule/useStaffSearch";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import { useShifts } from "../../../hooks/workSchedule/useShifts";
import { DetailScheduleStaffModal } from "../../../components/admin/WorkSchedule/DetailScheduleStaffModal";

export const WorkSchedulePage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { setting } = useSettingAdminService();
  const {
    workSchedules,
    loading,
    fetchWorkSchedules,
    updateWorkSchedule,
    deleteWorkScheduleByStaff,
    createWorkSchedule,
  } = useWorkSchedule();

  const [editModalOpened, setEditModalOpened] = useState(false);
  const [viewModalOpened, setViewModalOpened] = useState(false);

  const [selectedSchedule, setSelectedSchedule] = useState<WorkSchedule | null>(
    null
  );

  const [filterInput, setFilterInput] = useState({
    staffId: "",
    shift: "",
    fromDate: null as Date | null,
    toDate: null as Date | null,
    dayOfWeek: "",
  });

  const [filters, setFilters] = useState({
    staffId: "",
    shift: "",
    fromDate: null as Date | null,
    toDate: null as Date | null,
    dayOfWeek: "",
  });

  const { options: staffOptions, searchStaffs } = useStaffSearch();
  const { shifts: shiftOptions } = useShifts();

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);

  useEffect(() => {
    fetchWorkSchedules(page - 1, pageSize, {
      staffId: filters.staffId || undefined,
      shiftId: filters.shift || undefined,
      fromDate: filters.fromDate
        ? dayjs(filters.fromDate).format("YYYY-MM-DD")
        : undefined,
      toDate: filters.toDate
        ? dayjs(filters.toDate).format("YYYY-MM-DD")
        : undefined,
      dayOfWeek: filters.dayOfWeek || undefined,
    });
  }, [filters, page, pageSize]);

  const handleReset = () => {
    const resetValue = {
      staffId: "",
      shift: "",
      fromDate: null,
      toDate: null,
      dayOfWeek: "",
    };
    setFilterInput(resetValue);
    setFilters(resetValue);
    setPage(1);
  };

  const handleSearch = () => {
    setFilters(filterInput);
    setPage(1);
  };

  const handleView = async (row: WorkSchedule) => {
    setSelectedSchedule(row);
    setViewModalOpened(true);
  };

  const handleEdit = async (row: WorkSchedule) => {
    setSelectedSchedule(row);
    setEditModalOpened(true);
  };

  const handleDelete = async (row: WorkSchedule) => {
    await deleteWorkScheduleByStaff(row.staffId);
    fetchWorkSchedules(page - 1, pageSize);
  };

  const handleSubmit = async (formData: any) => {
    const payload = {
      ...formData,
      shiftIds: formData.shiftIds,
    };

    if (selectedSchedule) {
      await updateWorkSchedule(payload);
    } else {
      await createWorkSchedule(payload);
    }

    setEditModalOpened(false);
    setSelectedSchedule(null);
    fetchWorkSchedules(page - 1, pageSize);
  };

  const filteredData = workSchedules.filter(
    (item) => !filters.staffId || item.staffId === filters.staffId
  );
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalItems = filteredData.length;

  const columns = [
    createColumn<WorkSchedule>({ key: "staffName", label: "Họ và tên" }),
    createColumn<WorkSchedule>({
      key: "shifts",
      label: "Ca trực",
      render: (row) => {
        return row.shifts?.map((s: any) => s.name || "Không rõ").join(", ");
      },
    }),
    createColumn<WorkSchedule>({
      key: "daysOfWeek",
      label: "Ngày",
      render: (row) => {
        const map = {
          MONDAY: "T2",
          TUESDAY: "T3",
          WEDNESDAY: "T4",
          THURSDAY: "T5",
          FRIDAY: "T6",
          SATURDAY: "T7",
          SUNDAY: "CN",
        };
        return row.daysOfWeek
          .map((d) => map[d as keyof typeof map] || d)
          .join(", ");
      },
    }),
    createColumn<WorkSchedule>({
      key: "startDate",
      label: "Từ ngày",
      render: (row) => new Date(row.startDate).toLocaleDateString(),
    }),
    createColumn<WorkSchedule>({
      key: "endDate",
      label: "Đến ngày",
      render: (row) => new Date(row.endDate).toLocaleDateString(),
    }),
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Lịch Làm Việc</h1>
        <Button
          onClick={() => {
            setSelectedSchedule(null);
            setEditModalOpened(true);
          }}
        >
          Tạo
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-12 lg:col-span-2">
          <FloatingLabelWrapper label="Nhân viên">
            <Select
              placeholder="Tìm tên nhân viên"
              data={staffOptions}
              value={filterInput.staffId || null}
              onChange={(value) =>
                setFilterInput({
                  ...filterInput,
                  staffId: typeof value === "string" ? value : "",
                })
              }
              onSearchChange={(query) => searchStaffs(query)}
              clearable
              searchable
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 lg:col-span-2">
          <FloatingLabelWrapper label="Ca trực">
            <Select
              data={shiftOptions}
              value={filterInput.shift}
              onChange={(value) =>
                setFilterInput({ ...filterInput, shift: value || "" })
              }
              placeholder="Chọn ca trực"
              clearable
              searchable
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 lg:col-span-2">
          <FloatingLabelWrapper label="Từ ngày">
            <DatePickerInput
              value={filterInput.fromDate}
              onChange={(value) =>
                setFilterInput({
                  ...filterInput,
                  fromDate: value as Date | null,
                })
              }
              placeholder="Từ ngày"
              valueFormat="DD/MM/YYYY"
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 lg:col-span-2">
          <FloatingLabelWrapper label="Đến ngày">
            <DatePickerInput
              value={filterInput.toDate}
              onChange={(value) =>
                setFilterInput({ ...filterInput, toDate: value as Date | null })
              }
              placeholder="Đến ngày"
              valueFormat="DD/MM/YYYY"
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 lg:col-span-2">
          <FloatingLabelWrapper label="Thứ">
            <Select
              data={[
                { value: "MONDAY", label: "Thứ 2" },
                { value: "TUESDAY", label: "Thứ 3" },
                { value: "WEDNESDAY", label: "Thứ 4" },
                { value: "THURSDAY", label: "Thứ 5" },
                { value: "FRIDAY", label: "Thứ 6" },
                { value: "SATURDAY", label: "Thứ 7" },
                { value: "SUNDAY", label: "Chủ nhật" },
              ]}
              value={filterInput.dayOfWeek}
              onChange={(value) =>
                setFilterInput({ ...filterInput, dayOfWeek: value || "" })
              }
              placeholder="Chọn thứ"
              clearable
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 lg:col-span-2 flex items-end gap-2">
          <Button color="gray" variant="light" onClick={handleReset} fullWidth>
            Tải lại
          </Button>
          <Button
            color="blue"
            variant="filled"
            onClick={handleSearch}
            fullWidth
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <CustomTable
        data={paginatedData}
        columns={columns}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        showActions={true}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DetailScheduleStaffModal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        staffId={selectedSchedule?.staffId || ""}
        staffName={selectedSchedule?.staffName}
      />

      <WorkScheduleFormModal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        initialData={selectedSchedule}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default WorkSchedulePage;
