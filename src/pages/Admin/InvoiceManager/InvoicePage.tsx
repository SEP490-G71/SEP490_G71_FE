import { useEffect, useState } from "react";
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

const InvoicePage = () => {
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [inputCode, setInputCode] = useState("");
  const [inputPatient, setInputPatient] = useState("");
  const [filterCode, setFilterCode] = useState("");
  const [filterPatient, setFilterPatient] = useState("");

  const { stats, fetchInvoiceStats } = useInvoiceStatistics();
  const { exportInvoicesExcel } = useExportInvoicesExcel();
  const { downloadInvoice } = useDownloadInvoiceById();
  const { previewInvoice } = usePreviewInvoice();
  const { invoices, loadingList, pagination, fetchInvoices } =
    useFilteredInvoices();

  useEffect(() => {
    fetchInvoices(
      {
        status: filterStatus || undefined,
        patientId: filterPatient || undefined,
        invoiceCode: filterCode || undefined,
        fromDate: filterFromDate
          ? dayjs(filterFromDate).format("YYYY-MM-DD")
          : undefined,
        toDate: filterToDate
          ? dayjs(filterToDate).format("YYYY-MM-DD")
          : undefined,
      },
      page - 1,
      pageSize,
      "createdAt",
      sortDirection
    );
  }, [
    page,
    pageSize,
    sortDirection,
    filterStatus,
    filterCode,
    filterFromDate,
    filterToDate,
    filterPatient,
  ]);

  useEffect(() => {
    fetchInvoiceStats();
  }, []);

  const handleExport = () => {
    exportInvoicesExcel({
      status: filterStatus,
      fromDate: filterFromDate?.toISOString() ?? "",
      toDate: filterToDate?.toISOString() ?? "",
      sortBy: "createdAt",
      sortDir: "desc",
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
      sortable: true,
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
      render: (row) => row.total?.toLocaleString("vi-VN"),
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
            onClick={() => downloadInvoice(row.invoiceId)}
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
            styles={{ input: { height: 40, zIndex: 1 } }}
          />
        </FloatingLabelWrapper>

        <FloatingLabelWrapper label="Mã hóa đơn">
          <Input
            placeholder="Nhập mã hóa đơn"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                setFilterCode(inputCode.trim());
              }
            }}
            className="w-full"
            styles={{ input: { height: 40 } }}
          />
        </FloatingLabelWrapper>

        <FloatingLabelWrapper label="Tên bệnh nhân">
          <Input
            placeholder="Nhập tên bệnh nhân"
            value={inputPatient}
            onChange={(e) => setInputPatient(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                setFilterPatient(inputPatient.trim());
              }
            }}
            className="w-full"
            styles={{ input: { height: 40 } }}
          />
        </FloatingLabelWrapper>

        <FloatingLabelWrapper label="Từ ngày">
          <DatePickerInput
            placeholder="Từ ngày"
            value={filterFromDate}
            onChange={(date) => {
              setPage(1);
              const parsed = dayjs(date).toDate();
              setFilterFromDate(date ? parsed : null);
            }}
            className="w-full"
            styles={{ input: { height: 40 } }}
            valueFormat="DD/MM/YYYY"
          />
        </FloatingLabelWrapper>

        <FloatingLabelWrapper label="Đến ngày">
          <DatePickerInput
            placeholder="Đến ngày"
            value={filterToDate}
            onChange={(date) => {
              setPage(1);
              const parsed = dayjs(date).toDate();
              setFilterToDate(date ? parsed : null);
            }}
            className="w-full"
            styles={{ input: { height: 40 } }}
            valueFormat="DD/MM/YYYY"
          />
        </FloatingLabelWrapper>

        <div className="flex items-end col-span-1">
          <button
            onClick={() => {
              setFilterStatus("");
              setInputCode("");
              setFilterCode("");
              setInputPatient("");
              setFilterPatient("");
              setFilterFromDate(null);
              setFilterToDate(null);
              setPage(1);
            }}
            className="rounded-md bg-blue-400 text-white border border-blue-400 hover:bg-blue-500 transition w-16 h-10 flex items-center justify-center"
            title="Tải lại bộ lọc"
          >
            tải lại
          </button>
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
        onSortChange={(_, direction) => {
          setSortDirection(direction);
        }}
        sortDirection={sortDirection}
        loading={loadingList}
        showActions={false}
      />
    </>
  );
};

export default InvoicePage;
