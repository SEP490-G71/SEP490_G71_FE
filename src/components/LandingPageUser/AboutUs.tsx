import {
  Grid,
  Title,
  Text,
  Container,
  ThemeIcon,
  Group,
  Image,
  Box,
} from "@mantine/core";
import { IconCheck, IconStethoscope, IconHeartPlus } from "@tabler/icons-react";

const AboutUs = () => {
  return (
    <section style={{ padding: "6rem 0" }}>
      <Container size="xl">
        <Grid gutter={40} align="center">
          {/* Left: Image */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Box style={{ width: "100%", height: "100%" }}>
              <Image
                src="/public/images/LandingPageUser/about.jpg"
                alt="Dịch vụ khám đa khoa Medilab"
                radius="md"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          </Grid.Col>

          {/* Right: Text content */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Box style={{ height: "100%" }}>
              <Title order={1} mb="lg">
                Khám Đa Khoa Toàn Diện Tại Medilab
              </Title>
              <Text color="dimmed" mb="xl" style={{ fontSize: "1.15rem" }}>
                MediSoft mang đến dịch vụ khám đa khoa chất lượng cao, đáp ứng
                nhu cầu chăm sóc sức khỏe toàn diện cho cá nhân và gia đình. Với
                đội ngũ bác sĩ chuyên môn sâu và hệ thống thiết bị hiện đại,
                chúng tôi luôn đặt sự an tâm và hài lòng của khách hàng lên hàng
                đầu.
              </Text>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "36px",
                }}
              >
                {/* Feature 1 */}
                <Group align="center" wrap="nowrap" gap="lg">
                  <ThemeIcon variant="light" radius="xl" size="xl" color="blue">
                    <IconStethoscope size={32} />
                  </ThemeIcon>
                  <div>
                    <Text fw={700} style={{ fontSize: "1.05rem" }}>
                      Khám sức khỏe tổng quát định kỳ
                    </Text>
                    <Text color="dimmed" style={{ fontSize: "0.95rem" }}>
                      Giúp phát hiện sớm các bệnh lý tiềm ẩn thông qua xét
                      nghiệm, siêu âm và tư vấn chuyên sâu từ bác sĩ.
                    </Text>
                  </div>
                </Group>

                {/* Feature 2 */}
                <Group align="center" wrap="nowrap" gap="lg">
                  <ThemeIcon variant="light" radius="xl" size="xl" color="blue">
                    <IconHeartPlus size={32} />
                  </ThemeIcon>
                  <div>
                    <Text fw={700} style={{ fontSize: "1.05rem" }}>
                      Đầy đủ các chuyên khoa nội, ngoại, sản, nhi
                    </Text>
                    <Text color="dimmed" style={{ fontSize: "0.95rem" }}>
                      Tư vấn và điều trị hiệu quả bởi các bác sĩ đầu ngành cho
                      mọi lứa tuổi và nhu cầu.
                    </Text>
                  </div>
                </Group>

                {/* Feature 3 */}
                <Group align="center" wrap="nowrap" gap="lg">
                  <ThemeIcon variant="light" radius="xl" size="xl" color="blue">
                    <IconCheck size={32} />
                  </ThemeIcon>
                  <div>
                    <Text fw={700} style={{ fontSize: "1.05rem" }}>
                      Trang thiết bị hiện đại – chẩn đoán chính xác
                    </Text>
                    <Text color="dimmed" style={{ fontSize: "0.95rem" }}>
                      Ứng dụng công nghệ tiên tiến trong xét nghiệm và chẩn đoán
                      hình ảnh giúp quá trình khám chữa bệnh hiệu quả và nhanh
                      chóng.
                    </Text>
                  </div>
                </Group>
              </div>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </section>
  );
};

export default AboutUs;
