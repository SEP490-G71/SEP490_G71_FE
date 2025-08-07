import { useEffect, useState } from "react";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { Button, TextInput } from "@mantine/core";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import useMedicalServiceStatistic from "../../../hooks/Statistics/MedicalServiceStatistics/useMedicalServiceStatistic";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";

const MedicalServiceStatisticsPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [serviceCodeQuery, setServiceCodeQuery] = useState("");
  const [nameQuery, setNameQuery] = useState("");

  const [submittedFilters, setSubmittedFilters] = useState<{
    serviceCode?: string;
    name?: string;
    fromDate?: string;
    toDate?: string;
  }>({});

  const {
    statistics,
    summary,
    totalItems,
    loading,
    fetchStatistics,
    exportStatistics,
  } = useMedicalServiceStatistic();

  const { setting } = useSettingAdminService();

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);

  useEffect(() => {
    fetchStatistics(page - 1, pageSize, submittedFilters);
  }, [page, pageSize, submittedFilters]);

  const handleSearch = () => {
    setSubmittedFilters({
      serviceCode: serviceCodeQuery.trim() || undefined,
      name: nameQuery.trim().toLowerCase() || undefined,
      fromDate: fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : undefined,
      toDate: toDate ? dayjs(toDate).format("YYYY-MM-DD") : undefined,
    });
    setPage(1);
  };

  const handleReload = () => {
    setServiceCodeQuery("");
    setNameQuery("");
    setFromDate(null);
    setToDate(null);
    setSubmittedFilters({});
    setPage(1);
  };

  const handleExport = () => {
    exportStatistics(submittedFilters);
  };

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
      align: "right",
      render: (row) => (
        <div className="text-right">
          {(row.totalOriginal ?? 0).toLocaleString("vi-VN")} VND
        </div>
      ),
    }),
    createColumn({
      key: "totalDiscount",
      label: "Giảm giá",
      align: "right",
      render: (row) => (
        <div className="text-right">
          {(row.totalDiscount ?? 0).toLocaleString("vi-VN")} VND
        </div>
      ),
    }),
    createColumn({
      key: "totalVat",
      label: "VAT",
      align: "right",
      render: (row) => (
        <div className="text-right">
          {(row.totalVat ?? 0).toLocaleString("vi-VN")} VND
        </div>
      ),
    }),
    createColumn({
      key: "totalRevenue",
      label: "Tổng thanh toán",
      align: "right",
      render: (row) => (
        <div className="text-right">
          {(row.totalRevenue ?? 0).toLocaleString("vi-VN")} VND
        </div>
      ),
    }),
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold">Thống kê dịch vụ y tế</h1>
        <Button
          leftSection={
            <img
              src="/images/icons8-excel-48.png"
              alt="Excel"
              className="w-6 h-6 object-contain"
            />
          }
          onClick={handleExport}
          variant="default"
          style={{
            backgroundColor: "#bbf7d0",
            color: "#15803d",
            border: "1px solid #15803d",
            fontWeight: 600,
          }}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 mb-4 w-full items-end">
        {/* Từ ngày */}
        <div className="col-span-1 lg:col-span-2">
          <FloatingLabelWrapper label="Từ ngày">
            <DatePickerInput
              placeholder="Chọn ngày"
              value={fromDate}
              onChange={(val) => setFromDate(val as Date | null)}
              valueFormat="DD/MM/YYYY"
              clearable
              className="w-full"
            />
          </FloatingLabelWrapper>
        </div>

        {/* Đến ngày */}
        <div className="col-span-1 lg:col-span-2">
          <FloatingLabelWrapper label="Đến ngày">
            <DatePickerInput
              placeholder="Chọn ngày"
              value={toDate}
              onChange={(val) => setToDate(val as Date | null)}
              valueFormat="DD/MM/YYYY"
              clearable
              className="w-full"
            />
          </FloatingLabelWrapper>
        </div>

        {/* Tên dịch vụ */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <FloatingLabelWrapper label="Tìm theo tên dịch vụ">
            <TextInput
              placeholder="Nhập tên dịch vụ (VD: Xét nghiệm máu)"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.currentTarget.value)}
              className="w-full"
            />
          </FloatingLabelWrapper>
        </div>

        {/* Mã dịch vụ */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <FloatingLabelWrapper label="Tìm theo mã dịch vụ">
            <TextInput
              placeholder="Nhập mã dịch vụ (VD: MS000001)"
              value={serviceCodeQuery}
              onChange={(e) => setServiceCodeQuery(e.currentTarget.value)}
              className="w-full"
            />
          </FloatingLabelWrapper>
        </div>

        {/* Nút Tải lại */}
        <div className="col-span-1 sm:col-span-1 lg:col-span-1">
          <Button
            variant="light"
            color="gray"
            onClick={handleReload}
            className="w-full h-[36px] text-sm"
          >
            Tải lại
          </Button>
        </div>

        {/* Nút Tìm kiếm */}
        <div className="col-span-1 sm:col-span-1 lg:col-span-1">
          <Button
            variant="filled"
            color="blue"
            onClick={handleSearch}
            className="w-full h-[36px] text-sm"
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <CustomTable
        data={statistics}
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

export default MedicalServiceStatisticsPage;
