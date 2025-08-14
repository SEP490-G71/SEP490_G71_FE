import {
  Textarea,
  TextInput,
  Button,
  Group,
  Text,
  Paper,
  Grid,
  Title,
  Image,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import uploadMedicalResult from "../../hooks/medicalRecord/uploadMedicalResult";
import updateMedicalResult from "../../hooks/medicalRecord/updateMedicalResult";
import { toast } from "react-toastify";
import dayjs from "dayjs";

type ExistingImage = { id: string; url: string };

interface MedicalRecordResult {
  id: string;
  completedBy: string;
  images: ExistingImage[];
  note: string;
  description: string | null;
}

interface Props {
  medicalOrderId: string;
  serviceName: string;
  technicalName: string;
  technicalId: string;
  onSubmit: (result: {
    resultText: string;
    selectedStaffId: string | null;
    performedAt: Date;
    suggestion: string;
    images: string[];
    note: string;
  }) => void;
  onCancel: () => void;
  initialResult?: MedicalRecordResult;
}

const ServiceResultPanel = ({
  medicalOrderId,
  serviceName,
  technicalName,
  technicalId,
  onSubmit,
  onCancel,
  initialResult,
}: Props) => {
  const [date] = useState<Date | null>(new Date());
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [suggestion] = useState("");

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [deleteImageIds, setDeleteImageIds] = useState<string[]>([]);

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allPreviewUrls = [...existingImages.map((x) => x.url), ...newPreviews];

  useEffect(() => {
    if (initialResult) {
      setDescription(initialResult.description || "");
      setNote(initialResult.note || "");
      setExistingImages(initialResult.images || []);
      const firstUrl = initialResult.images?.[0]?.url ?? null;
      setActiveImage(firstUrl);
      setNewFiles([]);
      setNewPreviews([]);
      setDeleteImageIds([]);
    }
  }, [initialResult]);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const urls = files.map((file) => URL.createObjectURL(file));

    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...urls]);

    setActiveImage(urls[urls.length - 1]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const existingCount = existingImages.length;

    if (index < existingCount) {
      const img = existingImages[index];
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      setDeleteImageIds((prev) =>
        img?.id ? Array.from(new Set([...prev, img.id])) : prev
      );
    } else {
      const newIndex = index - existingCount;
      setNewFiles((prev) => prev.filter((_, i) => i !== newIndex));
      setNewPreviews((prev) => prev.filter((_, i) => i !== newIndex));
    }

    const next = allPreviewUrls.filter((_, i) => i !== index);
    setActiveImage(next.length > 0 ? next[next.length - 1] : null);
  };

  const handleSave = async () => {
    if (!description.trim()) {
      toast.warning("Vui lòng nhập mô tả kết quả.");
      return;
    }
    if (!date) {
      toast.warning("Ngày thực hiện không hợp lệ.");
      return;
    }

    try {
      if (initialResult) {
        await updateMedicalResult({
          resultId: initialResult.id,
          newFiles,
          deleteImageIds,
          staffId: technicalId,
          description,
          note,
        });

        toast.success("Đã sửa kết quả và upload file thành công.");
      } else {
        await uploadMedicalResult(
          medicalOrderId,
          newFiles,
          technicalId,
          description,
          note
        );
        toast.success("Đã lưu kết quả và upload file thành công.");
      }

      onSubmit({
        resultText: description.trim(),
        selectedStaffId: technicalId,
        performedAt: date,
        suggestion: suggestion.trim(),
        images: [...existingImages.map((x) => x.url), ...newPreviews],
        note: note.trim(),
      });
    } catch (error: any) {
      const code = error?.response?.data?.code;
      const message = error?.response?.data?.message;

      if (code === 2001) {
        toast.warning("Kết quả đã được hoàn thành. Không thể lưu lại.");
      } else {
        console.error("❌ Upload lỗi:", error);
        toast.error(message || "Không thể lưu/sửa kết quả hoặc upload file.");
      }
    }
  };

  return (
    <Paper withBorder shadow="xs" p="md" mt="md">
      <Grid mb="xs" align="start">
        <Grid.Col span={9}>
          <Title order={5}>
            Dịch vụ:{" "}
            <Text span c="red">
              {serviceName}
            </Text>
          </Title>
        </Grid.Col>
        <Grid.Col span={3}>
          <Group justify="flex-end" gap="xs">
            <Button size="md" color="blue" onClick={handleSave}>
              {initialResult ? "Sửa kết quả" : "Lưu kết quả"}
            </Button>
          </Group>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={7}>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="* Chuyên viên thực hiện"
                value={technicalName}
                readOnly
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Ngày thực hiện"
                value={dayjs(date).format("DD/MM/YYYY HH:mm")}
                readOnly
              />
            </Grid.Col>
          </Grid>

          <Textarea
            label="Mô tả"
            placeholder="Nhập mô tả kết quả..."
            minRows={10}
            autosize
            style={{ minHeight: 240 }}
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            mt="sm"
          />

          <TextInput
            label="Ghi chú"
            value={note}
            onChange={(e) => setNote(e.currentTarget.value)}
            mt="sm"
          />
        </Grid.Col>

        <Grid.Col span={5}>
          <Text fw={500} mb={0} size="md">
            Hình ảnh
          </Text>

          {activeImage ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4 / 3",
                overflow: "hidden",
                border: "1px solid #ddd",
                marginBottom: 16,
              }}
            >
              <Image
                src={activeImage}
                alt="Ảnh chính"
                width="100%"
                height="100%"
                fit="cover"
              />
            </div>
          ) : (
            <Text c="red" size="md" mb="sm">
              Chưa có ảnh nào được tải lên
            </Text>
          )}

          <Group gap="sm" mb="sm" wrap="wrap">
            {allPreviewUrls.map((src, index) => (
              <div
                key={src + index}
                style={{
                  position: "relative",
                  width: 65,
                  height: 50,
                  borderRadius: 6,
                  overflow: "hidden",
                  border:
                    src === activeImage ? "2px solid blue" : "1px solid #ccc",
                  cursor: "pointer",
                }}
                onClick={() => setActiveImage(src)}
              >
                <Image
                  src={src}
                  alt={`preview-${index}`}
                  width="100%"
                  height="100%"
                  fit="cover"
                />
                <Button
                  size="xs"
                  color="red"
                  variant="subtle"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    border: "none",
                    backgroundColor: "transparent",
                    padding: 0,
                    transform: "translate(-5%, -30%)",
                  }}
                >
                  <FaTrash size={10} />
                </Button>
              </div>
            ))}
          </Group>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          <Button
            variant="light"
            size="md"
            onClick={handleUploadClick}
            fullWidth
          >
            ⬆️ Tải ảnh lên
          </Button>
        </Grid.Col>
      </Grid>

      <Group mt="md" justify="flex-end">
        <Button variant="default" onClick={onCancel}>
          Hủy
        </Button>
      </Group>
    </Paper>
  );
};

export default ServiceResultPanel;
