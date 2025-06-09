import { Button, Grid, Image, Text, Title } from "@mantine/core";
import HeroImage from "../../../public/images/AdminPage/hero.jpg";

const IntroSection = ({ onRegisterClick }: { onRegisterClick: () => void }) => (
  <Grid
    gutter={48}
    align="center"
    style={{
      maxWidth: 1200,
      width: "100%",
      marginBottom: 48,
    }}
  >
    <Grid.Col span={{ base: 12, md: 6 }} style={{ textAlign: "center" }}>
      <div
        style={{
          minHeight: 350,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Title
          order={1}
          style={{
            color: "#1f2937",
            fontWeight: 700,
            fontFamily: "'Be Vietnam Pro', 'Roboto', sans-serif",
            lineHeight: 1.3,
            fontSize: 48,
            marginBottom: 24,
          }}
        >
          Phần mềm quản lý bệnh viện Medsoft
        </Title>

        <Text
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#3b82f6",
            display: "block",
            marginBottom: 32,
            minHeight: 32,
          }}
        >
          Giải pháp toàn diện giúp bệnh viện vận hành hiệu quả và chuyên nghiệp
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "rgba(0, 0, 0, 0.7)",
            lineHeight: 1.6,
            maxWidth: 600,
            marginBottom: 24,
          }}
        >
          Medsoft giúp quản lý hồ sơ bệnh nhân khoa học, kiểm soát lịch khám tự
          động, giảm thiểu sai sót ghi chép thủ công và tối ưu quy trình khám
          chữa bệnh. Hệ thống linh hoạt, dễ sử dụng, phù hợp với mọi quy mô bệnh
          viện.
        </Text>

        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <Button size="sm" onClick={onRegisterClick}>
            Đăng ký dùng thử
          </Button>
        </div>
      </div>
    </Grid.Col>

    <Grid.Col span={{ base: 12, md: 6 }} style={{ textAlign: "center" }}>
      <Image
        src={HeroImage}
        alt="Phần mềm quản lý bệnh viện Medsoft"
        radius="md"
        style={{
          border: "4px solid white",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          borderRadius: 8,
          objectFit: "cover",
          margin: "0 auto",
        }}
      />
    </Grid.Col>
  </Grid>
);

export default IntroSection;
