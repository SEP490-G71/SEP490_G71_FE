import React from "react";
import {
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Switch,
  Table,
  Text,
  Textarea,
  Tooltip,
} from "@mantine/core";
import dayjs from "dayjs";
import { UseFormReturnType } from "@mantine/form";
import { MedicalRecordDetail } from "../../types/MedicalRecord/MedicalRecordDetail";
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
  onSave?: () => Promise<boolean | void> | boolean | void;
  isFinal: boolean;
  onAddService?: () => void;
  onFinalChange: (v: boolean) => void;

  onEndExamination?: () => void;
  onOpenTransfer?: () => void;

  lockedByTransfer?: boolean;
  lastTransferRoomLabel?: string;
}

const PatientDetailSection: React.FC<Props> = ({
  detail,
  form,

  onSummaryChange,
  onSave,
  isFinal,
  onAddService,
  onFinalChange,

  onEndExamination,
  onOpenTransfer,
  lockedByTransfer = false,
  lastTransferRoomLabel,
}) => {
  const visit = detail.visit;

  const allOrdersCompleted =
    detail.orders?.every((order) => order.status === "COMPLETED") ?? false;

  const recordCompleted = detail.status === "COMPLETED";
  const isWaitingForPayment = detail.status === "WAITING_FOR_PAYMENT";
  const isTesting = detail.status === "TESTING";

  const hideAllActions = visit?.status === Status.DONE || isWaitingForPayment;
  const [uiIsFinal, setUiIsFinal] = React.useState(isFinal);
  const saveDisabled =
    lockedByTransfer || (uiIsFinal && !allOrdersCompleted) || recordCompleted;

  const [hasSavedConclusion, setHasSavedConclusion] = React.useState(false);
  const [hasSavedFinal, setHasSavedFinal] = React.useState(false);

  const [summaryDraft, setSummaryDraft] = React.useState("");

  // 2) Xác định lần chuyển phòng hiện tại (bạn đang có latestTransfer)
  const latestTransfer = React.useMemo(() => {
    const list = detail.roomTransfers ?? [];
    if (list.length === 0) return undefined;
    return [...list].sort(
      (a, b) =>
        new Date(b.transferTime ?? 0).getTime() -
        new Date(a.transferTime ?? 0).getTime()
    )[0];
  }, [detail.roomTransfers]);

  React.useEffect(() => {
    setSummaryDraft(latestTransfer?.conclusionText ?? "");
    // đồng bộ ngược cho cha nếu cần lưu ngoài
    onSummaryChange(latestTransfer?.conclusionText ?? "");
    setHasSavedConclusion(false);
    setHasSavedFinal(false);
  }, [latestTransfer?.id]);

  React.useEffect(() => {
    if (uiIsFinal) setHasSavedFinal(false);
    else setHasSavedConclusion(false);
  }, [uiIsFinal]);

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

  const renderGridItem = (label: string, value: any) => (
    <Grid.Col span={{ base: 12, sm: 6 }}>
      <Text>
        <strong>{label}:</strong> {value ?? "---"}
      </Text>
    </Grid.Col>
  );

  const handleToggleFinal = (checked: boolean) => {
    if (checked && !allOrdersCompleted) return;
    setUiIsFinal(checked);
    onFinalChange(checked);
  };

  const handleClickSave = async () => {
    await Promise.resolve(onSave?.());
    if (uiIsFinal) setHasSavedFinal(true);
    else setHasSavedConclusion(true);
  };

  // === KẾT LUẬN TRƯỚC ĐÓ ===
  // const previousConclusions = React.useMemo(() => {
  //   const items = [...(detail.roomTransfers ?? [])].sort(
  //     (a, b) =>
  //       new Date(a.transferTime ?? 0).getTime() -
  //       new Date(b.transferTime ?? 0).getTime()
  //   );
  //   items.pop();
  //   const filtered = items.filter(
  //     (t) => t.conclusionText && t.conclusionText.trim() !== ""
  //   );
  //   return filtered.reverse();
  // }, [detail.roomTransfers]);
  const previousConclusions = React.useMemo(() => {
    const latestId = latestTransfer?.id;
    return (detail.roomTransfers ?? [])
      .filter((t) => t.id !== latestId) // loại lần hiện tại
      .filter((t) => (t.conclusionText ?? "").trim() !== "")
      .sort(
        (a, b) =>
          new Date(b.transferTime ?? 0).getTime() -
          new Date(a.transferTime ?? 0).getTime()
      );
  }, [detail.roomTransfers, latestTransfer?.id]);

  const lockMsg = lockedByTransfer
    ? `Hồ sơ đã được chuyển sang phòng ${
        lastTransferRoomLabel ?? ""
      }. Các thao tác bị khóa tại phòng của bạn.`
    : undefined;

  return (
    <Stack gap="sm">
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
              visit.checkinTime
                ? dayjs(visit.checkinTime).format("DD/MM/YYYY")
                : "—"
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
      {/* Lịch sử chuyển phòng */}
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
                  .slice(1)
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
                    c={
                      MedicalRecordStatusColor[
                        order.status as keyof typeof MedicalRecordStatusColor
                      ] ?? "gray"
                    }
                  >
                    {MedicalRecordStatusMap[
                      order.status as keyof typeof MedicalRecordStatusMap
                    ] ?? order.status}
                  </Text>
                </Group>

                {order.results && order.results.length > 0 && (
                  <Stack pl="md" gap={4}>
                    {order.results.map((result) => (
                      <Stack key={result.id} gap={2}>
                        <Text>- Người hoàn thành: {result.completedBy}</Text>
                        <Text>- Mô tả: {result.description}</Text>
                        <Text>- Ghi chú: {result.note}</Text>

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
      {/* Tổng kết / Kết luận */}
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
      {/* Kết luận trước đó */}
      {previousConclusions.length > 0 && (
        <Stack gap={6} mt="xs">
          <Text fw={600} c="dimmed">
            Kết luận trước đó
          </Text>
          <Stack gap="xs">
            {previousConclusions.map((t, idx) => (
              <Paper
                key={t.id}
                p="sm"
                withBorder
                radius="md"
                style={{ background: "#f8fafc" }}
              >
                <Group justify="space-between" mb={6}>
                  <Text fw={600} size="sm">
                    #{idx + 1} • Phòng {t.fromDepartment?.roomNumber ?? "—"}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {t.transferTime
                      ? dayjs(t.transferTime).format("DD/MM/YYYY HH:mm")
                      : "—"}
                  </Text>
                </Group>
                <Text style={{ whiteSpace: "pre-wrap" }}>
                  {t.conclusionText}
                </Text>
                <Text size="xs" c="dimmed" mt={6}>
                  Bác sĩ:{" "}
                  {t.doctor?.fullName ?? t.transferredBy?.fullName ?? "—"}
                </Text>
              </Paper>
            ))}
          </Stack>
        </Stack>
      )}
      {/* Ô nhập một field cho cả hai chế độ */}
      <Text>
        <b>{uiIsFinal ? "Tổng kết" : "Kết luận"}</b>
      </Text>
      <Textarea
        value={summaryDraft}
        onChange={(e) => {
          setSummaryDraft(e.currentTarget.value);
          onSummaryChange(e.currentTarget.value);
        }}
        placeholder={uiIsFinal ? "Nhập tổng kết..." : "Nhập kết luận..."}
        autosize
        minRows={2}
      />
      {/* Switch đánh dấu hoàn tất */}
      <Group gap="sm" align="center" mt="xs">
        <Text fw={600}>
          Đánh dấu hồ sơ là <i>Hoàn tất</i>
        </Text>
        <Tooltip
          label={
            lockedByTransfer
              ? lockMsg
              : !allOrdersCompleted
              ? "Cần hoàn tất tất cả dịch vụ trước khi kết thúc hồ sơ"
              : recordCompleted
              ? "Hồ sơ đã hoàn tất"
              : undefined
          }
          disabled={!lockedByTransfer && allOrdersCompleted && !recordCompleted}
          withArrow
        >
          <div>
            <Switch
              checked={uiIsFinal}
              onChange={(e) => handleToggleFinal(e.currentTarget.checked)}
              disabled={
                lockedByTransfer || !allOrdersCompleted || recordCompleted
              }
              size="lg"
              radius="xl"
              color="green"
              onLabel="ON"
              offLabel="OFF"
            />
          </div>
        </Tooltip>
      </Group>
      {/* Cụm nút hành động */}
      {!hideAllActions && (
        <Stack align="flex-end">
          <Group justify="flex-end" gap="sm">
            {!uiIsFinal && !isTesting && (
              <>
                {/* Thêm dịch vụ */}
                <Tooltip label={lockMsg} disabled={!lockedByTransfer} withArrow>
                  <div>
                    <Button
                      variant="light"
                      color="green"
                      onClick={onAddService}
                      disabled={lockedByTransfer}
                    >
                      Thêm dịch vụ
                    </Button>
                  </div>
                </Tooltip>

                {/* Lưu Kết luận */}
                <Tooltip label={lockMsg} disabled={!lockedByTransfer} withArrow>
                  <div>
                    <Button
                      variant="light"
                      color="yellow"
                      onClick={handleClickSave}
                      disabled={saveDisabled}
                    >
                      Lưu Kết luận
                    </Button>
                  </div>
                </Tooltip>

                {hasSavedConclusion && (
                  <Tooltip
                    label={lockMsg}
                    disabled={!lockedByTransfer}
                    withArrow
                  >
                    <div>
                      <Button
                        variant="light"
                        color="blue"
                        onClick={onOpenTransfer}
                        disabled={lockedByTransfer}
                      >
                        Chuyển phòng
                      </Button>
                    </div>
                  </Tooltip>
                )}
              </>
            )}

            {uiIsFinal && !isTesting && (
              <>
                {/* Lưu Tổng kết */}
                <Tooltip label={lockMsg} disabled={!lockedByTransfer} withArrow>
                  <div>
                    <Button
                      variant="light"
                      color="yellow"
                      onClick={handleClickSave}
                      disabled={saveDisabled}
                    >
                      Lưu Tổng kết
                    </Button>
                  </div>
                </Tooltip>

                {hasSavedFinal && (
                  <Tooltip
                    label={lockMsg}
                    disabled={!lockedByTransfer}
                    withArrow
                  >
                    <div>
                      <Button
                        variant="light"
                        color="red"
                        size="sm"
                        onClick={onEndExamination}
                        disabled={lockedByTransfer}
                      >
                        Kết thúc khám
                      </Button>
                    </div>
                  </Tooltip>
                )}
              </>
            )}
          </Group>
        </Stack>
      )}
    </Stack>
  );
};

export default PatientDetailSection;
