import { Modal, TextInput, Select, Button, MultiSelect } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { WorkSchedule } from "../../../types/Admin/WorkSchedule/WorkSchedule";
import axiosInstance from "../../../services/axiosInstance";
import { DatePickerInput } from "@mantine/dates";

interface StaffOption {
  value: string;
  label: string;
}

interface WorkScheduleFormModalProps {
  opened: boolean;
  onClose: () => void;
  initialData?: WorkSchedule | null;
  onSubmit: (data: {
    staffId: string;
    shift: string;
    daysOfWeek: string[];
    startDate: string;
    endDate: string;
    note?: string;
  }) => void;
  isViewMode?: boolean;
}

const dayOptions = [
  { value: "MONDAY", label: "Thứ 2" },
  { value: "TUESDAY", label: "Thứ 3" },
  { value: "WEDNESDAY", label: "Thứ 4" },
  { value: "THURSDAY", label: "Thứ 5" },
  { value: "FRIDAY", label: "Thứ 6" },
  { value: "SATURDAY", label: "Thứ 7" },
  { value: "SUNDAY", label: "Chủ nhật" },
];

const shiftOptions = [
  { value: "MORNING", label: "Ca sáng" },
  { value: "AFTERNOON", label: "Ca chiều" },
  { value: "NIGHT", label: "Ca tối" },
  { value: "FULL_DAY", label: "Cả ngày" },
];

const WorkScheduleFormModal = ({
  opened,
  onClose,
  initialData,
  onSubmit,
  isViewMode = false,
}: WorkScheduleFormModalProps) => {
  const form = useForm<{
    staffId: string;
    shift: string;
    daysOfWeek: string[];
    startDate: string;
    endDate: string;
    note?: string;
  }>({
    initialValues: {
      staffId: "",
      shift: "MORNING",
      daysOfWeek: [],
      startDate: "",
      endDate: "",
      note: "",
    },
    validate: {
      staffId: (value) => (!value ? "Thiếu mã nhân viên" : null),
      shift: (value) => (!value ? "Ca trực là bắt buộc" : null),
      daysOfWeek: (value) =>
        value.length === 0 ? "Phải chọn ít nhất một ngày" : null,
      startDate: (value) => (!value ? "Từ ngày là bắt buộc" : null),
      endDate: (value) => (!value ? "Đến ngày là bắt buộc" : null),
    },
  });

  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);

  useEffect(() => {
    if (!initialData) {
      axiosInstance.get("/staffs/all").then((res) => {
        const staffs = res.data.result || [];
        const options = staffs.map((staff: any) => ({
          value: staff.id,
          label: `${staff.fullName} (${staff.staffCode})`,
        }));
        setStaffOptions(options);
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      form.setValues({
        staffId: initialData.staffId,
        shift: initialData.shifts?.[0] || "MORNING",
        daysOfWeek: initialData.daysOfWeek || [],
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        note: initialData.note || "",
      });
    } else {
      form.reset();
    }
  }, [initialData, opened]);

  const handleSubmit = (values: typeof form.values) => {
    onSubmit(values);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div>
          <h2 className="text-xl font-bold">
            {initialData ? "Cập nhật lịch làm việc" : "Tạo lịch làm việc"}
          </h2>
          <div className="mt-2 border-b border-gray-300"></div>
        </div>
      }
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Select
          label="Nhân viên"
          placeholder="Chọn nhân viên"
          data={staffOptions}
          {...form.getInputProps("staffId")}
          required
          disabled={isViewMode || !!initialData} // Không cho sửa khi đang edit
        />

        <Select
          label="Ca trực"
          placeholder="Chọn ca trực"
          data={shiftOptions}
          {...form.getInputProps("shift")}
          required
          disabled={isViewMode}
          mt="sm"
        />

        <MultiSelect
          label="Ngày trong tuần"
          placeholder="Chọn ngày làm việc"
          data={dayOptions}
          {...form.getInputProps("daysOfWeek")}
          required
          disabled={isViewMode}
          mt="sm"
        />

        <DatePickerInput
          label="Từ ngày"
          placeholder="Chọn ngày bắt đầu"
          value={form.values.startDate}
          onChange={(value) => form.setFieldValue("startDate", value ?? "")}
          required
          disabled={isViewMode}
          locale="vi"
          valueFormat="DD/MM/YYYY"
          mt="sm"
          minDate={new Date()}
        />

        <DatePickerInput
          label="Đến ngày"
          placeholder="Chọn ngày kết thúc"
          value={form.values.endDate}
          onChange={(value) => form.setFieldValue("endDate", value ?? "")}
          required
          disabled={isViewMode}
          locale="vi"
          valueFormat="DD/MM/YYYY"
          mt="sm"
          minDate={
            form.values.startDate ? new Date(form.values.startDate) : new Date()
          }
        />

        <TextInput
          label="Ghi chú"
          placeholder="Ghi chú thêm (không bắt buộc)"
          {...form.getInputProps("note")}
          disabled={isViewMode}
          mt="sm"
        />

        {!isViewMode && (
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button type="submit">
              {initialData ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default WorkScheduleFormModal;
