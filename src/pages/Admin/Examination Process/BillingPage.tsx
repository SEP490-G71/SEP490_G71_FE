import {
  Divider,
  Group,
  Paper,
  Text,
  Title,
  Loader,
  Grid,
  TextInput,
  Button,
  Select,
  Textarea,
  Box,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useFilteredInvoices } from "../../../hooks/invoice/useInvoice";
import dayjs from "dayjs";
import useStaffs from "../../../hooks/staffs-service/useStaffs";
import PatientInfoPanel from "../../../components/patient/PatientInfoPanel";
import { PaymentType } from "../../../enums/Payment/PaymentType";
import ServiceTable from "../../../components/medical-examination/MedicalServiceTable";
import { ServiceRow } from "../../../types/serviceRow";
import { markInvoicePending } from "../../../hooks/invoice/payment/invoicePayment";
import { usePreviewInvoice } from "../../../hooks/invoice/payment/usePreviewInvoice";
import { InvoiceStatus } from "../../../enums/InvoiceStatus/InvoiceStatus";
import { toast } from "react-toastify";
import ViewEditInvoiceServicesModal from "../../../components/invoice/EditInvoiceModal";
import { useDownloadInvoiceById } from "../../../hooks/invoice/useDownloadInvoiceById";
import InvoiceList from "../../../components/subBilling/InvoiceList";
import FilterPanel, {
  FilterField,
} from "../../../components/common/FilterSection";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import { useUserInfo } from "../../../hooks/auth/useUserInfo";
import PdfPreviewModal from "../../../components/common/PdfPreviewModal";

const BillingPage = () => {
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
  const { userInfo } = useUserInfo();
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const { previewInvoice } = usePreviewInvoice();
  const { downloadInvoice } = useDownloadInvoiceById();
  const [isDownloading, setIsDownloading] = useState(false);
  const todayString = dayjs().format("YYYY-MM-DD");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const initialFilterValues = {
    status: InvoiceStatus.UNPAID,
    fromDate: todayString,
    toDate: todayString,
  };
  useEffect(() => {
    fetchInvoices(initialFilterValues, page - 1, pageSize);
  }, []);
  const handleSelectInvoice = (invoiceId: string) => {
    const selected = invoices.find((i) => i.invoiceId === invoiceId);
    if (!selected) return;

    setSelectedInvoiceInfo({
      id: selected.invoiceId,
      status: selected.status,
    });

    fetchInvoiceDetail(invoiceId);
  };

  const { staffs, fetchStaffs } = useStaffs();
  const [staffOptions, setStaffOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const paymentTypeOptions = Object.entries(PaymentType).map(
    ([key, label]) => ({
      value: key,
      label,
    })
  );
  useEffect(() => {
    fetchStaffs();
  }, []);

  useEffect(() => {
    const allStaffs = staffs.map((s) => ({
      value: s.id,
      label: s.fullName,
    }));
    setStaffOptions(allStaffs);
  }, [staffs]);

  const [editableInvoiceDetail, setEditableInvoiceDetail] = useState<{
    paymentType?: keyof typeof PaymentType;
    confirmedBy?: string;
  }>({});

  useEffect(() => {
    if (invoiceDetail && userInfo) {
      setEditableInvoiceDetail({
        paymentType: invoiceDetail.paymentType as keyof typeof PaymentType,
        confirmedBy: invoiceDetail.confirmedBy ?? userInfo.userId ?? undefined,
      });
    }
  }, [invoiceDetail, userInfo]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  useEffect(() => {
    fetchInvoices({ status: InvoiceStatus.UNPAID }, page - 1, pageSize);
  }, [page, pageSize]);

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
    if (!invoiceDetail) return;

    if (!editableInvoiceDetail.paymentType) {
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
        MISSING_PAYMENT_TYPE: " Vui lòng chọn hình thức thanh toán",
        MISSING_INVOICE_DETAIL: " Không tìm thấy thông tin hóa đơn",
        MISSING_REQUIRED_FIELDS:
          "Thiếu thông tin cần thiết để thanh toán hóa đơn",
      };

      const rawMessage = error?.message || "Đã có lỗi xảy ra";
      const message = messageMap[rawMessage] || rawMessage;

      toast.error(message);
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
      {/* Cột trái: Danh sách hóa đơn */}
      <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
        <Paper shadow="xs" p="md" radius={0} mb="md" withBorder>
          <FilterPanel
            fields={filterFields}
            initialValues={initialFilterValues}
            onSearch={(filters) => fetchInvoices(filters)}
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
          <Group justify="space-between" mb="sm" align="center">
            {/* Nút bên trái */}
            <Group gap="xs">
              <Button variant="light" size="md">
                Ghi thông tin hóa đơn
              </Button>
            </Group>

            {/* Nút bên phải */}
            <Group gap="xs">
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
                    ? "Vui lòng chọn người thu trước"
                    : ""
                }
              >
                Thanh toán
              </Button>
            </Group>
          </Group>

          <PatientInfoPanel patient={null} />

          <Box mt="xl">
            <Textarea
              label="Ghi chú"
              autosize
              minRows={4}
              maxRows={6}
              size="sm"
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

          <Title order={3}>Chi tiết hóa đơn</Title>

          {loadingDetail ? (
            <Loader mt="md" />
          ) : invoiceDetail ? (
            <>
              <Grid gutter="xs" mt="xs" mb="xs">
                <Grid.Col span={3}>
                  <Text size="xs" fw={500}>
                    Mã hóa đơn
                  </Text>
                  <TextInput
                    value={invoiceDetail.invoiceCode}
                    readOnly
                    size="xs"
                  />
                </Grid.Col>

                <Grid.Col span={3}>
                  <Text size="xs" fw={500}>
                    Ngày xác nhận
                  </Text>
                  <TextInput
                    value={dayjs(
                      invoiceDetail.confirmedAt ?? new Date()
                    ).format("DD/MM/YYYY HH:mm")}
                    readOnly
                    size="xs"
                  />
                </Grid.Col>

                <Grid.Col span={3}>
                  <Text size="xs" fw={500}>
                    Người thu
                  </Text>
                  <TextInput
                    value={
                      invoiceDetail.confirmedBy
                        ? staffOptions.find(
                            (s) => s.value === invoiceDetail.confirmedBy
                          )?.label
                        : staffOptions.find(
                            (s) => s.value === editableInvoiceDetail.confirmedBy
                          )?.label || ""
                    }
                    readOnly
                    size="xs"
                  />
                </Grid.Col>

                <Grid.Col span={3}>
                  <Text size="xs" fw={500}>
                    Hình thức
                  </Text>

                  {invoiceDetail.paymentType ? (
                    <TextInput
                      value={
                        PaymentType[
                          invoiceDetail.paymentType as keyof typeof PaymentType
                        ] || "Chưa rõ"
                      }
                      readOnly
                      size="xs"
                    />
                  ) : (
                    <Select
                      placeholder="Chọn hình thức thanh toán"
                      data={paymentTypeOptions}
                      value={editableInvoiceDetail.paymentType}
                      onChange={(value) =>
                        setEditableInvoiceDetail((prev) => ({
                          ...prev,
                          paymentType: value as keyof typeof PaymentType,
                        }))
                      }
                      size="xs"
                    />
                  )}
                </Grid.Col>
              </Grid>

              <Divider my="sm" />
              <Group justify="space-between" align="center" mt="xs" mb="xs">
                <Title order={5} c="blue.7">
                  Dịch vụ đã chọn
                </Title>

                <Group gap="xs" justify="end">
                  <Button
                    color="cyan"
                    size="xs"
                    onClick={() => handlePreview(invoiceDetail?.invoiceId!)}
                  >
                    xem trước
                  </Button>
                  <Button
                    color="cyan"
                    size="xs"
                    onClick={async () => {
                      setIsDownloading(true);
                      await downloadInvoice(invoiceDetail.invoiceId);
                      setIsDownloading(false);
                    }}
                    disabled={isDownloading}
                    loading={isDownloading}
                  >
                    tải xuống
                  </Button>

                  <Button
                    color="cyan"
                    size="xs"
                    onClick={() => setViewModalOpened(true)}
                    disabled={
                      selectedInvoiceInfo?.status === "PAID" ||
                      !editableInvoiceDetail.confirmedBy
                    }
                    title={
                      selectedInvoiceInfo?.status === "PAID"
                        ? "Hóa đơn đã thanh toán"
                        : !editableInvoiceDetail.confirmedBy
                        ? "Vui lòng chọn người thu trước"
                        : ""
                    }
                  >
                    Thêm dịch vụ
                  </Button>
                </Group>
              </Group>

              {invoiceDetail.items.length ? (
                <ServiceTable
                  serviceRows={rowsFromInvoice}
                  setServiceRows={() => {}}
                  medicalServices={[]}
                  serviceOptions={[]}
                  editable={false}
                  showDepartment={false}
                />
              ) : (
                <Text c="dimmed">Không có dịch vụ nào được ghi nhận.</Text>
              )}
            </>
          ) : (
            <Text mt="md" c="dimmed">
              Chọn một hóa đơn để xem chi tiết
            </Text>
          )}
        </Paper>
      </Grid.Col>

      {invoiceDetail && (
        <ViewEditInvoiceServicesModal
          opened={viewModalOpened}
          onClose={() => setViewModalOpened(false)}
          invoiceItems={invoiceDetail.items}
          availableServices={[]}
          editable={false}
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
