import {
  Modal,
  ScrollArea,
  Badge,
  Button,
  TextInput,
  Select,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { WorkScheduleDetail } from "../../../types/Admin/WorkSchedule/WorkSchedule";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";

interface WorkScheduleListModalProps {
  opened: boolean;
  onClose: () => void;
  schedules?: WorkScheduleDetail[];
  staffName?: string;
  onReloadDetail?: () => void;
  onReloadList?: () => void;
  startDate?: string;
  endDate?: string;
}

const shiftMap: Record<string, string> = {
  MORNING: "Ca sáng",
  AFTERNOON: "Ca chiều",
  NIGHT: "Ca tối",
  FULL_DAY: "Cả ngày",
};

const statusLabel = (status: string): string => {
  switch (status) {
    case "SCHEDULED":
      return "Đã lên lịch";
    case "ATTENDED":
      return "Đã làm";
    case "ABSENT":
      return "Vắng";
    case "ON_LEAVE":
      return "Nghỉ phép";
    default:
      return status;
  }
};

const statusColor = (status: string): string => {
  switch (status) {
    case "SCHEDULED":
      return "blue";
    case "ATTENDED":
      return "green";
    case "ABSENT":
      return "red";
    case "ON_LEAVE":
      return "yellow";
    default:
      return "gray";
  }
};

const WorkScheduleListModal = ({
  opened,
  onClose,
  schedules = [],
  staffName,
  onReloadDetail,
  onReloadList,
}: WorkScheduleListModalProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteEdit, setNoteEdit] = useState<string>("");
  const [shiftEdit, setShiftEdit] = useState<string>("MORNING");
  const [shiftDateEditMap, setShiftDateEditMap] = useState<
    Record<string, Date | null>
  >({});

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (schedules && schedules.length > 0) {
      const initialMap: Record<string, Date | null> = {};
      schedules.forEach((s) => {
        initialMap[s.id] = new Date(s.shiftDate); // tạo bản sao để chỉnh sửa không ảnh hưởng gốc
      });
      setShiftDateEditMap(initialMap);
    }
  }, [schedules]);

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/work-schedule/${id}`);
      toast.success("Xoá ca làm việc thành công");
      onReloadDetail?.();
    } catch (error) {
      console.error("Failed to delete work schedule detail", error);
      toast.error("Xoá ca làm việc thất bại");
    }
  };

  const handleEdit = (schedule: WorkScheduleDetail) => {
    setEditingId(schedule.id);
    setNoteEdit(schedule.note || "");
    setShiftEdit(schedule.shift);
    setShiftDateEditMap((prev) => ({
      ...prev,
      [schedule.id]: new Date(schedule.shiftDate),
    }));
  };

  const handleSave = async (schedule: WorkScheduleDetail) => {
    const shiftDate = shiftDateEditMap[schedule.id];
    if (!shiftDate) {
      toast.error("Vui lòng chọn ngày");
      return;
    }

    try {
      await axiosInstance.put(`/work-schedule/update-detail/${schedule.id}`, {
        shiftDate: format(shiftDate, "yyyy-MM-dd"),
        shift: shiftEdit,
        note: noteEdit,
      });

      toast.success("Cập nhật ca làm việc thành công");
      setEditingId(null);
      onReloadDetail?.();
      onReloadList?.();
    } catch (error) {
      console.error("Failed to update work schedule detail", error);
      toast.error("Cập nhật ca làm việc thất bại");
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={
          <div>
            <div className="text-xl font-semibold">
              Tất cả lịch của {staffName}
            </div>
            <div className="mt-2 border-b border-gray-300"></div>
          </div>
        }
        size="xl"
        centered
        padding="lg"
        styles={{
          content: { maxHeight: "80vh", overflow: "hidden" },
        }}
      >
        <ScrollArea className="h-[60vh] pr-2">
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="rounded-xl border border-gray-200 shadow-sm px-4 py-3 bg-white hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium text-gray-900">
                    {format(new Date(schedule.shiftDate), "EEEE, dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </p>

                  <Badge
                    color={statusColor(schedule.status)}
                    variant="light"
                    size="sm"
                  >
                    {statusLabel(schedule.status)}
                  </Badge>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  {editingId === schedule.id ? (
                    <>
                      <div className="flex gap-2">
                        <DatePickerInput
                          label="Ngày"
                          locale="vi"
                          value={shiftDateEditMap[schedule.id] || null}
                          onChange={(value) =>
                            setShiftDateEditMap((prev) => ({
                              ...prev,
                              [schedule.id]: value ? new Date(value) : null,
                            }))
                          }
                          valueFormat="DD/MM/YYYY"
                          className="w-1/3"
                          minDate={new Date()}
                        />

                        <Select
                          label="Ca trực"
                          value={shiftEdit}
                          onChange={(v) => setShiftEdit(v || "MORNING")}
                          data={[
                            { value: "MORNING", label: "Ca sáng" },
                            { value: "AFTERNOON", label: "Ca chiều" },
                            { value: "NIGHT", label: "Ca tối" },
                            { value: "FULL_DAY", label: "Cả ngày" },
                          ]}
                          className="w-1/3"
                        />

                        <TextInput
                          placeholder="Ghi chú"
                          label="Ghi chú"
                          value={noteEdit}
                          onChange={(e) => setNoteEdit(e.currentTarget.value)}
                          className="w-1/3"
                        />
                      </div>

                      <div className="flex gap-2 mt-2">
                        <Button size="xs" onClick={() => handleSave(schedule)}>
                          Lưu
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          color="gray"
                          onClick={() => setEditingId(null)}
                        >
                          Hủy
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>
                        <span className="font-medium">Ca trực:</span>{" "}
                        {shiftMap[schedule.shift] || schedule.shift}
                      </p>
                      <p>
                        <span className="font-medium">Ghi chú:</span>{" "}
                        {schedule.note || "—"}
                      </p>
                      <div className="flex gap-3 mt-2">
                        <Button
                          color="blue"
                          onClick={() => handleEdit(schedule)}
                        >
                          Sửa
                        </Button>
                        <Button
                          color="red"
                          onClick={() => setConfirmDeleteId(schedule.id)}
                        >
                          Xoá
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Modal>

      <Modal
        opened={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Xác nhận xoá ca làm việc"
        centered
        size="sm"
      >
        <p>Bạn có chắc chắn muốn xoá ca làm việc này không?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
            Hủy
          </Button>
          <Button
            color="red"
            onClick={() => {
              if (confirmDeleteId) {
                handleDelete(confirmDeleteId);
                setConfirmDeleteId(null);
              }
            }}
          >
            Xoá
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default WorkScheduleListModal;
