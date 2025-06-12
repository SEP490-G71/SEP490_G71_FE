import { useState } from "react";
import { Grid, Card, Text, List, ThemeIcon, Title } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

const solutions = [
  "Quản lý lịch hẹn, nhắc lịch tự động",
  "Lưu trữ hồ sơ bệnh án offline hoặc online",
  "Tính năng báo cáo doanh thu, chi phí",
  "Phân quyền cho bác sĩ, nhân viên",
  "Tối ưu quy trình khám bệnh",
];

const solutionDetails: Record<string, string[]> = {
  "Quản lý lịch hẹn, nhắc lịch tự động": [
    "Quản lý toàn bộ lịch hẹn của bệnh nhân theo từng bác sĩ, phòng khám.",
    "Gửi thông báo nhắc lịch tự động qua SMS, email.",
    "Giảm tỷ lệ bệnh nhân quên/lỡ lịch khám.",
    "Tối ưu hóa thời gian làm việc cho bác sĩ và phòng khám.",
  ],
  "Lưu trữ hồ sơ bệnh án offline hoặc online": [
    "Lưu trữ hồ sơ bệnh án số hóa, an toàn, dễ dàng tra cứu.",
    "Cho phép lưu trữ song song offline và trên cloud (phòng trường hợp mất kết nối).",
    "Hỗ trợ tìm kiếm nhanh theo tên, mã bệnh nhân, ngày khám, bác sĩ điều trị.",
    "Đáp ứng tiêu chuẩn bảo mật thông tin y tế.",
  ],
  "Tính năng báo cáo doanh thu, chi phí": [
    "Theo dõi doanh thu theo ngày, tháng, quý, năm.",
    "Quản lý chi phí vận hành, phân loại các loại chi phí.",
    "Tự động tổng hợp báo cáo lãi/lỗ, so sánh với kế hoạch.",
    "Hỗ trợ ban lãnh đạo ra quyết định tài chính kịp thời.",
  ],
  "Phân quyền cho bác sĩ, nhân viên": [
    "Phân quyền chi tiết theo vai trò: quản trị, bác sĩ, điều dưỡng, lễ tân,...",
    "Giới hạn quyền xem, sửa, xóa dữ liệu theo từng nhóm người dùng.",
    "Đảm bảo an toàn và bảo mật nội bộ.",
  ],
  "Tối ưu quy trình khám bệnh": [
    "Tự động hóa các bước trong quy trình khám.",
    "Giảm thời gian chờ đợi cho bệnh nhân.",
    "Đồng bộ luồng thông tin giữa các bộ phận (lễ tân, phòng khám, thu ngân).",
    "Nâng cao trải nghiệm dịch vụ khám chữa bệnh.",
  ],
};

const HoverMenuSolutions = () => {
  const defaultIndex = solutions.findIndex(
    (item) => item === "Quản lý lịch hẹn, nhắc lịch tự động"
  );

  const [activeIndex, setActiveIndex] = useState<number>(defaultIndex);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <>
      <Title
        mb="xl"
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: "2.25rem",
          lineHeight: 1.2,
          color: "#1f2937",
          letterSpacing: "0.05em",
        }}
      >
        Giải pháp toàn diện giúp vận hành cho bệnh viện
      </Title>
      <Card
        shadow="sm"
        radius="md"
        padding="lg"
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        <Grid gutter={32}>
          {/* Left menu */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            {solutions.map((item, index) => (
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
                      ? "#228be6" // Active đỏ đậm
                      : hoverIndex === index
                      ? "#228be6" // Hover đỏ đậm
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
                      ? "#fff" // Text trắng khi active hoặc hover
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
              <Title order={4} mb="md" style={{ color: "#3b82f6" }}>
                {solutions[activeIndex]}
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
                    {solutionDetails[solutions[activeIndex]].map(
                      (detail, idx) => (
                        <List.Item key={idx}>{detail}</List.Item>
                      )
                    )}
                  </List>

                  {/* <Button
                    mt="md"
                    color="blue"
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

export default HoverMenuSolutions;
