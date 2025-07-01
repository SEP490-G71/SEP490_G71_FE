import { Group, Button, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { MedicalRecordOrder } from "../../types/MedicalRecord/MedicalRecordDetail";

interface Props {
  selectedOrder: MedicalRecordOrder | null;
  onSelectInfo: () => void;
  onViewResult: () => void;
  onCloseOrder?: () => void;
  isResultMode: boolean;
}

const HeaderBar = ({
  selectedOrder,
  onSelectInfo,
  onViewResult,
  onCloseOrder,
  isResultMode,
}: Props) => {
  return (
    <Group mt="sm" gap="xs">
      <Button
        variant="light"
        size="md"
        radius={4}
        color={!isResultMode ? "blue" : "gray"}
        onClick={onSelectInfo}
      >
        <Text size="sm" fw={600} c={!isResultMode ? "blue" : "black"}>
          Thông tin khám
        </Text>
      </Button>

      {selectedOrder && (
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
                e.stopPropagation();
                onCloseOrder?.();
              }}
              style={{ cursor: "pointer" }}
            />
          }
        >
          <Text size="sm" fw={600} c={isResultMode ? "blue" : "black"}>
            {selectedOrder.serviceName}
          </Text>
        </Button>
      )}
    </Group>
  );
};

export default HeaderBar;
