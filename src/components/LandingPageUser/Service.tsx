import {
  Container,
  Grid,
  Title,
  Text,
  ThemeIcon,
  Card,
  Box,
} from "@mantine/core";
import {
  IconHeartbeat,
  IconPill,
  IconClipboardText,
  IconTestPipe,
  IconWheelchair,
} from "@tabler/icons-react";
import { useMantineTheme } from "@mantine/core";

const services = [
  {
    icon: IconHeartbeat,
    title: "Khám & Chẩn đoán",
    description:
      "Cung cấp dịch vụ khám bệnh tổng quát và chuyên sâu, ứng dụng công nghệ chẩn đoán hình ảnh và xét nghiệm tiên tiến để đưa ra kết luận chính xác về tình trạng sức khỏe của bệnh nhân.",
  },
  {
    icon: IconPill,
    title: "Dược phẩm & Điều trị",
    description:
      "Cung cấp đa dạng các loại thuốc men chất lượng cao và phác đồ điều trị cá nhân hóa, đảm bảo an toàn và hiệu quả tối ưu cho quá trình phục hồi của bệnh nhân.",
  },
  {
    icon: IconClipboardText,
    title: "Hồ sơ bệnh án điện tử",
    description:
      "Quản lý hồ sơ bệnh án một cách khoa học và bảo mật trên hệ thống điện tử, giúp việc tra cứu thông tin nhanh chóng và thuận tiện cho bác sĩ và bệnh nhân.",
  },
  {
    icon: IconTestPipe,
    title: "Xét nghiệm Y tế",
    description:
      "Thực hiện các xét nghiệm từ cơ bản đến chuyên sâu (máu, nước tiểu, sinh hóa, di truyền...) với trang thiết bị hiện đại, hỗ trợ đắc lực cho việc chẩn đoán và theo dõi bệnh.",
  },
  {
    icon: IconWheelchair,
    title: "Hồi phục chức năng",
    description:
      "Chương trình vật lý trị liệu và phục hồi chức năng toàn diện cho bệnh nhân sau phẫu thuật, tai nạn hoặc mắc các bệnh mãn tính, giúp họ sớm lấy lại khả năng vận động và chất lượng cuộc sống.",
  },
  {
    icon: IconHeartbeat,
    title: "Phẫu thuật & Can thiệp",
    description:
      "Đội ngũ bác sĩ phẫu thuật hàng đầu, ứng dụng kỹ thuật mổ nội soi, vi phẫu và các phương pháp can thiệp hiện đại, đảm bảo an toàn và hiệu quả cao nhất trong mọi ca bệnh.",
  },
];

const Services = () => {
  const theme = useMantineTheme();

  return (
    <section style={{ padding: "4rem 0", backgroundColor: "#f8f9fa" }}>
      <Container size="lg">
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            marginBottom: "2rem",
          }}
        >
          <Title order={2}>Dịch vụ</Title>
          <Text color="dimmed" ta="center" maw={500}>
            Sự kết hợp hoàn hảo giữa dịch vụ y tế chất lượng cao và tiện nghi
            cao cấp
          </Text>
        </Box>

        <Grid gutter="xl">
          {services.map((service, index) => (
            <Grid.Col
              key={index}
              span={{ base: 12, sm: 6, md: 4 }}
              style={{ display: "flex" }}
            >
              <Card
                shadow="md"
                padding="xl"
                radius="md"
                withBorder
                style={{
                  height: "100%",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  backgroundColor: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.backgroundColor = theme.colors.blue[0];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0, 0, 0, 0.05)";
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                <ThemeIcon variant="light" size={50} radius="xl" color="blue">
                  <service.icon size={30} />
                </ThemeIcon>
                <Box mt={16}>
                  <Text fw={700}>{service.title}</Text>
                  <Text color="dimmed" size="sm" mt={8}>
                    {service.description}
                  </Text>
                </Box>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </section>
  );
};

export default Services;
