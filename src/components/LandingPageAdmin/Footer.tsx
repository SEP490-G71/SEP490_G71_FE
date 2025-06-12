import {
  Box,
  Container,
  Grid,
  Group,
  Text,
  Title,
  Stack,
  Divider,
} from "@mantine/core";
import {
  IconHome,
  IconMail,
  IconPhone,
  IconPrinter,
  IconDiamond,
} from "@tabler/icons-react";
import Logo from "../../../public/images/logo/home.svg";

export const Footer = () => {
  return (
    <Box pt="md" pb="md" mt="xl" style={{ backgroundColor: "white" }}>
      <Container mt="md">
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, sm: 6, md: 6 }}>
            <Stack gap="sm">
              <img
                src={Logo}
                alt="MedSoft Logo"
                style={{ width: 150, height: "auto" }}
              />
              <Text size="sm" color="dimmed">
                MedSoft cung cấp nền tảng web tối ưu hỗ trợ đặt lịch trực tuyến,
                quản lý hồ sơ bệnh án điện tử, theo dõi điều trị và thanh toán.
              </Text>
            </Stack>
          </Grid.Col>

          <Grid.Col
            span={{ base: 12, sm: 6, md: 6 }}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Stack gap="sm" style={{ width: "fit-content", textAlign: "left" }}>
              {" "}
              <Title order={6}>Liên hệ</Title>
              <Group gap="xs">
                <IconHome size={24} />
                <Text size="sm">New York, NY 10012, US</Text>
              </Group>
              <Group gap="xs">
                <IconMail size={24} />
                <Text size="sm">medsoft@gmail.com</Text>
              </Group>
              <Group gap="xs">
                <IconPhone size={24} />
                <Text size="sm">+ 01 234 567 88</Text>
              </Group>
              <Group gap="xs">
                <IconPrinter size={24} />
                <Text size="sm">+ 01 234 567 89</Text>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>

      <Divider my="md" />
      <Box py="xs" style={{ textAlign: "center", backgroundColor: "white" }}>
        <Text size="sm" fw={700}>
          © 2025 Copyright MedSoft | Đã đăng ký bản quyền{" "}
        </Text>
      </Box>
    </Box>
  );
};
