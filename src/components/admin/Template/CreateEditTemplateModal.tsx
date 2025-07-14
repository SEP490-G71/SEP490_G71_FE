import {
  Modal,
  TextInput,
  Textarea,
  Switch,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

interface TemplateModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  initialData?: FormValues | null;
}

export interface FormValues {
  name: string;
  //description: string;
  isDefault: boolean;
  file: File | null;
}

const CreateEditTemplateModal = ({
  opened,
  onClose,
  onSubmit,
  initialData,
}: TemplateModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    initialValues: {
      name: "",
      //description: "",
      isDefault: false,
      file: null,
    },
  });

  // Khi initialData hoặc modal mở, cập nhật lại form
  useEffect(() => {
    if (initialData) {
      form.setValues({
        name: initialData.name,
        // description: initialData.description,
        isDefault: initialData.isDefault,
        file: null,
      });
      setSelectedFile(null);
    } else {
      form.reset();
      setSelectedFile(null);
    }
  }, [initialData, opened]);

  const handleSubmit = (values: FormValues) => {
    if (!values.file && !initialData) {
      alert("Vui lòng chọn file");
      return;
    }

    onSubmit(values);
    form.reset();
    setSelectedFile(null);
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        form.reset();
        setSelectedFile(null);
        onClose();
      }}
      title={initialData ? "Chỉnh sửa template" : "Tạo mẫu template mới"}
      size="lg"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">
        <TextInput
          label="Tên"
          placeholder="Nhập tên template"
          required
          {...form.getInputProps("name")}
          styles={{
            input: {
              borderWidth: 1.5,
              borderColor: "#666",
            },
          }}
        />

        <Textarea
          label="Mô tả"
          placeholder="Nhập mô tả"
          minRows={3}
          autosize
          {...form.getInputProps("description")}
          styles={{
            input: {
              borderWidth: 1.5,
              borderColor: "#666",
            },
          }}
        />

        <div>
          <label className="block mb-1 font-medium text-sm">Chọn file</label>
          <div className="border border-dashed border-black rounded-md text-center p-6 text-gray-600">
            <p>Kéo thả file ở đây</p>
            <p className="my-2">Hoặc</p>
            <label className="inline-block">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setSelectedFile(file);
                  form.setFieldValue("file", file);
                }}
              />
              <Button className="bg-green-800 hover:bg-green-900 text-white font-semibold px-4 py-2 rounded shadow">
                Chọn File
              </Button>
            </label>
            {(selectedFile || initialData?.file) && (
              <p className="text-sm text-gray-700 mt-2">
                📄 {selectedFile?.name || "Đã có file đính kèm"}
              </p>
            )}
          </div>
        </div>

        <Switch
          label="Mặc định"
          {...form.getInputProps("isDefault", { type: "checkbox" })}
        />

        <Group justify="right" mt="md">
          <Button variant="default" onClick={onClose} color="gray">
            Hủy
          </Button>
          <Button type="submit" color="red">
            {initialData ? "Cập nhật" : "Lưu"}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default CreateEditTemplateModal;
