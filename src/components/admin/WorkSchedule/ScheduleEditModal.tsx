import {
  Modal,
  Button,
  Select,
  TextInput,
  Group as MantineGroup,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useScheduleApi } from "../../../hooks/workSchedule/useScheduleApi";

interface Props {
  opened: boolean;
  onClose: () => void;
  staffId: string;
  shiftDate: string;
  mode: "add" | "edit";
  defaultData?: {
    id: string;
    shiftId: string;
    note: string;
  };
  shiftOptions: { value: string; label: string }[];
  onSubmit: () => void;
  onDelete?: () => void;
}

export const ScheduleEditModal = ({
  opened,
  onClose,
  staffId,
  shiftDate,
  mode,
  defaultData,
  shiftOptions,
  onSubmit,
  onDelete,
}: Props) => {
  const form = useForm({
    initialValues: {
      shiftId: "",
      note: "",
    },
  });

  const [saving, setSaving] = useState(false);
  const { updateSchedule, deleteSchedule } = useScheduleApi();

  useEffect(() => {
    if (opened) {
      if (mode === "edit" && defaultData) {
        form.setValues({
          shiftId: defaultData.shiftId,
          note: defaultData.note,
        });
      } else {
        form.reset();
      }
    }
  }, [opened, defaultData, mode]);

  const handleSubmit = async (values: { shiftId: string; note: string }) => {
    try {
      setSaving(true);
      const payload = {
        idsToDelete: mode === "edit" && defaultData?.id ? [defaultData.id] : [],
        newSchedules: [
          {
            shiftId: values.shiftId,
            shiftDate,
            note: values.note,
            status: "SCHEDULED",
          },
        ],
      };

      await updateSchedule(staffId, payload);
      onSubmit();
      onClose();
    } catch (err) {
      // Đã có xử lý toast bên trong useScheduleApi
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!defaultData?.id) return;
    try {
      setSaving(true);
      await deleteSchedule(staffId, defaultData.id);
      onDelete?.();
      onClose();
    } catch (err) {
      // Đã có xử lý toast bên trong useScheduleApi
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`${mode === "add" ? "Thêm" : "Sửa"} ca làm ngày ${dayjs(
        shiftDate
      ).format("DD/MM/YYYY")}`}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Select
          label="Ca trực"
          data={shiftOptions}
          placeholder="Chọn ca"
          {...form.getInputProps("shiftId")}
        />

        <TextInput
          label="Ghi chú"
          placeholder="Ghi chú nếu có"
          mt="md"
          {...form.getInputProps("note")}
        />

        <MantineGroup justify="space-between" mt="lg">
          {mode === "edit" && defaultData?.id && (
            <Button color="red" onClick={handleDelete} loading={saving}>
              Xoá ca
            </Button>
          )}
          <Button type="submit" loading={saving}>
            Lưu
          </Button>
        </MantineGroup>
      </form>
    </Modal>
  );
};

export default ScheduleEditModal;
