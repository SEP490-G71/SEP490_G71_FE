import { Modal, TextInput, Button, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  CreateDivideShiftRequest,
  DivideShift,
} from "../../../types/Admin/DivideShift/DivideShift";
import { useEffect } from "react";

interface Props {
  opened: boolean;
  onClose: () => void;
  initialData?: DivideShift | null;
  onSubmit: (formData: CreateDivideShiftRequest) => void;
  isViewMode?: boolean;
}

const hourOptions = Array.from({ length: 24 }, (_, i) => {
  const hourStr = i.toString().padStart(2, "0");
  return {
    value: `${hourStr}:00`,
    label: `${hourStr}:00`,
  };
});

export const CreateEditModalDivideShift = ({
  opened,
  onClose,
  initialData,
  onSubmit,
  isViewMode = false,
}: Props) => {
  const form = useForm<CreateDivideShiftRequest>({
    initialValues: {
      name: "",
      description: "",
      startTime: "",
      endTime: "",
    },
    validate: {
      name: (v) =>
        !v
          ? "Tên ca là bắt buộc"
          : v.length < 3
          ? "Tên ca phải ít nhất 3 ký tự"
          : null,
      startTime: (v) => (!v ? "Bắt đầu là bắt buộc" : null),
      endTime: (v) => (!v ? "Kết thúc là bắt buộc" : null),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        name: initialData.name,
        description: initialData.description,
        startTime: initialData.startTime?.substring(0, 5),
        endTime: initialData.endTime?.substring(0, 5),
      });
    } else {
      form.reset();
    }
  }, [initialData, opened]);

  const handleSubmit = (values: CreateDivideShiftRequest) => {
    onSubmit(values);
  };

  const getTitle = () => {
    if (isViewMode) return "Xem ca làm";
    if (initialData) return "Chỉnh sửa ca làm";
    return "Tạo ca làm";
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      centered
      title={
        <div>
          <h2 className="text-xl font-bold">{getTitle()}</h2>
          <div className="mt-2 border-b border-gray-300" />
        </div>
      }
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Tên ca"
          placeholder="Nhập tên ca"
          withAsterisk
          {...form.getInputProps("name")}
          disabled={isViewMode}
        />

        <TextInput
          label="Ghi chú"
          placeholder="Ghi chú"
          mt="sm"
          {...form.getInputProps("description")}
          disabled={isViewMode}
        />

        <Select
          label="Bắt đầu"
          placeholder="Chọn giờ bắt đầu"
          withAsterisk
          data={hourOptions}
          {...form.getInputProps("startTime")}
          mt="sm"
          disabled={isViewMode}
        />

        <Select
          label="Kết thúc"
          placeholder="Chọn giờ kết thúc"
          withAsterisk
          data={hourOptions}
          {...form.getInputProps("endTime")}
          mt="sm"
          disabled={isViewMode}
        />

        {!isViewMode && (
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Huỷ
            </Button>
            <Button type="submit">Lưu</Button>
          </div>
        )}
      </form>
    </Modal>
  );
};
