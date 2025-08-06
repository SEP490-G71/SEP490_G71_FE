import { Divider, Grid, Stack, Text, Textarea } from "@mantine/core";
import { MedicalRecordDetail } from "../../types/MedicalRecord/MedicalRecordDetail";
import dayjs from "dayjs";
import { UseFormReturnType } from "@mantine/form";

interface Props {
  detail: MedicalRecordDetail;
  form: UseFormReturnType<any>;
  summaryValue: string;
  onSummaryChange: (value: string) => void;
}

const PatientDetailSection = ({
  detail,
  form,
  summaryValue,
  onSummaryChange,
}: Props) => {
  const visit = detail.visit;

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

            {renderGridItem("Trạng thái", visit.status)}
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

      {/* Dịch vụ đã kê */}
      {detail.orders?.length > 0 && (
        <>
          <Divider label="Dịch vụ đã kê" labelPosition="center" my="xs" />
          <Stack>
            {detail.orders.map((order, index) => (
              <Stack key={order.id} gap="xs">
                <Text>
                  <strong>
                    {index + 1}. {order.serviceName}
                  </strong>{" "}
                  - ({order.status})
                </Text>

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
      <Divider label="" labelPosition="center" my="xs" />
    </Stack>
  );
};

export default PatientDetailSection;
