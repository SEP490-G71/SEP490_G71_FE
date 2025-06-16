import { Button, Grid, Image, Text, Title } from "@mantine/core";
import HeroImage from "../../../public/images/AdminPage/hero.jpg";
const IntroSection = ({ onRegisterClick }: { onRegisterClick: () => void }) => (
  <div className="min-h-screen flex items-center ">
    <Grid
      gutter={48}
      style={{
        width: "100%",
        maxWidth: 1440,
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <Grid.Col span={{ base: 12, md: 6 }} style={{ textAlign: "left" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Title
            order={1}
            style={{
              color: "#1f2937",
              fontWeight: 700,
              fontFamily: "'Be Vietnam Pro', 'Roboto', sans-serif",
              lineHeight: 1.3,
              fontSize: "2.8rem",
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
              marginBottom: 24,
            }}
          >
            Giải pháp toàn diện giúp bệnh viện vận hành hiệu quả và chuyên
            nghiệp
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "rgba(0, 0, 0, 0.7)",
              lineHeight: 1.6,
              marginBottom: 24,
              maxWidth: 525,
            }}
          >
            Medsoft giúp quản lý hồ sơ bệnh nhân khoa học, kiểm soát lịch khám
            tự động, giảm thiểu sai sót ghi chép thủ công và tối ưu quy trình
            khám chữa bệnh. Hệ thống linh hoạt, dễ sử dụng, phù hợp với mọi quy
            mô bệnh viện.
          </Text>

          <Button size="md" onClick={onRegisterClick}>
            Đăng ký dùng thử
          </Button>
        </div>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <Image
          src={HeroImage}
          alt="Phần mềm quản lý bệnh viện Medsoft"
          radius="md"
          style={{
            maxWidth: "100%",
            maxHeight: "80vh",
            objectFit: "cover",
            margin: "0 auto",
            border: "4px solid white",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          }}
        />
      </Grid.Col>
    </Grid>
  </div>
);

export default IntroSection;
