import { Container, Group, Text, Anchor } from "@mantine/core";
import { Link } from "react-router";

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "white",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
        margin: "1rem",
      }}
    >
      <Container
        size="xl"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1rem 0 1rem",
        }}
      >
        <Text size="sm" c="dimmed">
          © 2025{" "}
          <Anchor component={Link} to="/sale" underline="hover">
            MedSoft
          </Anchor>
          . All Rights Reserved.
        </Text>

        <Group gap="lg" mt={{ base: "md", md: 0 }}>
          <Anchor href="#" underline="hover" size="sm" c="dimmed">
            About
          </Anchor>
          <Anchor href="#" underline="hover" size="sm" c="dimmed">
            Privacy Policy
          </Anchor>
          <Anchor href="#" underline="hover" size="sm" c="dimmed">
            Licensing
          </Anchor>
          <Anchor href="#" underline="hover" size="sm" c="dimmed">
            Contact
          </Anchor>
        </Group>
      </Container>
    </footer>
  );
};
