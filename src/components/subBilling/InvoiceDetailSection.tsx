import {
  Button,
  Divider,
  Group,
  Grid,
  Loader,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import dayjs from "dayjs";

import ServiceTable from "../medical-examination/MedicalServiceTable";
import { InvoiceStatus } from "../../enums/InvoiceStatus/InvoiceStatus";
import { PaymentType } from "../../enums/Payment/PaymentType";
import { ServiceRow } from "../../types/serviceRow";

type Props = {
  invoiceDetail: any;
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
};

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
}: Props) => {
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
              <Button
                color="cyan"
                size="xs"
                onClick={() => handlePreview(invoiceDetail.invoiceId)}
              >
                xem trước
              </Button>
              <Button
                color="cyan"
                size="xs"
                onClick={() => handleDownload(invoiceDetail.invoiceId)}
                disabled={isDownloading}
                loading={isDownloading}
              >
                tải xuống
              </Button>
              <Button
                color="cyan"
                size="xs"
                onClick={handleOpenModal}
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
    </>
  );
};

export default InvoiceDetailSection;
