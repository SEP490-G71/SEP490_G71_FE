import { Button, Modal, Text, Title } from "@mantine/core";

const RegisterModal = ({
  visible,
  onOk,
  onCancel,
}: {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}) => (
  <Modal
    opened={visible}
    onClose={onCancel}
    title={
      <Title
        order={5} // order 5 ~ font-size 18-20px
        style={{
          fontWeight: 700,
          paddingBottom: 8,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        Đăng ký dùng thử Medsoft
      </Title>
    }
    centered
  >
    <Text mb="md">Vui lòng nhập thông tin của bạn để đăng ký dùng thử.</Text>

    {/* Có thể thêm form đăng ký tại đây */}

    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
      <Button variant="default" onClick={onCancel}>
        Hủy
      </Button>
      <Button onClick={onOk}>Gửi đăng ký</Button>
    </div>
  </Modal>
);

export default RegisterModal;
