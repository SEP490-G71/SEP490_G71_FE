import { Modal, TextInput, Switch, Button, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useRef, useState } from "react";
import { IconX } from "@tabler/icons-react";

export interface FormValues {
  name: string;
  isDefault: boolean;
  file: File | null;
}

interface TemplateModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  initialData?: FormValues | null;
}

const CreateEditTemplateModal = ({
  opened,
  onClose,
  onSubmit,
  initialData,
}: TemplateModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<FormValues>({
    initialValues: { name: "", isDefault: false, file: null },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({ ...initialData, file: initialData.file ?? null });
      setSelectedFile(null);
    } else {
      form.reset();
      setSelectedFile(null);
    }
  }, [initialData, opened]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setSelectedFile(file);
      form.setFieldValue("file", file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      form.setFieldValue("file", file);
    } else {
      alert("Vui lòng chỉ chọn file PDF");
    }
  };

  const handleSubmit = (values: FormValues) => {
    const actualFile = selectedFile || values.file;
    if (!actualFile) return alert("Vui lòng chọn file");

    form.setFieldValue("file", actualFile);
    onSubmit({ ...values, file: actualFile });
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      title={initialData ? "Chỉnh sửa template" : "Tạo mẫu template mới"}
      size="lg"
      centered
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
    >
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">
        <TextInput
          label="Tên"
          placeholder="Nhập tên template"
          required
          {...form.getInputProps("name")}
        />

        <div>
          <label className="block mb-1 font-medium text-sm">Chọn file</label>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => (e.preventDefault(), setIsDragging(true))}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-md text-center p-6 transition ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-black"
            }`}
          >
            <p>Kéo thả file PDF vào đây</p>
            <p className="my-2">Hoặc</p>
            <Button onClick={() => fileInputRef.current?.click()}>
              Chọn File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            {(selectedFile || form.values.file) && (
              <div className="flex justify-center gap-2 mt-3 text-sm">
                📄 {selectedFile?.name || "Đã có file đính kèm"}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    form.setFieldValue("file", null);
                  }}
                >
                  <IconX size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <Switch
          label="Mặc định"
          description="Chỉ có thể có 1 mẫu mặc định"
          {...form.getInputProps("isDefault", { type: "checkbox" })}
        />

        <Group justify="right">
          <Button variant="default" onClick={onClose}>
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
