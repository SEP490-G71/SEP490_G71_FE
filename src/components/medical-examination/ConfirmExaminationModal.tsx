import {
  Modal,
  Button,
  Text,
  TextInput,
  NumberInput,
  Group,
  ScrollArea,
  Divider,
} from "@mantine/core";
import { useState } from "react";
import { MedicalService } from "../../types/Admin/MedicalService/MedicalService";

interface ServiceRow {
  id: number;
  serviceId: string | null;
  quantity: number;
}

interface Props {
  opened: boolean;
  onClose: () => void;
  onConfirm: (updatedForm: any, updatedServices: ServiceRow[]) => void;
  formValues: any;
  serviceRows: ServiceRow[];
  serviceOptions: MedicalService[];
}

const ConfirmExaminationModal = ({
  opened,
  onClose,
  onConfirm,
  formValues,
  serviceRows,
  serviceOptions,
}: Props) => {
  const [editableValues, setEditableValues] = useState(formValues);
  const [editableServices] = useState(serviceRows);

  const handleChange = (field: string, value: any) => {
    setEditableValues((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Xác nhận thông tin khám bệnh"
      size="lg"
    >
      <ScrollArea h={400}>
        <Text fw={600}>Chỉ số sinh tồn:</Text>
        <NumberInput
          label="Nhiệt độ (°C)"
          value={editableValues.temperature}
          onChange={(val) => handleChange("temperature", val)}
          min={35}
          max={42}
        />
        <NumberInput
          label="Nhịp thở"
          value={editableValues.respiratoryRate}
          onChange={(val) => handleChange("respiratoryRate", val)}
        />
        <TextInput
          label="Huyết áp"
          value={editableValues.bloodPressure}
          onChange={(e) => handleChange("bloodPressure", e.target.value)}
        />
        <NumberInput
          label="Mạch"
          value={editableValues.heartRate}
          onChange={(val) => handleChange("heartRate", val)}
        />
        <NumberInput
          label="Chiều cao (cm)"
          value={editableValues.heightCm}
          onChange={(val) => handleChange("heightCm", val)}
        />
        <NumberInput
          label="Cân nặng (kg)"
          value={editableValues.weightKg}
          onChange={(val) => handleChange("weightKg", val)}
        />
        <NumberInput
          label="BMI"
          value={editableValues.bmi}
          onChange={(val) => handleChange("bmi", val)}
        />
        <NumberInput
          label="SpO2"
          value={editableValues.spo2}
          onChange={(val) => handleChange("spo2", val)}
        />

        <Divider my="sm" />

        <Text fw={600}>Dịch vụ đã kê:</Text>
        {editableServices.map((row, index) => {
          const service = serviceOptions.find((s) => s.id === row.serviceId);
          return (
            <Text key={index}>
              {service?.name || "Không rõ"} - SL: {row.quantity}
            </Text>
          );
        })}
      </ScrollArea>

      <Group justify="flex-end" mt="md">
        <Button variant="outline" color="gray" onClick={onClose}>
          Hủy
        </Button>
        <Button onClick={() => onConfirm(editableValues, editableServices)}>
          Lưu kết quả
        </Button>
      </Group>
    </Modal>
  );
};

export default ConfirmExaminationModal;
