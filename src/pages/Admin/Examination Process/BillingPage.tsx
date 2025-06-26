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
import { useInvoice } from "../../../hooks/invoice/useInvoice";
import dayjs from "dayjs";
import EditInvoiceModal from "../../../components/invoice/EditInvoiceModal";
import useMedicalService from "../../../hooks/medical-service/useMedicalService";
import useStaffs from "../../../hooks/staffs-service/useStaffs";
import PatientInfoPanel from "../../../components/patient/PatientInfoPanel";
import { PaymentType } from "../../../enums/Payment/PaymentType";
import FilterPanel from "../../../components/common/FilterSection";
import { Pagination } from "@mantine/core";
import ServiceTable from "../../../components/medical-examination/MedicalServiceTable";
import { ServiceRow } from "../../../types/serviceRow";
import ViewInvoiceServicesModal from "../../../components/invoice/EditInvoiceModal";
import { MedicalService } from "../../../types/Admin/MedicalService/MedicalService";

const BillingPage = () => {
  const {
    invoices,
    invoiceDetail,
    loadingList,
    loadingDetail,
    fetchInvoices,
    fetchInvoiceDetail,
    pagination,
  } = useInvoice();

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );
  const [editModalOpened, setEditModalOpened] = useState(false);
  //const { medicalServices } = useMedicalService();

  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [medicalServices, setMedicalServices] = useState<MedicalService[]>([]);

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

  useEffect(() => {
    fetchInvoices(page - 1, 5);
  }, [page]);

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

  return (
    <Grid>
      {/* Cột trái: Danh sách hóa đơn */}
      <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
        <Paper shadow="xs" p="md" radius="md" mb="md" withBorder>
          <FilterPanel />
        </Paper>

        <Paper shadow="xs" radius="md" p="md" withBorder>
          <Title order={3} mb="md">
            Danh sách hóa đơn
          </Title>

          {loadingList ? (
            <Loader />
          ) : (
            <>
              <ScrollArea offsetScrollbars scrollbarSize={8} type="auto">
                <div
                  style={{
                    width: "100%",
                    overflowX: "auto",
                  }}
                >
                  <Table
                    striped
                    withColumnBorders
                    highlightOnHover
                    style={{
                      width: "100%",
                      minWidth: "500px",
                      border: "1px solid #dee2e6",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead style={{ backgroundColor: "#f1f3f5" }}>
                      <tr>
                        <th
                          style={{
                            border: "1px solid #dee2e6",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Trạng thái
                        </th>

                        <th
                          style={{
                            border: "1px solid #dee2e6",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Mã hóa đơn
                        </th>
                        <th
                          style={{
                            border: "1px solid #dee2e6",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Tên bệnh nhân
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr
                          key={inv.invoiceId}
                          onClick={() => handleSelectInvoice(inv.invoiceId)}
                          style={{
                            backgroundColor:
                              selectedInvoiceId === inv.invoiceId
                                ? "#cce5ff"
                                : "white",
                            cursor: "pointer",
                          }}
                        >
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                              border: "1px solid #dee2e6",
                            }}
                          >
                            {inv.status}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                              border: "1px solid #dee2e6",
                            }}
                          >
                            {inv.invoiceCode}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                              border: "1px solid #dee2e6",
                            }}
                          >
                            {inv.patientName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </ScrollArea>

              {pagination.totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "12px",
                  }}
                >
                  <Pagination
                    value={page}
                    onChange={setPage}
                    total={pagination.totalPages}
                    size="sm"
                    radius="md"
                  />
                </div>
              )}
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
                color="blue"
                // onClick={handleSavePendingInvoice}
                disabled={!editableInvoiceDetail.confirmedBy}
                title={
                  !editableInvoiceDetail.confirmedBy
                    ? "Vui lòng chọn người thu trước"
                    : ""
                }
              >
                Lưu hóa đơn
              </Button>

              <Button
                color="red"
                variant="filled"
                size="md"
                // onClick={handleConfirmPayment}
                // disabled={invoiceDetail.status !== "PENDING"}
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

              <Group justify="flex-end" mt="md">
                <Text fw={700} style={{ color: "red", fontSize: "16px" }}>
                  Tổng : {invoiceDetail.amount.toLocaleString()}đ
                </Text>
              </Group>
            </>
          ) : (
            <Text mt="md" c="dimmed">
              Chọn một hóa đơn để xem chi tiết
            </Text>
          )}
        </Paper>
      </Grid.Col>

      {/* <EditInvoiceModal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        invoiceId={invoiceDetail?.invoiceId || ""}
        staffId={"current-staff-id"}
        availableServices={medicalServices}
        invoiceItems={
          invoiceDetail?.items.map((item) => {
            const matched = medicalServices.find(
              (s) => s.serviceCode === item.serviceCode
            );
            return {
              serviceId: matched?.id ?? "",
              quantity: item.quantity,
            };
          }) ?? []
        }
        onSuccess={() => {
          fetchInvoiceDetail(invoiceDetail?.invoiceId ?? "");
          fetchInvoices();
        }}
      /> */}

      {invoiceDetail && (
        <ViewInvoiceServicesModal
          opened={viewModalOpened}
          onClose={() => setViewModalOpened(false)}
          invoiceItems={invoiceDetail.items}
          availableServices={medicalServices}
        />
      )}
    </Grid>
  );
};

export default BillingPage;
