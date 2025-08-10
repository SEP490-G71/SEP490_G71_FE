import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router";
import { Button, Input, Alert, Loader, Card, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { LuEye, LuDownload } from "react-icons/lu";

import PageMeta from "../../../components/common/PageMeta";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";

import { InvoiceResponse } from "../../../types/Invoice/invoice";
import { useFilteredInvoices } from "../../../hooks/invoice/useInvoice";
import { useDownloadInvoiceById } from "../../../hooks/invoice/useDownloadInvoiceById";
import { usePreviewInvoice } from "../../../hooks/invoice/payment/usePreviewInvoice";
import {
  InvoiceStatus,
  InvoiceStatusColor,
  InvoiceStatusMap,
} from "../../../enums/InvoiceStatus/InvoiceStatus";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import PdfPreviewModal from "../../../components/common/PdfPreviewModal";

type OutletCtx = {
  patientId: string | null;
  loadingPatient: boolean;
};

const InvoiceHistoryPage = () => {
  const { patientId, loadingPatient } = useOutletContext<OutletCtx>();

  const [filterStatus, setFilterStatus] = useState("");
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);
  const [inputCode, setInputCode] = useState("");
  const [filterCode, setFilterCode] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { setting } = useSettingAdminService();
  const { downloadInvoice } = useDownloadInvoiceById();
  const { previewInvoice } = usePreviewInvoice();
  const { invoices, loadingList, pagination, fetchInvoices } =
    useFilteredInvoices();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchInvoicesWithFilters = useCallback(
    (
      invoiceCode: string,
      fromDate: Date | null,
      toDate: Date | null,
      pageIndex: number,
      size: number
    ) => {
      if (!patientId) return;
      fetchInvoices(
        {
          status: InvoiceStatus.PAID,
          patientId,
          invoiceCode: invoiceCode || undefined,
          fromDate: fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : undefined,
          toDate: toDate ? dayjs(toDate).format("YYYY-MM-DD") : undefined,
        },
        pageIndex,
        size
      );
    },
    [fetchInvoices, patientId]
  );

  const applyCurrentFilters = useCallback(() => {
    fetchInvoicesWithFilters(
      filterCode,
      filterFromDate,
      filterToDate,
      page - 1,
      pageSize
    );
  }, [
    filterStatus,
    filterCode,
    filterFromDate,
    filterToDate,
    page,
    pageSize,
    fetchInvoicesWithFilters,
  ]);

  const handleSearch = useCallback(() => {
    const newFilterCode = inputCode.trim();
    setFilterCode(newFilterCode);
    setPage(1);
    fetchInvoicesWithFilters(
      newFilterCode,
      filterFromDate,
      filterToDate,
      0,
      pageSize
    );
  }, [
    inputCode,
    filterStatus,
    filterFromDate,
    filterToDate,
    pageSize,
    fetchInvoicesWithFilters,
  ]);

  const handleReset = useCallback(() => {
    setFilterStatus("");
    setInputCode("");
    setFilterCode("");
    setFilterFromDate(null);
    setFilterToDate(null);
    setPage(1);
    fetchInvoicesWithFilters("", null, null, 0, pageSize);
  }, [pageSize, fetchInvoicesWithFilters]);

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
      setPage(1);
    }
  }, [setting]);

  useEffect(() => {
    if (patientId) applyCurrentFilters();
  }, [page, pageSize, patientId]);

  const handlePreview = async (invoiceId: string) => {
    const url = await previewInvoice(invoiceId);
    if (url) {
      setPdfUrl(url);
      setModalOpened(true);
    }
  };

  const columns = [
    createColumn<InvoiceResponse>({ key: "invoiceCode", label: "Mã hóa đơn" }),
    createColumn<InvoiceResponse>({
      key: "status",
      label: "Trạng thái",
      render: (row) => {
        const s = row.status as keyof typeof InvoiceStatus;
        return (
          <span style={{ color: InvoiceStatusColor[s], fontWeight: 600 }}>
            {InvoiceStatusMap[s]}
          </span>
        );
      },
    }),
    createColumn<InvoiceResponse>({
      key: "createdAt",
      label: "Ngày tạo",
      render: (row) => {
        const d = dayjs(row.createdAt);
        return d.isValid() ? d.format("DD/MM/YYYY HH:mm") : "---";
      },
    }),
    createColumn<InvoiceResponse>({
      key: "total",
      label: "Đơn giá",
      render: (row) =>
        typeof row.total === "number"
          ? row.total.toLocaleString("vi-VN") + " VND"
          : "---",
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
            onClick={() => handlePreview(row.invoiceId)}
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

  if (loadingPatient) {
    return (
      <div className="p-6">
        <Loader size="sm" /> Đang tải thông tin bệnh nhân...
      </div>
    );
  }

  if (!patientId) {
    return (
      <div className="p-6">
        <Alert color="red" title="Không tìm thấy bệnh nhân">
          Không thể xác định bệnh nhân hiện tại. Vui lòng đăng nhập lại.
        </Alert>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Lịch sử hóa đơn | Patient Portal"
        description="Lịch sử hóa đơn thanh toán"
      />

      <div className="w-full px-0">
        <Card withBorder shadow="sm" radius="md" className="mb-4 p-4">
          <Title order={5} className="uppercase text-green-700 mb-3">
            Lịch sử hóa đơn thanh toán
          </Title>

          <div className="grid grid-cols-12 gap-4 my-4">
            {/* Mã hóa đơn */}
            <div className="col-span-12 md:col-span-3">
              <FloatingLabelWrapper label="Mã hóa đơn">
                <Input
                  placeholder="Nhập mã hóa đơn"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full"
                  styles={{ input: { height: 35 } }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </FloatingLabelWrapper>
            </div>

            {/* Từ ngày */}
            <div className="col-span-12 md:col-span-3">
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
            </div>

            {/* Đến ngày */}
            <div className="col-span-12 md:col-span-3">
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
            </div>

            {/* Nút */}
            <div className="col-span-12 md:col-span-3 flex items-center gap-2 md:pt-[22px]">
              <Button
                variant="light"
                color="gray"
                onClick={handleReset}
                fullWidth
                size="sm"
              >
                Tải lại
              </Button>
              <Button
                variant="filled"
                color="blue"
                onClick={handleSearch}
                fullWidth
                size="sm"
              >
                Tìm kiếm
              </Button>
            </div>
          </div>

          <PdfPreviewModal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            pdfUrl={pdfUrl}
            title="Xem trước hóa đơn"
            widthPct={90}
            heightVh={90}
          />

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
          />
        </Card>
      </div>
    </>
  );
};

export default InvoiceHistoryPage;
