import React from "react";
import {
  Grid,
  Card,
  Text,
  Button,
  Title,
  Container,
  BackgroundImage,
  Center,
  ThemeIcon,
} from "@mantine/core";
import { IconClipboardList, IconDiamond, IconBox } from "@tabler/icons-react";

interface HomeProps {
  headerHeight: number;
}

const Home: React.FC<HomeProps> = ({ headerHeight }) => {
  return (
    <BackgroundImage
      src="/images/LandingPageUser/hero-bg.jpg"
      style={{ minHeight: `calc(100vh - ${headerHeight}px)` }}
    >
      <Container size="xl" py="xl">
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Header Section */}
          <div style={{ marginTop: "6rem" }}>
            <Title order={1}>MedSoft</Title>
            <Text size="xl" color="dimmed">
              Chăm sóc sức khỏe trọn đời cho bạn
            </Text>
          </div>

          {/* Grid Layout */}
          <Grid mt={24} align="stretch" gutter="md">
            <Grid.Col span={{ base: 12, md: 4 }} style={{ display: "flex" }}>
              <Card
                shadow="xl"
                padding="2rem"
                radius="md"
                withBorder
                style={{
                  backgroundColor: "#1c7ed6",
                  minHeight: "400px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <Title order={1} c="white" style={{ lineHeight: 1.3 }}>
                    Tại sao chọn MedSoft?
                  </Title>
                  <Text size="sm" c="white" style={{ lineHeight: 1.6 }}>
                    Bệnh viện Đa khoa Quốc tế MedSoft, bệnh viện tư nhân tại Hà
                    Nội nổi tiếng trong lĩnh vực chăm sóc sức khỏe toàn diện.
                    Với đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại
                    cùng dịch vụ y tế chất lượng cao, chúng tôi cam kết mang đến
                    trải nghiệm chăm sóc sức khỏe tận tâm, chu đáo và chuyên
                    nghiệp.
                  </Text>
                  <Button
                    color="blue.3"
                    variant="filled"
                    radius="xl"
                    size="sm"
                    style={{
                      alignSelf: "flex-start",
                      marginTop: "auto",
                      marginBottom: "12px",
                    }}
                  >
                    Tìm hiểu thêm →
                  </Button>
                </div>
              </Card>
            </Grid.Col>

            {/* Thẻ trắng 1 */}
            <Grid.Col
              span={{ base: 12, md: "auto" }}
              style={{ display: "flex", flex: 1 }}
            >
              <Card
                padding="xl"
                radius="md"
                withBorder
                shadow="md"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.65)",
                  flex: 1,
                  marginTop: "30px",
                  marginBottom: "30px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  gap: "12px",
                }}
              >
                <Center>
                  <ThemeIcon variant="light" size="xl" color="blue" radius="xl">
                    <IconClipboardList size={36} />
                  </ThemeIcon>
                </Center>
                <Title order={4} style={{ textAlign: "center" }}>
                  Vị trí trung tâm
                </Title>
                <Text size="sm" color="dimmed" style={{ textAlign: "center" }}>
                  Nằm tại 286–294 Thụy Khuê, Tây Hồ – ngay sát Hồ Tây
                </Text>
              </Card>
            </Grid.Col>

            {/* Thẻ trắng 2 */}
            <Grid.Col
              span={{ base: 12, md: "auto" }}
              style={{ display: "flex", flex: 1 }}
            >
              <Card
                padding="xl"
                radius="md"
                withBorder
                shadow="md"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.65)",
                  flex: 1,
                  marginTop: "30px",
                  marginBottom: "30px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  gap: "12px",
                }}
              >
                <Center>
                  <ThemeIcon variant="light" size="xl" color="blue" radius="xl">
                    <IconDiamond size={36} />
                  </ThemeIcon>
                </Center>
                <Title order={4} style={{ textAlign: "center" }}>
                  Cơ sở hiện đại
                </Title>
                <Text size="sm" color="dimmed" style={{ textAlign: "center" }}>
                  Bệnh viện đầu tư hạ tầng theo mô hình bệnh viện – khách sạn
                </Text>
              </Card>
            </Grid.Col>

            {/* Thẻ trắng 3 */}
            <Grid.Col
              span={{ base: 12, md: "auto" }}
              style={{ display: "flex", flex: 1 }}
            >
              <Card
                padding="xl"
                radius="md"
                withBorder
                shadow="md"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.65)",
                  flex: 1,
                  marginTop: "30px",
                  marginBottom: "30px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  gap: "12px",
                }}
              >
                <Center>
                  <ThemeIcon variant="light" size="xl" color="blue" radius="xl">
                    <IconBox size={36} />
                  </ThemeIcon>
                </Center>
                <Title order={4} style={{ textAlign: "center" }}>
                  Hỗ trợ 24/7
                </Title>
                <Text size="sm" color="dimmed" style={{ textAlign: "center" }}>
                  Bệnh viện hoạt động liên tục với dịch vụ cấp cứu sẵn sàng
                  24/24
                </Text>
              </Card>
            </Grid.Col>
          </Grid>
        </div>
      </Container>
    </BackgroundImage>
  );
};

export default Home;
