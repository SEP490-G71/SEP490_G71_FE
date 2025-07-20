import { useEffect, useState, useCallback } from "react";
import { Button, Input, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { LuEye, LuDownload } from "react-icons/lu";
import PageMeta from "../../../components/common/PageMeta";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { InvoiceResponse } from "../../../types/Invoice/invoice";
import EcommerceMetrics from "../../../components/ecommerce/EcommerceMetrics";
import { useFilteredInvoices } from "../../../hooks/invoice/useInvoice";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import { useInvoiceStatistics } from "../../../hooks/invoice/useInvoiceStatistics";
import { useExportInvoicesExcel } from "../../../hooks/invoice/useExportInvoicesExcel";
import { useDownloadInvoiceById } from "../../../hooks/invoice/useDownloadInvoiceById";
import { InvoiceStatusMap } from "../../../enums/InvoiceStatus/InvoiceStatus";
import { usePreviewInvoice } from "../../../hooks/invoice/payment/usePreviewInvoice";
import { useSearchPatients } from "../../../hooks/Patient-Management/useSearchPatients";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";

const InvoicePage = () => {
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [inputCode, setInputCode] = useState("");
  const [filterCode, setFilterCode] = useState("");
  const [inputPatient, setInputPatient] = useState("");
  const [filterPatient, setFilterPatient] = useState("");
  const { setting } = useSettingAdminService();
  const { options: patientOptions } = useSearchPatients(inputPatient);
  const { stats, fetchInvoiceStats } = useInvoiceStatistics();
  const { exportInvoicesExcel } = useExportInvoicesExcel();
  const { downloadInvoice } = useDownloadInvoiceById();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { previewInvoice } = usePreviewInvoice();
  const { invoices, loadingList, pagination, fetchInvoices } =
    useFilteredInvoices();

  // Tách logic fetch thành useCallback để tránh re-render không cần thiết
  const fetchInvoicesWithFilters = useCallback(
    (
      status: string,
      patientId: string,
      invoiceCode: string,
      fromDate: Date | null,
      toDate: Date | null,
      pageIndex: number,
      size: number
    ) => {
      fetchInvoices(
        {
          status: status || undefined,
          patientId: patientId || undefined,
          invoiceCode: invoiceCode || undefined,
          fromDate: fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : undefined,
          toDate: toDate ? dayjs(toDate).format("YYYY-MM-DD") : undefined,
        },
        pageIndex,
        size,
        "createdAt"
      );
    },
    [fetchInvoices]
  );

  const handleSearch = useCallback(() => {
    // Cập nhật filterCode trước, sau đó fetch với giá trị mới
    const newFilterCode = inputCode.trim();
    setFilterCode(newFilterCode);
    setPage(1); // Reset về trang đầu

    // Fetch ngay lập tức với các giá trị hiện tại
    fetchInvoicesWithFilters(
      filterStatus,
      filterPatient,
      newFilterCode, // Sử dụng giá trị mới
      filterFromDate,
      filterToDate,
      0, // page 0 vì đã reset về trang 1
      pageSize
    );
  }, [
    inputCode,
    filterStatus,
    filterPatient,
    filterFromDate,
    filterToDate,
    pageSize,
    fetchInvoicesWithFilters,
  ]);

  const handleReset = useCallback(() => {
    // Reset tất cả state
    setFilterStatus("");
    setInputCode("");
    setFilterCode("");
    setInputPatient("");
    setFilterPatient("");
    setFilterFromDate(null);
    setFilterToDate(null);
    setPage(1);

    // Fetch với tất cả filter rỗng
    fetchInvoicesWithFilters("", "", "", null, null, 0, pageSize);
  }, [pageSize, fetchInvoicesWithFilters]);

  const applyCurrentFilters = useCallback(() => {
    fetchInvoicesWithFilters(
      filterStatus,
      filterPatient,
      filterCode,
      filterFromDate,
      filterToDate,
      page - 1,
      pageSize
    );
  }, [
    filterStatus,
    filterPatient,
    filterCode,
    filterFromDate,
    filterToDate,
    page,
    pageSize,
    fetchInvoicesWithFilters,
  ]);

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);

  // Effect để fetch khi page hoặc pageSize thay đổi
  useEffect(() => {
    applyCurrentFilters();
  }, [page, pageSize]); // Loại bỏ applyCurrentFilters khỏi dependencies để tránh loop

  useEffect(() => {
    fetchInvoiceStats();
  }, [fetchInvoiceStats]);

  const handleExport = () => {
    exportInvoicesExcel({
      status: filterStatus,
      fromDate: filterFromDate?.toISOString() ?? "",
      toDate: filterToDate?.toISOString() ?? "",
    });
  };

  const columns = [
    createColumn<InvoiceResponse>({
      key: "status",
      label: "Trạng thái",
      render: (row) =>
        InvoiceStatusMap[row.status as keyof typeof InvoiceStatusMap] ??
        "Không xác định",
    }),
    createColumn<InvoiceResponse>({
      key: "invoiceCode",
      label: "Mã hóa đơn",
    }),
    createColumn<InvoiceResponse>({
      key: "patientName",
      label: "Tên bệnh nhân",
    }),
    createColumn<InvoiceResponse>({
      key: "confirmedBy",
      label: "Người thu",
    }),
    createColumn<InvoiceResponse>({
      key: "createdAt",
      label: "Ngày tạo",
      render: (row) => {
        const date = dayjs(row.createdAt);
        return date.isValid() ? date.format("DD/MM/YYYY HH:mm") : "---";
      },
    }),
    createColumn<InvoiceResponse>({
      key: "total",
      label: "Đơn giá",
      render: (row) => row.total?.toLocaleString("vi-VN") + " ₫",
    }),
    createColumn<InvoiceResponse>({
      key: "actions",
      label: "Thao tác",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            size="xs"
            variant="light"
            color="blue"
            onClick={() => previewInvoice(row.invoiceId)}
            className="p-1 w-8 h-8 flex items-center justify-center"
            title="Xem trước"
          >
            <LuEye size={16} />
          </Button>

          <Button
            size="xs"
            variant="light"
            color="green"
            onClick={async () => {
              setDownloadingId(row.invoiceId);
              await downloadInvoice(row.invoiceId);
              setDownloadingId(null);
            }}
            disabled={downloadingId === row.invoiceId}
            loading={downloadingId === row.invoiceId}
            className="p-1 w-8 h-8 flex items-center justify-center"
            title="Tải PDF"
          >
            <LuDownload size={16} />
          </Button>
        </div>
      ),
    }),
  ];

  return (
    <>
      <PageMeta
        title="Quản lý hoá đơn | Admin Dashboard"
        description="Trang quản lý hóa đơn"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 my-6">
        <h1 className="text-xl font-bold">Hóa đơn</h1>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Xuất Excel
        </button>
      </div>

      <EcommerceMetrics stats={stats} />

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 my-6">
        <FloatingLabelWrapper label="Trạng thái">
          <Select
            placeholder="Nhập trạng thái"
            value={filterStatus}
            onChange={(val) => setFilterStatus(val || "")}
            data={[
              { value: "", label: "Tất cả" },
              { value: "PAID", label: "Đã thanh toán" },
              { value: "UNPAID", label: "Chưa thanh toán" },
            ]}
            className="w-full"
            styles={{ input: { height: 35, zIndex: 1 } }}
          />
        </FloatingLabelWrapper>

        <FloatingLabelWrapper label="Mã hóa đơn">
          <Input
            placeholder="Nhập mã hóa đơn"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full"
            styles={{ input: { height: 35 } }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </FloatingLabelWrapper>

        <FloatingLabelWrapper label="Tên bệnh nhân">
          <Select
            placeholder="Nhập tên bệnh nhân"
            searchable
            data={patientOptions}
            value={filterPatient}
            onSearchChange={setInputPatient}
            onChange={(val) => setFilterPatient(val || "")}
            className="w-full"
            clearable
            styles={{ input: { height: 35, zIndex: 1 } }}
          />
        </FloatingLabelWrapper>

        <FloatingLabelWrapper label="Từ ngày">
          <DatePickerInput
            placeholder="Từ ngày"
            value={filterFromDate}
            onChange={(date) =>
              setFilterFromDate(date ? dayjs(date).toDate() : null)
            }
            className="w-full"
            styles={{ input: { height: 35 } }}
            valueFormat="DD/MM/YYYY"
          />
        </FloatingLabelWrapper>

        <FloatingLabelWrapper label="Đến ngày">
          <DatePickerInput
            placeholder="Đến ngày"
            value={filterToDate}
            onChange={(date) =>
              setFilterToDate(date ? dayjs(date).toDate() : null)
            }
            className="w-full"
            styles={{ input: { height: 35 } }}
            valueFormat="DD/MM/YYYY"
          />
        </FloatingLabelWrapper>

        <div className="flex items-end col-span-1 gap-2">
          <Button
            variant="light"
            color="gray"
            onClick={handleReset}
            style={{
              height: 35,
            }}
            fullWidth
          >
            Tải lại
          </Button>
          <Button
            variant="filled"
            color="blue"
            onClick={handleSearch}
            style={{
              height: 35,
            }}
            fullWidth
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <CustomTable
        data={invoices}
        columns={columns}
        page={page}
        pageSize={pageSize}
        totalItems={pagination.totalElements}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        loading={loadingList}
        showActions={false}
        pageSizeOptions={setting?.paginationSizeList
          ?.slice()
          .sort((a, b) => a - b)}
      />
    </>
  );
};

export default InvoicePage;
