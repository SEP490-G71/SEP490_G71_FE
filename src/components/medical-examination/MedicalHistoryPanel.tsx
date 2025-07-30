import { Loader, Modal, Paper, Text } from "@mantine/core";
import dayjs from "dayjs";
import { useState } from "react";
import { useMedicalHistoryByPatientId } from "../../hooks/medicalRecord/useMedicalHistoryByPatientId";
import useMedicalRecordDetail from "../../hooks/medicalRecord/useMedicalRecordDetail";

type Props = {
  patientId: string;
};

const MedicalHistoryPanel = ({ patientId }: Props) => {
  const { history, loading, error } = useMedicalHistoryByPatientId(patientId);
  const {
    fetchMedicalRecordDetail,
    loading: detailLoading,
    recordDetail,
  } = useMedicalRecordDetail();

  const [modalOpened, setModalOpened] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const cellStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "left",
    wordBreak: "break-word",
  };

  const handleClick = async (id: string) => {
    await fetchMedicalRecordDetail(id);
    setModalOpened(true);
  };

  if (loading) return <Loader size="sm" />;
  if (error) return <Text color="red">{error}</Text>;

  if (history.length === 0)
    return (
      <Text size="sm" c="dimmed">
        Chưa có lịch sử khám.
      </Text>
    );

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {history.map((item) => (
          <Paper
            key={item.id}
            p="sm"
            withBorder
            style={{ cursor: "pointer" }}
            onClick={() => handleClick(item.id)}
          >
            <Text size="sm" fw={600}>
              Ngày khám: {dayjs(item.createdAt).format("DD/MM/YYYY")}
            </Text>
            <Text size="sm">Bác sĩ: {item.doctorName}</Text>
            <Text size="sm" c="dimmed">
              Mã hồ sơ: {item.medicalRecordCode}
            </Text>
          </Paper>
        ))}
      </div>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Chi tiết hồ sơ bệnh án"
        size="lg"
        styles={{ body: { maxHeight: "80vh", overflowY: "auto" } }}
      >
        {detailLoading || !recordDetail ? (
          <Loader />
        ) : (
          <div>
            <Text mt={2}>Mã hồ sơ: {recordDetail.medicalRecordCode}</Text>
            <Text mt={2}>Phòng: {recordDetail.visit?.roomNumber}</Text>
            <Text mt={2}>Bác sĩ khám: {recordDetail.createdBy}</Text>
            <Text mt={2}>
              Họ tên: {recordDetail.patientName} | Ngày sinh:{" "}
              {dayjs(recordDetail.dateOfBirth).format("DD/MM/YYYY")} | Giới
              tính: {recordDetail.gender === "MALE" ? "Nam" : "Nữ"}
            </Text>

            {/* Chẩn đoán */}
            <div
              style={{
                background: "#f8f9fa",
                padding: "12px 16px",
                borderRadius: 8,
                marginTop: 16,
                whiteSpace: "pre-wrap",
                border: "1px dashed #ccc",
              }}
            >
              <Text fw={600} mb={4}>
                Chẩn đoán:
              </Text>
              <Text size="sm">{recordDetail.diagnosisText || "Không có"}</Text>
            </div>

            {/* Ghi chú */}
            <div
              style={{
                background: "#f8f9fa",
                padding: "12px 16px",
                borderRadius: 8,
                marginTop: 12,
                whiteSpace: "pre-wrap",
                border: "1px dashed #ccc",
              }}
            >
              <Text fw={600} mb={4}>
                Ghi chú:
              </Text>
              <Text size="sm">{recordDetail.notes || "Không có"}</Text>
            </div>

            {/* Thông số đo */}
            <div style={{ overflowX: "auto", marginTop: 8 }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 600,
                }}
              >
                <tbody>
                  <tr>
                    <td style={cellStyle}>
                      <b>Nhiệt độ:</b>
                    </td>
                    <td style={cellStyle}>{recordDetail.temperature} °C</td>
                    <td style={cellStyle}>
                      <b>Huyết áp:</b>
                    </td>
                    <td style={cellStyle}>{recordDetail.bloodPressure}</td>
                  </tr>
                  <tr>
                    <td style={cellStyle}>
                      <b>Nhịp tim:</b>
                    </td>
                    <td style={cellStyle}>{recordDetail.heartRate} bpm</td>
                    <td style={cellStyle}>
                      <b>Nhịp thở:</b>
                    </td>
                    <td style={cellStyle}>
                      {recordDetail.respiratoryRate} lần/phút
                    </td>
                  </tr>
                  <tr>
                    <td style={cellStyle}>
                      <b>SpO₂:</b>
                    </td>
                    <td style={cellStyle}>{recordDetail.spo2} %</td>
                    <td style={cellStyle}>
                      <b>Chỉ số BMI:</b>
                    </td>
                    <td style={cellStyle}>{recordDetail.bmi}</td>
                  </tr>
                  <tr>
                    <td style={cellStyle}>
                      <b>Chiều cao:</b>
                    </td>
                    <td style={cellStyle}>{recordDetail.heightCm} cm</td>
                    <td style={cellStyle}>
                      <b>Cân nặng:</b>
                    </td>
                    <td style={cellStyle}>{recordDetail.weightKg} kg</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Text mt="md" fw={600} c="blue">
              Danh sách dịch vụ và kết quả xét nghiệm
            </Text>

            {recordDetail.orders.length === 0 ? (
              <Text size="sm" c="dimmed" mt={4}>
                Không có kết quả xét nghiệm.
              </Text>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  marginTop: 8,
                }}
              >
                {recordDetail.orders.map((order) => (
                  <Paper key={order.id} withBorder p="sm" shadow="xs">
                    <Text fw={600} size="sm">
                      {order.serviceName} ({order.status})
                    </Text>
                    <Text size="sm" c="dimmed">
                      Người chỉ định: {order.createdBy}
                    </Text>
                    {order.results.map((result) => (
                      <div key={result.id} style={{ marginTop: 8 }}>
                        <Text size="sm">
                          Người thực hiện: {result.completedBy}
                        </Text>
                        <Text size="sm">
                          Ghi chú: {result.note || "Không có"}
                        </Text>
                        {result.imageUrls?.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 8,
                              marginTop: 8,
                            }}
                          >
                            {result.imageUrls.map(
                              (url: string, idx: number) => (
                                <img
                                  key={idx}
                                  src={url}
                                  alt={`Kết quả ${idx + 1}`}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: 6,
                                    cursor: "pointer",
                                  }}
                                  onClick={() => setPreviewImageUrl(url)}
                                />
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </Paper>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        opened={!!previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
        centered
        withCloseButton={false}
        size="auto"
        padding={0}
        overlayProps={{ blur: 2, backgroundOpacity: 0.6 }}
        styles={{
          body: {
            padding: 2,
            overflow: "visible",
            background: "transparent",
          },
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <button
            onClick={() => setPreviewImageUrl(null)}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(0,0,0,0.6)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              cursor: "pointer",
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            ×
          </button>

          <img
            src={previewImageUrl ?? ""}
            alt="Preview"
            style={{
              maxWidth: "90vw",
              maxHeight: "80vh",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default MedicalHistoryPanel;
