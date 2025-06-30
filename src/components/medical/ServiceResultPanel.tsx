import {
  Textarea,
  TextInput,
  Button,
  Group,
  Text,
  Paper,
  Grid,
  Select,
  Title,
  Image,
  Loader,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import useDepartmentStaffs from "../../hooks/department-Staffs/useDepartmentStaffs";

interface Props {
  serviceName: string;
  departmentId: string | null;
  onSubmit: (result: {
    resultText: string;
    selectedStaffId: string | null;
    performedAt: Date;
    conclusion: string;
    suggestion: string;
    images: string[];
  }) => void;
  onCancel: () => void;
}

const ServiceResultPanel = ({
  serviceName,
  departmentId,
  onSubmit,
  onCancel,
}: Props) => {
  const [doctor, setDoctor] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(new Date());
  const [description, setDescription] = useState("");
  const [conclusion, setConclusion] = useState("Bình thường");
  const [suggestion, setSuggestion] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: staffList, loading: loadingStaffs } = useDepartmentStaffs(
    departmentId ?? undefined
  );
  const uniqueStaffList = staffList.filter(
    (staff, index, self) =>
      index === self.findIndex((s) => s.staffId === staff.staffId)
  );

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...urls]);
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!description.trim()) {
      alert("Vui lòng nhập mô tả kết quả.");
      return;
    }

    if (!date) {
      alert("Ngày thực hiện không hợp lệ.");
      return;
    }

    onSubmit({
      resultText: description.trim(),
      selectedStaffId: doctor,
      performedAt: date,
      conclusion: conclusion.trim(),
      suggestion: suggestion.trim(),
      images: imagePreviews,
    });
  };

  return (
    <Paper withBorder shadow="xs" p="md" mt="md">
      <Grid mb="xs" align="center">
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
            <Button variant="light" size="xs">
              In
            </Button>
            <Button size="xs" color="blue" onClick={handleSave}>
              Lưu
            </Button>
          </Group>
        </Grid.Col>
      </Grid>

      <Grid>
        {/* Cột trái */}
        <Grid.Col span={7}>
          <Grid>
            <Grid.Col span={6}>
              <Select
                label="* Bác sĩ thực hiện"
                placeholder="Chọn bác sĩ"
                data={
                  uniqueStaffList.map((staff) => ({
                    label: staff.staffName,
                    value: staff.id,
                  })) ?? []
                }
                value={doctor}
                onChange={setDoctor}
                searchable
                disabled={loadingStaffs}
                rightSection={loadingStaffs ? <Loader size="xs" /> : null}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DateTimePicker
                label="Ngày thực hiện"
                value={date}
                onChange={(value) => {
                  setDate(value ? new Date(value) : null);
                }}
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

          <TextInput
            label="Đề nghị"
            value={suggestion}
            onChange={(e) => setSuggestion(e.currentTarget.value)}
            mt="sm"
          />
        </Grid.Col>

        {/* Cột phải: ảnh */}
        <Grid.Col span={5}>
          <Text fw={500} mb="xs">
            Hình ảnh
          </Text>

          <Group gap="sm" mb="sm" wrap="wrap">
            {imagePreviews.length === 0 && (
              <Text c="dimmed" size="xs">
                Chưa có ảnh nào được tải lên
              </Text>
            )}

            {imagePreviews.map((src, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  width: 200, // 👈 tăng kích thước ảnh
                  height: 150,
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "1px solid #ddd",
                }}
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
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    padding: 4,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: 4,
                  }}
                >
                  <FaTrash size={12} />
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
          <Button variant="light" size="xs" onClick={handleUploadClick}>
            ⬆️ Tải ảnh lên
          </Button>
        </Grid.Col>
      </Grid>

      {/* Nút hủy */}
      <Group mt="md" justify="flex-end">
        <Button variant="default" onClick={onCancel}>
          Hủy
        </Button>
      </Group>
    </Paper>
  );
};

export default ServiceResultPanel;
