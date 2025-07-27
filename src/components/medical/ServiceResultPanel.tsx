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
import { toast } from "react-toastify";
import dayjs from "dayjs";
import updateMedicalResult from "../../hooks/medicalRecord/updateMedicalResult";

interface MedicalRecordResult {
  id: string;
  completedBy: string;
  imageUrls: string[];
  note: string;
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
    conclusion: string;
    suggestion: string;
    images: string[];
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
  const [conclusion, setConclusion] = useState("Bình thường");
  const [suggestion, setSuggestion] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialResult) {
      setDescription(initialResult.note || "");
      setConclusion("Bình thường");
      setSuggestion("");
      setImagePreviews(initialResult.imageUrls || []);
      setActiveImage(initialResult.imageUrls?.[0] || null);
    }
  }, [initialResult]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => {
      const newList = prev.filter((_, i) => i !== index);
      if (prev[index] === activeImage) {
        setActiveImage(newList.length > 0 ? newList[newList.length - 1] : null);
      }
      return newList;
    });

    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => URL.createObjectURL(file));

    setImagePreviews((prev) => {
      const newList = [...prev, ...urls];
      setActiveImage(newList[newList.length - 1]);
      return newList;
    });

    setUploadedFiles((prev) => [...prev, ...files]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
        await updateMedicalResult(
          initialResult?.id ?? "",
          uploadedFiles,
          imagePreviews.filter((url) => !url.startsWith("blob:")),
          technicalId,
          conclusion
        );
        toast.success("Đã sửa kết quả và upload file thành công.");
      } else {
        await uploadMedicalResult(
          medicalOrderId,
          uploadedFiles,
          technicalId,
          conclusion
        );
        toast.success("Đã lưu kết quả và upload file thành công.");
      }

      onSubmit({
        resultText: description.trim(),
        selectedStaffId: technicalId,
        performedAt: date,
        conclusion: conclusion.trim(),
        suggestion: suggestion.trim(),
        images: imagePreviews,
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
            label="Kết luận"
            value={conclusion}
            onChange={(e) => setConclusion(e.currentTarget.value)}
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
            {imagePreviews.map((src, index) => (
              <div
                key={index}
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
