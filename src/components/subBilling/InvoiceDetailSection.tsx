import {
  Button,
  Divider,
  Grid,
  Loader,
  Select,
  Text,
  TextInput,
  Title,
  Group,
} from "@mantine/core";
import dayjs from "dayjs";

import ServiceTable from "../medical-examination/MedicalServiceTable";
import { InvoiceStatus } from "../../enums/InvoiceStatus/InvoiceStatus";
import { PaymentType } from "../../enums/Payment/PaymentType";
import { ServiceRow } from "../../types/serviceRow";
import { InvoiceDetail } from "../../types/Invoice/invoice";

interface Props {
  invoiceDetail?: InvoiceDetail;
  loadingDetail: boolean;
  editableInvoiceDetail: {
    paymentType?: keyof typeof PaymentType;
    confirmedBy?: string;
  };
  staffOptions: { value: string; label: string }[];
  paymentTypeOptions: { value: string; label: string }[];
  rowsFromInvoice: ServiceRow[];
  selectedInvoiceInfo: { id: string; status: InvoiceStatus } | null;
  isDownloading: boolean;
  handlePreview: (invoiceId: string) => void;
  handleDownload: (invoiceId: string) => Promise<void>;
  handleOpenModal: () => void;
  setEditableInvoiceDetail: (val: any) => void;
  handleGenerateQr?: (invoiceId: string) => void;
}

const InvoiceDetailSection = ({
  invoiceDetail,
  loadingDetail,
  editableInvoiceDetail,
  staffOptions,
  paymentTypeOptions,
  rowsFromInvoice,
  selectedInvoiceInfo,
  isDownloading,
  handlePreview,
  handleDownload,
  handleOpenModal,
  setEditableInvoiceDetail,
  handleGenerateQr,
}: Props) => {
  const isPaid = selectedInvoiceInfo?.status === InvoiceStatus.PAID;
  const isUnpaid = selectedInvoiceInfo?.status === InvoiceStatus.UNPAID;

  return (
    <>
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
              <TextInput value={invoiceDetail.invoiceCode} readOnly size="xs" />
            </Grid.Col>

            <Grid.Col span={3}>
              <Text size="xs" fw={500}>
                Ngày xác nhận
              </Text>
              <TextInput
                value={dayjs(invoiceDetail.confirmedAt ?? new Date()).format(
                  "DD/MM/YYYY HH:mm"
                )}
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
                  isPaid
                    ? invoiceDetail.confirmedBy || ""
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
                    setEditableInvoiceDetail((prev: any) => ({
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
              {/* Luôn có: Xem trước */}
              <Button
                color="cyan"
                size="xs"
                onClick={() => handlePreview(invoiceDetail.invoiceId)}
              >
                xem trước
              </Button>

              {/* UNPAID: Ẩn tải xuống, hiện Sinh mã QR */}
              {isUnpaid && (
                <Button
                  color="grape"
                  size="xs"
                  onClick={() => handleGenerateQr?.(invoiceDetail.invoiceId)}
                >
                  sinh mã qr
                </Button>
              )}

              {/* PAID: Chỉ xem trước & tải xuống → hiện tải xuống, ẩn QR + Thêm DV */}
              {isPaid && (
                <Button
                  color="cyan"
                  size="xs"
                  onClick={() => handleDownload(invoiceDetail.invoiceId)}
                  disabled={isDownloading}
                  loading={isDownloading}
                >
                  tải xuống
                </Button>
              )}

              {/* Chỉ cho thêm dịch vụ khi CHƯA paid */}
              {!isPaid && (
                <Button
                  color="cyan"
                  size="xs"
                  onClick={handleOpenModal}
                  disabled={!editableInvoiceDetail.confirmedBy}
                  title={
                    !editableInvoiceDetail.confirmedBy
                      ? "Vui lòng chọn người thu trước"
                      : ""
                  }
                >
                  Thêm dịch vụ
                </Button>
              )}
            </Group>
          </Group>

          {invoiceDetail.items?.length ? (
            <ServiceTable
              serviceRows={rowsFromInvoice}
              setServiceRows={() => {}}
              medicalServices={[]}
              serviceOptions={[]}
              editable={false}
              showDepartment={false}
              invoiceDetail={invoiceDetail}
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
    </>
  );
};

export default InvoiceDetailSection;
