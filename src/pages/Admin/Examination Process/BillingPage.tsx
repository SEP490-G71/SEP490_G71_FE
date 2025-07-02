import {
  Divider,
  Group,
  Paper,
  Text,
  Title,
  Loader,
  ScrollArea,
  Grid,
  TextInput,
  Table,
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
import FilterPanel from "../../../components/common/FilterSection";
import { Pagination } from "@mantine/core";
import ServiceTable from "../../../components/medical-examination/MedicalServiceTable";
import { ServiceRow } from "../../../types/serviceRow";
import { markInvoicePending } from "../../../hooks/invoice/payment/invoicePayment";
import { usePreviewInvoice } from "../../../hooks/invoice/payment/usePreviewInvoice";
import {
  InvoiceStatus,
  InvoiceStatusMap,
} from "../../../enums/InvoiceStatus/InvoiceStatus";
import { toast } from "react-toastify";

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

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );

  const [viewModalOpened, setViewModalOpened] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
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
    if (invoiceDetail) {
      setEditableInvoiceDetail({
        paymentType: invoiceDetail.paymentType as keyof typeof PaymentType,
        confirmedBy: invoiceDetail.confirmedBy ?? undefined,
      });
    }
  }, [invoiceDetail]);

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

  const handleSavePendingInvoice = async () => {
    if (!invoiceDetail) return;

    try {
      await markInvoicePending(
        invoiceDetail,
        editableInvoiceDetail,
        fetchInvoiceDetail
      );

      toast.success("Hóa đơn đã được thanh toán");

      // Load lại danh sách
      fetchInvoices({ status: InvoiceStatus.UNPAID }, page - 1, pageSize);

      // Reset lựa chọn nếu muốn
      setSelectedInvoiceId(null);
    } catch (error: any) {
      const messageMap: Record<string, string> = {
        MISSING_STAFF_ID: "❗ Vui lòng chọn người thu trước",
        MISSING_PAYMENT_TYPE: "❗ Vui lòng chọn hình thức thanh toán",
        MISSING_INVOICE_DETAIL: "❗ Không tìm thấy thông tin hóa đơn",
      };

      const rawMessage = error?.message || "❗ Đã có lỗi xảy ra";
      const message = messageMap[rawMessage] || rawMessage;

      toast.error(message);
    }
  };

  const { previewInvoice } = usePreviewInvoice();
  return (
    <Grid>
      {/* Cột trái: Danh sách hóa đơn */}
      <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
        <Paper shadow="xs" p="md" radius="md" mb="md" withBorder>
          <FilterPanel />
        </Paper>

        <Paper shadow="xs" radius="md" p="md" withBorder>
          <Title order={5} mb="md">
            Danh sách hóa đơn
          </Title>

          {loadingList ? (
            <Loader />
          ) : (
            <>
              <ScrollArea offsetScrollbars scrollbarSize={8} h="auto">
                <Table
                  withColumnBorders
                  highlightOnHover
                  style={{
                    minWidth: 700,
                    borderCollapse: "separate",
                    borderSpacing: "2px",
                  }}
                >
                  <thead style={{ backgroundColor: "#dee2e6" }}>
                    <tr>
                      <th style={{ textAlign: "left", paddingLeft: "10px" }}>
                        Trạng thái
                      </th>
                      <th style={{ textAlign: "center" }}>Mã hóa đơn</th>
                      <th style={{ textAlign: "left", paddingLeft: "10px" }}>
                        Tên bệnh nhân
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {invoices.map((inv, index) => {
                      const isSelected = selectedInvoiceId === inv.invoiceId;
                      return (
                        <tr
                          key={inv.invoiceId}
                          onClick={() => handleSelectInvoice(inv.invoiceId)}
                          style={{
                            cursor: "pointer",
                            backgroundColor: isSelected
                              ? "#cce5ff"
                              : index % 2 === 0
                              ? "#f8f9fa"
                              : "#e9ecef",
                            borderBottom: "1px solid #adb5bd",
                          }}
                        >
                          <td
                            style={{
                              textAlign: "left",
                              paddingLeft: "10px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {InvoiceStatusMap[
                              inv.status as keyof typeof InvoiceStatusMap
                            ] ?? inv.status}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {inv.invoiceCode}
                          </td>
                          <td
                            style={{
                              textAlign: "left",
                              paddingLeft: "10px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {inv.patientName}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </ScrollArea>

              {/* Pagination và thông tin số lượng */}
              <Group justify="space-between" mt="sm">
                <Text size="sm">
                  {invoices.length > 0
                    ? `${(page - 1) * 5 + 1}–${
                        (page - 1) * 5 + invoices.length
                      }`
                    : "Không có hóa đơn chưa thanh toán"}
                </Text>

                <Group>
                  <Select
                    data={["5", "10", "20"]}
                    value={pageSize.toString()} // 👈 dùng state thật sự
                    onChange={(value) => {
                      if (value) {
                        setPageSize(Number(value)); // cập nhật pageSize
                        setPage(1); // reset về trang đầu khi thay đổi
                      }
                    }}
                    w={100}
                    variant="filled"
                    size="xs"
                  />
                  <Pagination
                    total={pagination.totalPages}
                    value={page}
                    onChange={setPage}
                    size="sm"
                  />
                </Group>
              </Group>
            </>
          )}
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
        <Paper shadow="xs" radius="md" p="md" withBorder>
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
                disabled={!editableInvoiceDetail.confirmedBy}
                title={
                  !editableInvoiceDetail.confirmedBy
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
                  paddingTop: "14px",
                  paddingBottom: "14px",
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
                  {invoiceDetail.confirmedBy ? (
                    <TextInput
                      value={invoiceDetail.confirmedBy}
                      readOnly
                      size="xs"
                    />
                  ) : (
                    <Select
                      placeholder="Chọn người thu"
                      size="xs"
                      data={staffOptions}
                      value={editableInvoiceDetail.confirmedBy ?? null}
                      onChange={(value) => {
                        console.log("Selected staff:", value);
                        setEditableInvoiceDetail((prev) => ({
                          ...prev,
                          confirmedBy: value ?? undefined,
                        }));
                      }}
                      searchable
                    />
                  )}
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
                    onClick={() => previewInvoice(invoiceDetail?.invoiceId!)}
                  >
                    xem trước
                  </Button>
                  <Button color="cyan" size="xs">
                    in pdf
                  </Button>
                  <Button
                    color="cyan"
                    size="xs"
                    onClick={() => setViewModalOpened(true)}
                    disabled={!editableInvoiceDetail.confirmedBy}
                    title={
                      !editableInvoiceDetail.confirmedBy
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

      {/* {invoiceDetail && (
        <ViewInvoiceServicesModal
          opened={viewModalOpened}
          onClose={() => setViewModalOpened(false)}
          invoiceItems={invoiceDetail.items}
          availableServices={medicalServices}
        />
      )} */}
    </Grid>
  );
};

export default BillingPage;
