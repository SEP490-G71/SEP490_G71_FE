import {
  Card,
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

const BillingPage = () => {
  const {
    invoices,
    invoiceDetail,
    loadingList,
    loadingDetail,
    fetchInvoices,
    fetchInvoiceDetail,
  } = useInvoice();

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );
  const [editModalOpened, setEditModalOpened] = useState(false);
  const { medicalServices } = useMedicalService();

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
            <ScrollArea offsetScrollbars scrollbarSize={8} type="auto">
              <div
                style={{
                  width: "100%",
                  overflowX: "auto",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Table
                  striped
                  withColumnBorders
                  highlightOnHover
                  style={{
                    width: "100%",
                    maxWidth: "800px",
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
                        }}
                      >
                        Mã hóa đơn
                      </th>
                      <th
                        style={{
                          border: "1px solid #dee2e6",
                          textAlign: "center",
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
                            border: "1px solid #dee2e6",
                            textAlign: "center",
                          }}
                        >
                          {inv.invoiceCode}
                        </td>
                        <td
                          style={{
                            border: "1px solid #dee2e6",
                            textAlign: "center",
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
          )}
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
        <Paper shadow="xs" radius="md" p="md" withBorder>
          <Group justify="space-between" mb="sm">
            <Button variant="light" size="md">
              Ghi thông tin hóa đơn
            </Button>
            <Button color="red" variant="filled" size="md">
              Thanh toán
            </Button>
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
                  onClick={() => setEditModalOpened(true)}
                >
                  Thêm dịch vụ
                </Button>
              </Group>

              {invoiceDetail.items.length ? (
                <Table
                  striped
                  withTableBorder
                  withColumnBorders
                  highlightOnHover
                >
                  <thead style={{ backgroundColor: "#f1f3f5" }}>
                    <tr>
                      {[
                        "Mã DV",
                        "Tên DV",
                        "ĐVT",
                        "SL",
                        "Đơn giá",
                        "Giảm giá (%)",
                        "VAT (%)",
                        "Thành tiền",
                      ].map((title, i) => (
                        <th
                          key={i}
                          style={{
                            textAlign:
                              i === 1 ? "left" : i >= 4 ? "right" : "center",
                            padding: "8px",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          {title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceDetail.items.map((item, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "8px",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          {item.serviceCode}
                        </td>
                        <td
                          style={{
                            textAlign: "left",
                            padding: "8px",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          {item.name}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "8px",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          Lần
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "8px",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          {item.quantity}
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            padding: "8px",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          {item.price.toLocaleString()}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "8px",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          {item.discount ?? 0}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "8px",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          {item.vat ?? 0}%
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            padding: "8px",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          {item.total?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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

      {/* {invoiceDetail && (
        <EditInvoiceModal
          opened={editModalOpened}
          onClose={() => setEditModalOpened(false)}
          invoiceId={invoiceDetail.invoiceId}
          staffId={invoiceDetail.staffId}
          availableServices={medicalServices}
          onSuccess={() => fetchInvoiceDetail(invoiceDetail.invoiceId)}
        />
      )} */}
    </Grid>
  );
};

export default BillingPage;
