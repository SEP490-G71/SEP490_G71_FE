import {
  Button,
  Divider,
  Grid,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  Textarea,
} from "@mantine/core";
import { MedicalRecordDetail } from "../../types/MedicalRecord/MedicalRecordDetail";
import dayjs from "dayjs";
import { UseFormReturnType } from "@mantine/form";
import {
  Status,
  StatusColor,
  StatusLabel,
} from "../../enums/Queue-Patient/Status";
import {
  MedicalRecordStatusColor,
  MedicalRecordStatusMap,
} from "../../enums/MedicalRecord/MedicalRecordStatus";

interface Props {
  detail: MedicalRecordDetail;
  form: UseFormReturnType<any>;
  summaryValue: string;
  onSummaryChange: (value: string) => void;
  onSave?: () => void;
  onAddService?: () => void;
}

const PatientDetailSection = ({
  detail,
  form,
  summaryValue,
  onSummaryChange,
  onSave,
  onAddService,
}: Props) => {
  const visit = detail.visit;
  const allOrdersCompleted = detail.orders?.every(
    (order) => order.status === "COMPLETED"
  );
  const DeptCell = ({
    dept,
  }: {
    dept?: { name?: string; roomNumber?: string };
  }) => (
    <Stack gap={0} style={{ minWidth: 0 }}>
      <Text fw={700} fz="sm" lineClamp={1} title={dept?.name ?? ""}>
        {dept?.name ?? "—"}
      </Text>
      <Text fz="xs" c="dimmed">
        {dept?.roomNumber ? `Phòng ${dept.roomNumber}` : "—"}
      </Text>
    </Stack>
  );
  const recordCompleted = detail.status === "COMPLETED";
  const renderGridItem = (label: string, value: any) => (
    <Grid.Col span={{ base: 12, sm: 6 }}>
      <Text>
        <strong>{label}:</strong> {value ?? "---"}
      </Text>
    </Grid.Col>
  );

  return (
    <Stack gap="sm">
      {/* Thông tin chi tiết bệnh nhân */}
      <Divider
        label="Thông tin chi tiết bệnh nhân"
        labelPosition="center"
        my="xs"
      />
      <Grid>
        {renderGridItem("Mã hồ sơ", detail.medicalRecordCode)}
        {renderGridItem("Mã bệnh nhân", detail.patientCode)}
        {renderGridItem("Họ tên", detail.patientName)}
        {renderGridItem("Giới tính", detail.gender === "MALE" ? "Nam" : "Nữ")}
        {renderGridItem("Ngày sinh", detail.dateOfBirth)}
        {renderGridItem("SĐT", detail.phone)}
      </Grid>

      {/* Thông tin lượt khám */}
      {visit && (
        <>
          <Divider label="Thông tin lượt khám" labelPosition="center" my="xs" />
          <Grid>
            {renderGridItem("Phòng", visit.roomNumber)}
            {renderGridItem("Chuyên khoa", visit.specialization?.name)}

            {renderGridItem(
              "Trạng thái",
              <Text
                span
                fw={700}
                fz="lg"
                c={StatusColor[visit.status as Status] ?? "gray"}
              >
                {StatusLabel[visit.status as Status] ?? visit.status}
              </Text>
            )}
            {renderGridItem(
              "Thời gian check-in",
              dayjs(visit.checkinTime).format("DD/MM/YYYY")
            )}
          </Grid>
        </>
      )}

      {/* Thông tin khám */}
      <Divider label="Thông tin khám" labelPosition="center" my="xs" />
      <Grid>
        {renderGridItem("Triệu chứng", detail.diagnosisText)}
        {renderGridItem("Ghi chú", detail.notes)}
        {renderGridItem("Nhiệt độ", `${detail.temperature} °C`)}
        {renderGridItem("Huyết áp", detail.bloodPressure)}
        {renderGridItem("Nhịp tim", `${detail.heartRate} bpm`)}
        {renderGridItem("Nhịp thở", `${detail.respiratoryRate} lần/phút`)}
        {renderGridItem("SpO₂", `${detail.spo2}%`)}
        {renderGridItem("Chiều cao", `${detail.heightCm} cm`)}
        {renderGridItem("Cân nặng", `${detail.weightKg} kg`)}
        {renderGridItem("BMI", detail.bmi)}
      </Grid>

      <Divider label="Lịch sử chuyển phòng" labelPosition="center" my="xs" />

      {Array.isArray(detail.roomTransfers) &&
        detail.roomTransfers.length > 1 && (
          <ScrollArea.Autosize
            mah={260}
            type="auto"
            offsetScrollbars
            scrollbarSize={8}
          >
            <Table
              striped
              highlightOnHover
              withColumnBorders
              verticalSpacing="xs"
              stickyHeader
            >
              <Table.Thead style={{ fontSize: 12 }}>
                <Table.Tr>
                  <Table.Th style={{ width: 56, textAlign: "center" }}>
                    STT
                  </Table.Th>
                  <Table.Th>TỪ PHÒNG → ĐẾN PHÒNG</Table.Th>
                  <Table.Th>THỜI GIAN CHUYỂN</Table.Th>
                  <Table.Th>LÝ DO</Table.Th>
                  <Table.Th>NGƯỜI CHUYỂN</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {[...detail.roomTransfers]
                  .sort(
                    (a, b) =>
                      new Date(a.transferTime).getTime() -
                      new Date(b.transferTime).getTime()
                  )
                  .slice(1) // bỏ phần tử đầu
                  .map((t, idx) => (
                    <Table.Tr key={t.id}>
                      <Table.Td style={{ textAlign: "center" }}>
                        {idx + 1}
                      </Table.Td>

                      <Table.Td>
                        <Group gap="sm" wrap="nowrap" align="flex-start">
                          <DeptCell dept={t.fromDepartment} />
                          <Text fz="sm" c="gray">
                            →
                          </Text>
                          <DeptCell dept={t.toDepartment} />
                        </Group>
                      </Table.Td>

                      <Table.Td>
                        {t.transferTime
                          ? dayjs(t.transferTime).format("DD/MM/YYYY HH:mm")
                          : "—"}
                      </Table.Td>

                      <Table.Td>{t.reason || "—"}</Table.Td>
                      <Table.Td>{t.transferredBy?.fullName ?? "—"}</Table.Td>
                    </Table.Tr>
                  ))}
              </Table.Tbody>
            </Table>
          </ScrollArea.Autosize>
        )}

      {/* Dịch vụ đã kê */}
      {detail.orders?.length > 0 && (
        <>
          <Divider label="Dịch vụ đã kê" labelPosition="center" my="xs" />
          <Stack>
            {detail.orders.map((order, index) => (
              <Stack key={order.id} gap="xs">
                <Group gap="xs" align="center">
                  <Text fw={600}>
                    {index + 1}. {order.serviceName}
                  </Text>

                  <Text
                    fw={700}
                    fz="lg"
                    c={MedicalRecordStatusColor[order.status] ?? "gray"}
                  >
                    {MedicalRecordStatusMap[order.status] ?? order.status}
                  </Text>
                </Group>

                {/* Nếu có kết quả thì hiển thị */}
                {order.results && order.results.length > 0 && (
                  <Stack pl="md" gap={4}>
                    {order.results.map((result) => (
                      <Stack key={result.id} gap={2}>
                        <Text>- Người hoàn thành: {result.completedBy}</Text>
                        <Text>- Mô tả: {result.description}</Text>
                        <Text>- Ghi chú: {result.note}</Text>

                        {/* Nếu có hình ảnh */}
                        {result.imageUrls?.length > 0 && (
                          <Stack>
                            <Text>- Hình ảnh:</Text>
                            <Grid>
                              {result.imageUrls.map(
                                (img: { id: string; imageUrl: string }) => (
                                  <Grid.Col span="content" key={img.id}>
                                    <img
                                      src={img.imageUrl}
                                      alt="Ảnh kết quả"
                                      style={{
                                        maxWidth: "150px",
                                        maxHeight: "150px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        border: "1px solid #ccc",
                                      }}
                                    />
                                  </Grid.Col>
                                )
                              )}
                            </Grid>
                          </Stack>
                        )}
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Stack>
            ))}
          </Stack>
        </>
      )}

      <Divider label="Tổng kết" labelPosition="center" my="xs" />

      <Text>
        <strong>Ghi chú:</strong>
      </Text>
      <Textarea
        {...form.getInputProps("notes")}
        placeholder="Nhập ghi chú khám bệnh..."
        autosize
        minRows={2}
      />

      <Text>
        <strong>Chẩn đoán:</strong>
      </Text>
      <Textarea
        {...form.getInputProps("diagnosisText")}
        placeholder="Nhập chẩn đoán..."
        autosize
        minRows={2}
      />
      <Text>
        <strong>Tổng kết:</strong>
      </Text>
      <Textarea
        value={summaryValue}
        onChange={(e) => onSummaryChange(e.currentTarget.value)}
        placeholder="Nhập tóm tắt khám bệnh..."
        autosize
        minRows={2}
      />

      {/* Nút Lưu */}
      <Stack align="flex-end">
        <Group justify="flex-end" gap="sm">
          {detail.status === "TESTING_COMPLETED" && (
            <>
              <Button variant="outline" onClick={onAddService}>
                Thêm dịch vụ
              </Button>
            </>
          )}

          <Button
            color="red"
            onClick={onSave}
            disabled={!allOrdersCompleted || recordCompleted}
          >
            Lưu Tổng kết
          </Button>
        </Group>
      </Stack>
    </Stack>
  );
};

export default PatientDetailSection;
