import { useEffect, useState } from "react";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { useStatisticSchedule } from "../../../hooks/StatisticSchedule/useStatisticSchedule";
import { ScheduleStatisticItem } from "../../../types/Admin/StatisticSchedule/StatisticSchedule";
import { DatePickerInput } from "@mantine/dates";
import { Button, Select, TextInput } from "@mantine/core";
import dayjs from "dayjs";
import useStaffSearch from "../../../hooks/StatisticSchedule/useStaffSearch";
import { LuDownload } from "react-icons/lu";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";

interface SearchFilters {
  fromDate: Date | null;
  toDate: Date | null;
  staffId: string | null;
  staffCodeSearch: string;
}

interface AppliedFilters {
  fromDate?: string;
  toDate?: string;
  staffId?: string;
}

export const StatisticSchedulePage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    fromDate: null,
    toDate: null,
    staffId: null,
    staffCodeSearch: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({});

  const { setting } = useSettingAdminService();
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
      fromDate: appliedFilters.fromDate,
      toDate: appliedFilters.toDate,
      staffId: appliedFilters.staffId,
    });
  }, [page, pageSize, appliedFilters]);

  const filteredStatistics = statistics.filter(
    (item) =>
      !searchFilters.staffCodeSearch ||
      item.staffCode
        .toLowerCase()
        .includes(searchFilters.staffCodeSearch.toLowerCase())
  );

  const paginatedData = filteredStatistics.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalItems = filteredStatistics.length;

  const handleExport = () => {
    exportScheduleStatistics({
      fromDate: appliedFilters.fromDate,
      toDate: appliedFilters.toDate,
      staffId: appliedFilters.staffId,
    });
  };

  const handleSearch = () => {
    setAppliedFilters({
      fromDate: searchFilters.fromDate
        ? dayjs(searchFilters.fromDate).format("YYYY-MM-DD")
        : undefined,
      toDate: searchFilters.toDate
        ? dayjs(searchFilters.toDate).format("YYYY-MM-DD")
        : undefined,
      staffId: searchFilters.staffId || undefined,
    });
    setPage(1);
  };

  const handleReset = () => {
    setSearchFilters({
      fromDate: null,
      toDate: null,
      staffId: null,
      staffCodeSearch: "",
    });
    setAppliedFilters({});
    setPage(1);
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

      <div className="grid grid-cols-12 gap-4 mb-4">
        {/* Từ ngày - 2/12 */}
        <div className="col-span-12 lg:col-span-2">
          <FloatingLabelWrapper label="Từ ngày">
            <DatePickerInput
              placeholder="Từ ngày"
              value={searchFilters.fromDate}
              onChange={(value) =>
                setSearchFilters({
                  ...searchFilters,
                  fromDate: value as Date | null,
                })
              }
              className="w-full"
              valueFormat="DD/MM/YYYY"
            />
          </FloatingLabelWrapper>
        </div>

        {/* Đến ngày - 2/12 */}
        <div className="col-span-12 lg:col-span-2">
          <FloatingLabelWrapper label="Đến ngày">
            <DatePickerInput
              placeholder="Đến ngày"
              value={searchFilters.toDate}
              onChange={(value) =>
                setSearchFilters({
                  ...searchFilters,
                  toDate: value as Date | null,
                })
              }
              className="w-full"
              valueFormat="DD/MM/YYYY"
            />
          </FloatingLabelWrapper>
        </div>

        {/* Tìm nhân viên - 3/12 */}
        <div className="col-span-12 lg:col-span-3">
          <FloatingLabelWrapper label="Tìm nhân viên">
            <Select
              placeholder="Tìm tên nhân viên"
              data={staffOptions}
              value={searchFilters.staffId || null}
              onChange={(value) =>
                setSearchFilters({
                  ...searchFilters,
                  staffId: typeof value === "string" ? value : "",
                })
              }
              onSearchChange={(query) => {
                searchStaffs(query);
              }}
              clearable
              searchable
              className="w-full"
            />
          </FloatingLabelWrapper>
        </div>

        {/* Tìm mã nhân viên - 3/12 */}
        <div className="col-span-12 lg:col-span-3">
          <FloatingLabelWrapper label="Tìm mã nhân viên">
            <TextInput
              placeholder="Tìm mã nhân viên"
              value={searchFilters.staffCodeSearch}
              onChange={(event) =>
                setSearchFilters({
                  ...searchFilters,
                  staffCodeSearch: event.currentTarget.value,
                })
              }
              className="w-full"
            />
          </FloatingLabelWrapper>
        </div>

        {/* Nút - 2/12 */}
        <div className="col-span-12 lg:col-span-2 flex items-end gap-2">
          <Button variant="light" color="gray" onClick={handleReset}>
            Tải lại
          </Button>
          <Button variant="filled" color="blue" onClick={handleSearch}>
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
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        loading={loading}
        showActions={false}
        pageSizeOptions={setting?.paginationSizeList
          .slice()
          .sort((a, b) => a - b)}
      />
    </>
  );
};

export default StatisticSchedulePage;
