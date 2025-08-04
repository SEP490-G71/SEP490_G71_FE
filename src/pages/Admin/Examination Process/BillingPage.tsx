import {
  Divider,
  Group,
  Paper,
  Title,
  Grid,
  Button,
  Textarea,
  Box,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import { useFilteredInvoices } from "../../../hooks/invoice/useInvoice";
import { useDownloadInvoiceById } from "../../../hooks/invoice/useDownloadInvoiceById";
import { usePreviewInvoice } from "../../../hooks/invoice/payment/usePreviewInvoice";
import { markInvoicePending } from "../../../hooks/invoice/payment/invoicePayment";
import { useUserInfo } from "../../../hooks/auth/useUserInfo";
import useStaffs from "../../../hooks/staffs-service/useStaffs";
import useQueuePatientService from "../../../hooks/queue-patients/useSearchQueuePatients";

import { InvoiceStatus } from "../../../enums/InvoiceStatus/InvoiceStatus";
import { PaymentType } from "../../../enums/Payment/PaymentType";

import { ServiceRow } from "../../../types/serviceRow";
import { QueuePatient } from "../../../types/Queue-patient/QueuePatient";

import InvoiceList from "../../../components/subBilling/InvoiceList";
import InvoiceDetailSection from "../../../components/subBilling/InvoiceDetailSection";
import ViewEditInvoiceServicesModal from "../../../components/invoice/EditInvoiceModal";
import PdfPreviewModal from "../../../components/common/PdfPreviewModal";
import PatientInfoPanel from "../../../components/patient/PatientInfoPanel";
import FilterPanel, {
  FilterField,
} from "../../../components/common/FilterSection";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import { mapDetailToQueuePatient } from "../../../components/common/patient.mapper";
import useMedicalService from "../../../hooks/medical-service/useMedicalService";

const BillingPage = () => {
  const { userInfo } = useUserInfo();
  const { previewInvoice } = usePreviewInvoice();
  const { downloadInvoice } = useDownloadInvoiceById();
  const { updateFilters } = useQueuePatientService();
  const { staffs, fetchStaffs } = useStaffs();
  const todayString = dayjs().format("YYYY-MM-DD");
  const { medicalServices, fetchAllMedicalServicesNoPagination } =
    useMedicalService();
  const {
    invoices,
    invoiceDetail,
    loadingList,
    loadingDetail,
    fetchInvoices,
    fetchInvoiceDetail,
    pagination,
  } = useFilteredInvoices();

  const [selectedInvoiceInfo, setSelectedInvoiceInfo] = useState<{
    id: string;
    status: InvoiceStatus;
  } | null>(null);

  const [selectedPatient, setSelectedPatient] = useState<QueuePatient | null>(
    null
  );
  const initialFilterValues = {
    status: InvoiceStatus.UNPAID,
    fromDate: todayString,
    toDate: todayString,
  };

  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [note, setNote] = useState<string>("");
  const currentFilters = useRef(initialFilterValues);
  const [editableInvoiceDetail, setEditableInvoiceDetail] = useState<{
    paymentType?: keyof typeof PaymentType;
    confirmedBy?: string;
  }>({});

  const [staffOptions, setStaffOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const paymentTypeOptions = Object.entries(PaymentType).map(
    ([key, label]) => ({ value: key, label })
  );

  useEffect(() => {
    fetchStaffs();
  }, []);

  useEffect(() => {
    fetchAllMedicalServicesNoPagination();
  }, []);

  useEffect(() => {
    setStaffOptions(staffs.map((s) => ({ value: s.id, label: s.fullName })));
  }, [staffs]);

  useEffect(() => {
    if (invoiceDetail && userInfo) {
      setEditableInvoiceDetail({
        paymentType: invoiceDetail.paymentType as keyof typeof PaymentType,
        confirmedBy: invoiceDetail.confirmedBy ?? userInfo.userId ?? undefined,
      });

      setSelectedPatient(
        mapDetailToQueuePatient(invoiceDetail, {
          registeredTime: invoiceDetail.createdAt ?? undefined,
        })
      );

      setNote(invoiceDetail.description ?? "");
    } else {
      setSelectedPatient(null);
      setNote("");
    }
  }, [invoiceDetail, userInfo]);

  useEffect(() => {
    fetchInvoices(currentFilters.current, page - 1, pageSize);
  }, [page, pageSize]);
  const handleSelectInvoice = (invoiceId: string) => {
    const selected = invoices.find((i) => i.invoiceId === invoiceId);
    if (!selected) return;

    setSelectedInvoiceInfo({ id: selected.invoiceId, status: selected.status });
    fetchInvoiceDetail(invoiceId);

    if (selected.patientCode) {
      updateFilters({ patientCode: selected.patientCode });
    }
  };

  const serviceOptions = Object.entries(
    medicalServices.reduce<Record<string, { value: string; label: string }[]>>(
      (acc, s) => {
        const group = s.department?.specialization?.name || "Khác";
        if (!acc[group]) acc[group] = [];
        acc[group].push({
          value: s.id,
          label: `${s.serviceCode} - ${s.name}`,
        });
        return acc;
      },
      {}
    )
  ).map(([group, items]) => ({
    group,
    items,
  }));

  const rowsFromInvoice: ServiceRow[] =
    invoiceDetail?.items.map((item, index) => ({
      id: index,
      serviceId: null,
      serviceCode: item.serviceCode,
      name: item.name,
      price: item.price,
      discount: item.discount,
      vat: item.vat,
      quantity: item.quantity,
      total: item.total,
    })) ?? [];

  const handlePreview = async (invoiceId: string) => {
    const url = await previewInvoice(invoiceId);
    if (url) {
      setPreviewUrl(url);
      setPreviewOpen(true);
    }
  };

  const handleSavePendingInvoice = async () => {
    if (!invoiceDetail || !editableInvoiceDetail.paymentType) {
      toast.error("Vui lòng chọn hình thức thanh toán");
      return;
    }

    try {
      await markInvoicePending(
        invoiceDetail,
        editableInvoiceDetail,
        fetchInvoiceDetail
      );
      toast.success("Hóa đơn đã được thanh toán");
      fetchInvoices({ status: InvoiceStatus.UNPAID }, page - 1, pageSize);
      setSelectedInvoiceInfo(null);
    } catch (error: any) {
      const messageMap: Record<string, string> = {
        MISSING_PAYMENT_TYPE: "Vui lòng chọn hình thức thanh toán",
        MISSING_INVOICE_DETAIL: "Không tìm thấy thông tin hóa đơn",
        MISSING_REQUIRED_FIELDS:
          "Thiếu thông tin cần thiết để thanh toán hóa đơn",
      };

      toast.error(
        messageMap[error?.message] || error?.message || "Đã có lỗi xảy ra"
      );
    }
  };

  const filterFields: FilterField<any>[] = [
    {
      key: "status",
      type: "select",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái",
      wrapper: FloatingLabelWrapper,
      options: Object.entries(InvoiceStatus).map(([value, label]) => ({
        value,
        label: label as string,
      })),
    },
    {
      key: "patientName",
      type: "text",
      label: "Họ tên bệnh nhân",
      placeholder: "Nhập tên bệnh nhân",
      wrapper: FloatingLabelWrapper,
    },
    {
      key: "patientCode",
      type: "text",
      label: "Mã bệnh nhân",
      placeholder: "Nhập mã bệnh nhân",
      wrapper: FloatingLabelWrapper,
    },
    {
      key: "invoiceCode",
      type: "text",
      label: "Mã hóa đơn",
      placeholder: "Nhập mã hóa đơn",
      wrapper: FloatingLabelWrapper,
    },
    {
      key: "fromDate",
      type: "date",
      label: "Từ ngày",
      placeholder: "Chọn ngày bắt đầu",
      wrapper: FloatingLabelWrapper,
    },
    {
      key: "toDate",
      type: "date",
      label: "Đến ngày",
      placeholder: "Chọn ngày kết thúc",
      wrapper: FloatingLabelWrapper,
    },
  ];

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
        <Paper shadow="xs" p="md" radius={0} mb="md" withBorder>
          <FilterPanel
            fields={filterFields}
            initialValues={initialFilterValues}
            onSearch={(filters) => {
              currentFilters.current = filters;
              setPage(1);
              fetchInvoices(filters, 0, pageSize);
            }}
            onReset={() => {
              setPage(1);
              fetchInvoices(initialFilterValues);
            }}
          />
          <Divider mt="md" mb={15} />
          <Title order={5} mb="md" mt="md">
            Danh sách hóa đơn
          </Title>
          <InvoiceList
            invoices={invoices}
            loading={loadingList}
            selectedInvoiceInfo={selectedInvoiceInfo}
            onSelectInvoice={handleSelectInvoice}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            pagination={pagination}
          />
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
        <Paper shadow="xs" radius={0} p="md" withBorder>
          <Group justify="space-between" mb="sm">
            <Button variant="light" size="md">
              Ghi thông tin hóa đơn
            </Button>
            <Button
              variant="outline"
              size="md"
              color="red"
              onClick={handleSavePendingInvoice}
              disabled={
                selectedInvoiceInfo?.status === "PAID" ||
                !editableInvoiceDetail.confirmedBy
              }
              title={
                selectedInvoiceInfo?.status === "PAID"
                  ? "Hóa đơn đã thanh toán"
                  : !editableInvoiceDetail.confirmedBy
                  ? "Chưa xác nhận người thu"
                  : ""
              }
            >
              Thanh toán
            </Button>
          </Group>

          <PatientInfoPanel patient={selectedPatient} mode="billing" />

          <Box mt="xl">
            <Textarea
              label="Ghi chú"
              autosize
              minRows={4}
              maxRows={6}
              size="sm"
              value={note}
              onChange={(event) => setNote(event.currentTarget.value)}
              styles={{
                label: {
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "2px",
                },
                input: {
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent, transparent 28px, #ccc 28px, #ccc 29px)",
                  backgroundSize: "100% 29px",
                  lineHeight: "28px",
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  border: "none",
                  borderRadius: 0,
                },
              }}
            />
          </Box>

          <InvoiceDetailSection
            invoiceDetail={invoiceDetail ?? undefined}
            loadingDetail={loadingDetail}
            editableInvoiceDetail={editableInvoiceDetail}
            staffOptions={staffOptions}
            paymentTypeOptions={paymentTypeOptions}
            rowsFromInvoice={rowsFromInvoice}
            selectedInvoiceInfo={selectedInvoiceInfo}
            isDownloading={isDownloading}
            handlePreview={handlePreview}
            handleDownload={async (id) => {
              setIsDownloading(true);
              await downloadInvoice(id);
              setIsDownloading(false);
            }}
            handleOpenModal={() => setViewModalOpened(true)}
            setEditableInvoiceDetail={setEditableInvoiceDetail}
          />
        </Paper>
      </Grid.Col>

      {invoiceDetail && (
        <ViewEditInvoiceServicesModal
          opened={viewModalOpened}
          onClose={() => setViewModalOpened(false)}
          invoiceItems={invoiceDetail.items.map((item) => ({
            serviceCode: item.serviceCode,
            name: item.name,
            medicalServiceId: item.medicalServiceId ?? null,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            vat: item.vat,
            total: item.total,
          }))}
          availableServices={medicalServices}
          serviceOptions={serviceOptions}
          onChange={() => {
            fetchInvoiceDetail(invoiceDetail.invoiceId);
          }}
          editable={true}
          invoiceId={invoiceDetail.invoiceId}
          staffId={userInfo?.userId ?? ""}
        />
      )}

      <PdfPreviewModal
        opened={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setPreviewUrl(null);
        }}
        pdfUrl={previewUrl}
        title="Xem trước hóa đơn"
      />
    </Grid>
  );
};

export default BillingPage;
