import { Modal, Textarea, Button } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { LeaveRequestResponse } from "../../types/Admin/Leave/LeaveRequestResponse";
import {
  validateMinDaysFromToday,
  validateFromDateToDate,
} from "../utils/validation";

export interface CreateEditLeaveFormValues {
  reason: string;
  fromDate: Date | null;
  toDate: Date | null;
}

interface CreateEditLeaveModalProps {
  opened: boolean;
  onClose: () => void;
  initialData?: LeaveRequestResponse | null;
  onSubmit: (data: CreateEditLeaveFormValues) => Promise<boolean>;
  canEdit?: boolean;
  shifts: { id: string; name: string }[];
}

const CreateEditLeaveModal: React.FC<CreateEditLeaveModalProps> = ({
  opened,
  onClose,
  initialData,
  onSubmit,
  canEdit = true,
}) => {
  const form = useForm<CreateEditLeaveFormValues>({
    initialValues: {
      reason: "",
      fromDate: null,
      toDate: null,
    },
    validate: {
      reason: (val) =>
        val.trim().length === 0 ? "Lý do không được để trống" : null,
      fromDate: (val) => validateMinDaysFromToday(val, 2),
      toDate: (val, values) => validateFromDateToDate(values.fromDate, val),
    },
  });

  useEffect(() => {
    if (initialData) {
      const details = initialData.details ?? [];

      const sorted = [...details].sort(
        (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()
      );
      const from = sorted[0]?.date;
      const to = sorted[sorted.length - 1]?.date;

      form.setValues({
        reason: initialData.reason,
        fromDate: from ? dayjs(from).toDate() : null,
        toDate: to ? dayjs(to).toDate() : null,
      });
    } else {
      form.reset();
    }
  }, [initialData, opened]);

  const handleSubmit = async () => {
    const { hasErrors } = form.validate();

    if (!hasErrors) {
      // 👉 In ra dữ liệu form đã validate
      console.log("✅ Form values ready to submit:", form.values);

      try {
        const success = await onSubmit(form.values);

        // 👉 In kết quả sau khi gọi onSubmit
        console.log("✅ Submit result:", success);

        if (success) {
          onClose();
        }
      } catch (err) {
        // 👉 Log bất kỳ lỗi nào xảy ra trong quá trình submit
        console.error("❌ Error during handleSubmit:", err);
      }
    } else {
      console.warn("⚠️ Form validation failed", form.errors);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={initialData ? "Chi tiết đơn nghỉ phép" : "Tạo đơn nghỉ phép"}
      size="md"
      radius="md"
      yOffset={90}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Textarea
          label="Lý do nghỉ"
          placeholder="Nhập lý do nghỉ"
          {...form.getInputProps("reason")}
          required
          disabled={!canEdit}
        />

        <DatePickerInput
          label="Từ ngày"
          placeholder="Chọn ngày bắt đầu"
          valueFormat="YYYY-MM-DD"
          {...form.getInputProps("fromDate")}
          required
          mt="sm"
          disabled={!canEdit}
        />

        <DatePickerInput
          label="Đến ngày"
          placeholder="Chọn ngày kết thúc"
          valueFormat="YYYY-MM-DD"
          {...form.getInputProps("toDate")}
          required
          mt="sm"
          disabled={!canEdit}
        />
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>
            {canEdit ? "Huỷ" : "Đóng"}
          </Button>
          {canEdit && (
            <Button type="submit" color="blue">
              {initialData ? "Cập nhật" : "Tạo mới"}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default CreateEditLeaveModal;
