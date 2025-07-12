import { Modal, Textarea, Button, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { Shift, ShiftLabels } from "../../enums/Admin/Shift";
import { LeaveRequestResponse } from "../../types/Admin/Leave/LeaveRequestResponse";
import {
  validateMinDaysFromToday,
  validateFromDateToDate,
} from "../utils/validation";

export interface CreateEditLeaveFormValues {
  reason: string;
  fromDate: Date | null;
  toDate: Date | null;
  shift: Shift;
}

interface CreateEditLeaveModalProps {
  opened: boolean;
  onClose: () => void;
  initialData?: LeaveRequestResponse | null;
  onSubmit: (data: CreateEditLeaveFormValues) => Promise<boolean>;
  canEdit?: boolean;
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
      shift: Shift.MORNING,
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
      const from = details[0]?.date;
      const to =
        details.length > 0 ? details[details.length - 1].date : undefined;

      form.setValues({
        reason: initialData.reason,
        fromDate: from ? dayjs(from).toDate() : null,
        toDate: to ? dayjs(to).toDate() : null,
        shift: details[0]?.shift ?? Shift.MORNING,
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

        <Select
          label="Ca làm việc"
          data={Object.entries(ShiftLabels).map(([value, label]) => ({
            value,
            label,
          }))}
          {...form.getInputProps("shift")}
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
