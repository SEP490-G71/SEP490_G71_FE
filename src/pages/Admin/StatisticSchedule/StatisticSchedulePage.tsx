// ✅ File: StatisticSchedulePage.tsx
import { useEffect, useState } from "react";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { useStatisticSchedule } from "../../../hooks/StatisticSchedule/useStatisticSchedule";
import { ScheduleStatisticItem } from "../../../types/Admin/StatisticSchedule/StatisticSchedule";
import { DatePickerInput } from "@mantine/dates";
import { Button, Select } from "@mantine/core";
import dayjs from "dayjs";
import useStaffSearch from "../../../hooks/StatisticSchedule/useStaffSearch";
import { LuDownload } from "react-icons/lu";

export const StatisticSchedulePage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [staffId, setStaffId] = useState<string | null>(null);

  const { options: staffOptions, searchStaffs } = useStaffSearch();

  const {
    statistics,
    loading,
    fetchScheduleStatistics,
    exportScheduleStatistics,
    summary,
  } = useStatisticSchedule();

  useEffect(() => {
    fetchScheduleStatistics(page - 1, pageSize, {
      fromDate: fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : undefined,
      toDate: toDate ? dayjs(toDate).format("YYYY-MM-DD") : undefined,
    });
  }, [page, pageSize, fromDate, toDate]);

  const filteredStatistics = statistics.filter(
    (item) => !staffId || item.staffId === staffId
  );

  const paginatedData = filteredStatistics.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalItems = filteredStatistics.length;

  const handleExport = () => {
    exportScheduleStatistics({
      fromDate: fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : undefined,
      toDate: toDate ? dayjs(toDate).format("YYYY-MM-DD") : undefined,
      staffId: staffId || undefined,
    });
  };

  const columns = [
    createColumn<ScheduleStatisticItem>({ key: "staffName", label: "Họ tên" }),
    createColumn<ScheduleStatisticItem>({
      key: "staffCode",
      label: "Mã nhân viên",
    }),
    createColumn<ScheduleStatisticItem>({
      key: "totalShifts",
      label: "Tổng ca",
    }),
    createColumn<ScheduleStatisticItem>({
      key: "attendedShifts",
      label: "Đã làm",
    }),
    createColumn<ScheduleStatisticItem>({
      key: "leaveShifts",
      label: "Đã nghỉ",
    }),
    createColumn<ScheduleStatisticItem>({
      key: "attendanceRate",
      label: "Tỷ lệ đi làm",
      render: (row) => `${row.attendanceRate.toFixed(2)}%`,
    }),
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold">Thống kê lịch làm việc</h1>
        <Button
          leftSection={<LuDownload size={16} />}
          onClick={handleExport}
          variant="filled"
          color="blue"
        >
          Xuất Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 text-sm">
        <div className="bg-blue-50 border border-blue-200 rounded shadow p-4 text-blue-700">
          <div className="font-medium">Tổng nhân viên</div>
          <div className="text-xl font-bold">{summary.totalStaffs}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded shadow p-4 text-yellow-700">
          <div className="font-medium">Tổng ca</div>
          <div className="text-xl font-bold">{summary.totalShifts}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded shadow p-4 text-green-700">
          <div className="font-medium">Đã làm</div>
          <div className="text-xl font-bold">{summary.attendedShifts}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded shadow p-4 text-red-700">
          <div className="font-medium">Đã nghỉ</div>
          <div className="text-xl font-bold">{summary.leaveShifts}</div>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded shadow p-4 text-indigo-700">
          <div className="font-medium">Tỷ lệ đi làm</div>
          <div className="text-xl font-bold">
            {summary.attendanceRate.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 w-full">
        <DatePickerInput
          placeholder="Từ ngày"
          value={fromDate}
          onChange={(value) => setFromDate(value ? new Date(value) : null)}
          className="w-full"
          valueFormat="DD/MM/YYYY"
        />
        <DatePickerInput
          placeholder="Đến ngày"
          value={toDate}
          onChange={(value) => setToDate(value ? new Date(value) : null)}
          className="w-full"
          valueFormat="DD/MM/YYYY"
        />
        <Select
          placeholder="Tìm tên nhân viên"
          data={staffOptions}
          value={staffId}
          onChange={setStaffId}
          onSearchChange={(query) => searchStaffs(query)}
          clearable
          searchable
          className="w-full"
        />
        <div className="flex items-end">
          <Button
            variant="filled"
            color="blue"
            onClick={() => {
              setFromDate(null);
              setToDate(null);
              setStaffId(null);
              setPage(1);
            }}
            className="px-4 py-2 text-sm"
          >
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
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        loading={loading}
        showActions={false}
      />
    </>
  );
};

export default StatisticSchedulePage;
