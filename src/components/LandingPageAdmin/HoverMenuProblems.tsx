import { useState } from "react";
import { Grid, Card, Text, List, ThemeIcon, Title } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

const problems = [
  "Quản lý hồ sơ bệnh nhân lộn xộn",
  "Không kiểm soát được lịch khám",
  "Ghi chép thủ công dễ sai sót",
  "Quy trình khám thủ công",
];

const problemDetails: Record<string, string[]> = {
  "Quản lý hồ sơ bệnh nhân lộn xộn": [
    "Hồ sơ bệnh án lưu trữ rời rạc.",
    "Dễ thất lạc, mất thời gian tìm kiếm.",
    "Thiếu đồng bộ giữa các bộ phận.",
  ],
  "Không kiểm soát được lịch khám": [
    "Lịch khám chưa được số hóa hiệu quả.",
    "Dễ trùng lịch khám.",
    "Bệnh nhân chờ đợi lâu, khó điều phối.",
  ],
  "Ghi chép thủ công dễ sai sót": [
    "Ghi chép tay dễ xảy ra lỗi,",
    "khó đọc hồ sơ bệnh án.",
    "Gây rủi ro trong chẩn đoán và điều trị",
  ],
  "Quy trình khám thủ công": [
    "Nhiều bước (đăng ký, thanh toán, lấy kết quả) vẫn thủ công.",
    "Tốn thời gian và nguồn lực lớn.",
    "Khó đáp ứng nhu cầu khám chữa bệnh ngày càng cao và nâng cao chất lượng dịch vụ.",
  ],
};

const HoverMenuProblems = () => {
  const defaultIndex = problems.findIndex(
    (item) => item === "Quản lý hồ sơ bệnh nhân lộn xộn"
  );

  const [activeIndex, setActiveIndex] = useState<number>(defaultIndex);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <>
      <Title
        mb="lg"
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: "2.25rem",
          lineHeight: 1.2,
          color: "#1f2937",
          letterSpacing: "0.05em",
        }}
      >
        Bất cập trong quá trình vận hành của bệnh viện hiện nay
      </Title>
      <Card
        shadow="sm"
        radius="md"
        padding="lg"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          backgroundColor: "transparent",
        }}
      >
        <Grid gutter={32}>
          {/* Left menu */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            {problems.map((item, index) => (
              <Card
                key={index}
                shadow={activeIndex === index ? "md" : "xs"}
                radius="md"
                padding="md"
                mb="sm"
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    activeIndex === index
                      ? "#f04438"
                      : hoverIndex === index
                      ? "#f04438"
                      : index % 0 === 0
                      ? "#fff5f5"
                      : "#fff",
                  transition: "all 0.3s ease",
                }}
              >
                <Text
                  fw={600}
                  color={
                    activeIndex === index || hoverIndex === index
                      ? "#fff"
                      : "#1f2937"
                  }
                >
                  {item}
                </Text>
              </Card>
            ))}
          </Grid.Col>

          {/* Right content */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Card shadow="md" radius="md" padding="lg">
              <Title order={4} mb="md" style={{ color: "red" }}>
                {problems[activeIndex]}
              </Title>

              <Grid gutter={16}>
                <Grid.Col span={7}>
                  <List
                    spacing="sm"
                    icon={
                      <ThemeIcon
                        color="teal"
                        variant="light"
                        radius="xl"
                        size={24}
                      >
                        <IconCheck size={16} />
                      </ThemeIcon>
                    }
                  >
                    {problemDetails[problems[activeIndex]].map(
                      (detail, idx) => (
                        <List.Item key={idx}>{detail}</List.Item>
                      )
                    )}
                  </List>

                  {/* <Button
                    mt="md"
                    color="red"
                    radius="md"
                    size="sm"
                    style={{
                      alignSelf: "flex-start",
                    }}
                  >
                    Đăng kí ngay
                  </Button> */}
                </Grid.Col>

                <Grid.Col span={5}>
                  <img
                    src="/public/images/Hospital.png"
                    alt="Ảnh minh họa"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                    }}
                  />
                </Grid.Col>
              </Grid>
            </Card>
          </Grid.Col>
        </Grid>
      </Card>
    </>
  );
};

export default HoverMenuProblems;
