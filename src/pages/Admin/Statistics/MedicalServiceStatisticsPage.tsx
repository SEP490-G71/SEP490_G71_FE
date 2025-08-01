import { useEffect, useState } from "react";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { Button, TextInput } from "@mantine/core";
import { LuDownload, LuSearch } from "react-icons/lu";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import useMedicalServiceStatistic from "../../../hooks/Statistics/MedicalServiceStatistics/useMedicalServiceStatistic";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";

const MedicalServiceStatisticsPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const { statistics, summary, loading, fetchStatistics, exportStatistics } =
    useMedicalServiceStatistic();

  const { setting } = useSettingAdminService();
  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);
  useEffect(() => {
    fetchStatistics(page - 1, pageSize);
  }, [page, pageSize]);

  const handleSearch = () => {
    setSubmittedQuery(searchQuery.trim().toLowerCase());
    setPage(1);
  };

  const handleReload = () => {
    setSearchQuery("");
    setSubmittedQuery("");
    setPage(1);
  };

  const handleExport = () => {
    exportStatistics();
  };

  const filteredData = statistics.filter(
    (item) =>
      item.name.toLowerCase().includes(submittedQuery) ||
      item.serviceCode.toLowerCase().includes(submittedQuery)
  );

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const columns = [
    createColumn({ key: "serviceCode", label: "Mã dịch vụ" }),
    createColumn({ key: "name", label: "Tên dịch vụ" }),
    createColumn({
      key: "totalUsage",
      label: "Lượt sử dụng",
      render: (row) => (
        <div style={{ textAlign: "center", paddingRight: 27 }}>
          {row.totalUsage}
        </div>
      ),
    }),

    createColumn({
      key: "totalOriginal",
      label: "Giá gốc",
      render: (row) =>
        (row.totalOriginal ?? 0).toLocaleString("vi-VN") + " VND",
    }),
    createColumn({
      key: "totalDiscount",
      label: "Giảm giá",
      render: (row) =>
        (row.totalDiscount ?? 0).toLocaleString("vi-VN") + " VND",
    }),
    createColumn({
      key: "totalVat",
      label: "VAT",
      render: (row) => (row.totalVat ?? 0).toLocaleString("vi-VN") + " VND",
    }),
    createColumn({
      key: "totalRevenue",
      label: "Tổng thanh toán",
      render: (row) => (row.totalRevenue ?? 0).toLocaleString("vi-VN") + " VND",
    }),
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold">Thống kê dịch vụ y tế</h1>
        <Button
          leftSection={<LuDownload size={16} />}
          onClick={handleExport}
          variant="filled"
          color="blue"
        >
          Xuất Excel
        </Button>
      </div>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
        <div className="bg-blue-50 border border-blue-200 rounded shadow p-4 text-blue-700">
          <div className="font-medium">Tổng loại dịch vụ</div>
          <div className="text-xl font-bold">{summary.totalServiceTypes}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded shadow p-4 text-green-700">
          <div className="font-medium">Tổng lượt sử dụng</div>
          <div className="text-xl font-bold">{summary.totalUsage}</div>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded shadow p-4 text-indigo-700">
          <div className="font-medium">Tổng doanh thu</div>
          <div className="text-xl font-bold">
            {summary.totalRevenue.toLocaleString()} VND
          </div>
        </div>
        {summary.mostUsedService && (
          <div className="bg-yellow-50 border border-yellow-200 rounded shadow p-4 text-yellow-700">
            <div className="font-medium">Dịch vụ được sử dụng nhiều nhất</div>
            <div className="text-sm">
              <b>{summary.mostUsedService.name}</b> (
              {summary.mostUsedService.totalUsage} lượt)
            </div>
          </div>
        )}
      </div>

      {/* Tìm kiếm + Tải lại */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4 w-full">
        <div className="col-span-3">
          <FloatingLabelWrapper label="Tìm kiếm dịch vụ">
            <TextInput
              placeholder="Nhập mã hoặc tên dịch vụ"
              leftSection={<LuSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              className="w-full"
            />
          </FloatingLabelWrapper>
        </div>

        <div className="flex items-end space-x-4">
          <Button variant="light" color="gray" onClick={handleReload} fullWidth>
            Tải lại
          </Button>
          <Button
            variant="filled"
            color="blue"
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
        totalItems={filteredData.length}
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

export default MedicalServiceStatisticsPage;
