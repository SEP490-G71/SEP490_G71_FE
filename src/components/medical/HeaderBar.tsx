import { Group, Button, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

interface Props {
  selectedService: { name: string; code: string } | null;
  onSelectInfo: () => void;
  onViewResult: () => void;
  onCloseService?: () => void;
  isResultMode: boolean;
}

const HeaderBar = ({
  selectedService,
  onSelectInfo,
  onViewResult,
  onCloseService,
  isResultMode,
}: Props) => {
  return (
    <Group mt="sm" gap="xs">
      {/* Nút: Thông tin khám */}
      <Button
        variant="light"
        size="md"
        radius={4}
        color={isResultMode ? "gray" : "blue"}
        onClick={onSelectInfo}
      >
        <Text size="sm" fw={600} c={isResultMode ? "black" : "blue"}>
          Thông tin khám
        </Text>
      </Button>

      {/* Nút: DV mã + Xem kết quả + Đóng */}
      {selectedService && (
        <Button
          variant="light"
          size="md"
          radius={4}
          color={isResultMode ? "blue" : "gray"}
          onClick={onViewResult}
          rightSection={
            <IconX
              size={16}
              onClick={(e) => {
                e.stopPropagation(); // tránh lan sự kiện
                onCloseService?.();
              }}
              style={{ cursor: "pointer" }}
            />
          }
        >
          <Text size="sm" fw={600} c={isResultMode ? "blue" : "black"}>
            {selectedService.code}
          </Text>
        </Button>
      )}
    </Group>
  );
};

export default HeaderBar;
