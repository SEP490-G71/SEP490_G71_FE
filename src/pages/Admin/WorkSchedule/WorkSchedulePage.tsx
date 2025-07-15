import { useEffect, useState } from "react";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { useWorkSchedule } from "../../../hooks/workSchedule/useWorkSchedule";
import {
  WorkSchedule,
  WorkScheduleDetail,
} from "../../../types/Admin/WorkSchedule/WorkSchedule";
import WorkScheduleListModal from "../../../components/admin/WorkSchedule/WorkScheduleListModal";
import WorkScheduleFormModal from "../../../components/admin/WorkSchedule/WorkScheduleFormModal";
import { Button, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import useStaffSearch from "../../../hooks/StatisticSchedule/useStaffSearch";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";

export const WorkSchedulePage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { setting } = useSettingAdminService();
  const {
    workSchedules,
    loading,
    fetchWorkSchedules,
    fetchWorkScheduleDetailByStaffId,
    updateWorkSchedule,
    deleteWorkScheduleByStaff,
    createWorkSchedule,
  } = useWorkSchedule();

  const [detailModalOpened, setDetailModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [workScheduleDetails, setWorkScheduleDetails] = useState<
    WorkScheduleDetail[]
  >([]);
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

  const { options: staffOptions, searchStaffs } = useStaffSearch();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchWorkSchedules(page - 1, pageSize, {
        // ❌ Không gửi staffId lên BE
        shift: filterInput.shift || undefined,
        fromDate: filterInput.fromDate
          ? dayjs(filterInput.fromDate).format("YYYY-MM-DD")
          : undefined,
        toDate: filterInput.toDate
          ? dayjs(filterInput.toDate).format("YYYY-MM-DD")
          : undefined,
        dayOfWeek: filterInput.dayOfWeek || undefined,
      });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [
    filterInput.shift,
    filterInput.fromDate,
    filterInput.toDate,
    filterInput.dayOfWeek,
    page,
    pageSize,
  ]);

  const handleReset = () => {
    setFilterInput({
      staffId: "",
      shift: "",
      fromDate: null,
      toDate: null,
      dayOfWeek: "",
    });
    setPage(1);
    fetchWorkSchedules(0, pageSize);
  };

  const handleView = async (row: WorkSchedule) => {
    const details = await fetchWorkScheduleDetailByStaffId(row.staffId);
    setWorkScheduleDetails(Array.isArray(details) ? details : []);
    setSelectedSchedule(row);
    setDetailModalOpened(true);
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
    if (selectedSchedule) {
      await updateWorkSchedule(formData);
    } else {
      await createWorkSchedule(formData);
    }
    setEditModalOpened(false);
    setSelectedSchedule(null);
    fetchWorkSchedules(page - 1, pageSize);
  };

  // ✅ Lọc staffId ở FE
  const filteredData = workSchedules.filter(
    (item) => !filterInput.staffId || item.staffId === filterInput.staffId
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
        const map = {
          MORNING: "Ca sáng",
          AFTERNOON: "Ca chiều",
          NIGHT: "Ca tối",
          FULL_DAY: "Cả ngày",
        };
        return row.shifts.map((s) => map[s] || s).join(", ");
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
    createColumn<WorkSchedule>({
      key: "note",
      label: "Ghi chú",
      render: (row) => row.note,
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
        <Select
          label="Nhân viên"
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
        <Select
          label="Ca trực"
          data={[
            { value: "MORNING", label: "Sáng" },
            { value: "AFTERNOON", label: "Chiều" },
            { value: "NIGHT", label: "Tối" },
          ]}
          value={filterInput.shift}
          onChange={(value) =>
            setFilterInput({ ...filterInput, shift: value || "" })
          }
          placeholder="Chọn ca trực"
          clearable
        />
        <DatePickerInput
          label="Từ ngày"
          value={filterInput.fromDate}
          onChange={(value) =>
            setFilterInput({ ...filterInput, fromDate: value as Date | null })
          }
          placeholder="Từ ngày"
          valueFormat="DD/MM/YYYY"
        />
        <DatePickerInput
          label="Đến ngày"
          value={filterInput.toDate}
          onChange={(value) =>
            setFilterInput({ ...filterInput, toDate: value as Date | null })
          }
          placeholder="Đến ngày"
          valueFormat="DD/MM/YYYY"
        />
        <Select
          label="Thứ"
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
        <div className="flex gap-2 items-end">
          <Button color="blue" variant="filled" onClick={handleReset}>
            Reset
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
        pageSizeOptions={setting?.paginationSizeList || [5, 10, 20, 50]}
      />

      <WorkScheduleListModal
        opened={detailModalOpened}
        onClose={() => setDetailModalOpened(false)}
        schedules={workScheduleDetails}
        staffName={selectedSchedule?.staffName}
        onReloadDetail={async () => {
          if (selectedSchedule) {
            const details = await fetchWorkScheduleDetailByStaffId(
              selectedSchedule.staffId
            );
            setWorkScheduleDetails(details);
          }
        }}
        onReloadList={() => {
          fetchWorkSchedules(page - 1, pageSize);
        }}
        startDate={selectedSchedule?.startDate}
        endDate={selectedSchedule?.endDate}
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
