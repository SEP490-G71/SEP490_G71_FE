import { Paper, Text } from "@mantine/core";

type Props = {
  patientId: string;
};

const MedicalHistoryPanel = ({}: Props) => {
  // Tạm thời hardcode dữ liệu mô phỏng
  const fakeData = [
    {
      date: "2025-07-15",
      doctor: "BS. Nguyễn Văn A",
      diagnosis: "Cảm cúm thông thường",
    },
    {
      date: "2025-06-12",
      doctor: "BS. Trần Thị B",
      diagnosis: "Viêm họng cấp",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {fakeData.map((item, index) => (
        <Paper key={index} p="sm" withBorder>
          <Text size="sm" fw={600}>
            Ngày khám: {item.date}
          </Text>
          <Text size="sm">Bác sĩ: {item.doctor}</Text>
          <Text size="sm" c="dimmed">
            Chẩn đoán: {item.diagnosis}
          </Text>
        </Paper>
      ))}
    </div>
  );
};

export default MedicalHistoryPanel;
