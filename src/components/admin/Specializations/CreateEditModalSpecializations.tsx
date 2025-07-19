import { useEffect } from "react";
import { Modal, TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  CreateSpecializationRequest,
  Specialization,
} from "../../../types/Admin/Specializations/Specializations";

interface Props {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSpecializationRequest) => Promise<boolean>;
  onSuccess?: () => void;
  initialData?: Specialization | null;
  isViewMode?: boolean;
}

export const CreateEditModalSpecializations = ({
  opened,
  onClose,
  onSubmit,
  onSuccess,
  initialData,
  isViewMode = false,
}: Props) => {
  const form = useForm<CreateSpecializationRequest>({
    initialValues: {
      name: "",
      description: "",
    },
    validate: {
      name: (value) =>
        !value || value.trim().length < 3
          ? "Tên chuyên ngành ít nhất 3 ký tự"
          : null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        name: initialData.name || "",
        description: initialData.description || "",
      });
    } else {
      form.reset();
    }
  }, [initialData]);

  const handleSubmit = async (values: CreateSpecializationRequest) => {
    const success = await onSubmit(values);
    if (success) {
      form.reset(); // ✅ Reset form sau khi submit thành công
      onSuccess?.(); // gọi callback nếu cần
      onClose(); // đóng modal
    }
  };

  const getTitle = () => {
    if (isViewMode) return "Xem chuyên ngành";
    if (initialData) return "Cập nhật chuyên ngành";
    return "Tạo chuyên ngành";
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div>
          <h2 className="text-xl font-bold">{getTitle()}</h2>
          <div className="mt-2 border-b border-gray-300" />
        </div>
      }
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Tên chuyên ngành"
          placeholder="Nhập tên chuyên ngành"
          {...form.getInputProps("name")}
          required
          disabled={isViewMode}
        />
        <TextInput
          label="Mô tả"
          placeholder="Nhập mô tả"
          {...form.getInputProps("description")}
          mt="sm"
          disabled={isViewMode}
        />
        {!isViewMode && (
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button type="submit">{initialData ? "Cập nhật" : "Tạo"}</Button>
          </div>
        )}
      </form>
    </Modal>
  );
};
