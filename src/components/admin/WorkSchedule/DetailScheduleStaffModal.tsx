import { Modal, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useWorkSchedule } from "../../../hooks/workSchedule/useWorkSchedule";
import { WorkScheduleDetail } from "../../../types/Admin/WorkSchedule/WorkSchedule";
import ScheduleEditModal from "./ScheduleEditModal"; // Adjust path if needed
import { useShifts } from "../../../hooks/workSchedule/useShifts";
import viLocale from "@fullcalendar/core/locales/vi";

interface Props {
  opened: boolean;
  onClose: () => void;
  staffId: string;
  staffName?: string;
}

export const DetailScheduleStaffModal = ({
  opened,
  onClose,
  staffId,
  staffName,
}: Props) => {
  const { fetchWorkScheduleDetailByStaffId } = useWorkSchedule();
  const { shifts: shiftOptions } = useShifts();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [rawSchedules, setRawSchedules] = useState<WorkScheduleDetail[]>([]);

  const [modalOpened, setModalOpened] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [editData, setEditData] = useState<
    | {
        id: string;
        shiftId: string;
        note: string;
      }
    | undefined
  >();

  const loadSchedules = async () => {
    setLoading(true);
    const res = await fetchWorkScheduleDetailByStaffId(staffId);
    setRawSchedules(res);
    const formatTime = (time: string) => time?.slice(0, 5);

    const getColorByShiftName = (name: string) => {
      switch (name) {
        case "Ca sáng":
          return {
            backgroundColor: "#FFF9DB",
            textColor: "#8D6B00",
          };
        case "Ca chiều":
          return {
            backgroundColor: "#D9F6D0",
            textColor: "#2F9E44",
          };
        case "Ca tối":
          return {
            backgroundColor: "#E7D9FE",
            textColor: "#6741D9",
          };
        default:
          return {
            backgroundColor: "#FFE59E",
            textColor: "#8D6B00",
          };
      }
    };

    const calendarEvents = res
      .filter((item) => item.shift?.name)
      .map((item, index) => {
        const formattedStart = formatTime(item.shift!.startTime);
        const formattedEnd = formatTime(item.shift!.endTime);
        const shiftName = item.shift!.name;
        const { backgroundColor, textColor } = getColorByShiftName(shiftName);

        return {
          id: `${item.shiftDate}-${index}`,
          title: `${shiftName} (${formattedStart} - ${formattedEnd})`,
          start: item.shiftDate,
          allDay: true,
          backgroundColor,
          textColor,
        };
      });

    setEvents(calendarEvents);
    setLoading(false);
  };

  useEffect(() => {
    if (opened && staffId) {
      loadSchedules();
    }
  }, [opened, staffId]);

  const handleDateClick = (arg: { dateStr: string }) => {
    setSelectedDate(arg.dateStr);
    setEditData(undefined);
    setModalMode("add");
    setModalOpened(true);
  };

  const handleEventClick = (arg: { event: any }) => {
    const date = arg.event.startStr;
    const fullTitle = arg.event.title;
    const match = fullTitle.match(/^(.*?) \(\d{2}:\d{2} - \d{2}:\d{2}\)$/);
    const shiftName = match?.[1]; // Lấy phần "Ca chiều", "Ca sáng",...

    const selectedSchedule = rawSchedules.find(
      (s) => s.shiftDate === date && s.shift?.name === shiftName
    );

    if (selectedSchedule) {
      setSelectedDate(date);
      setEditData({
        id: selectedSchedule.id,
        shiftId: selectedSchedule.shift.id,
        note: selectedSchedule.note || "",
      });
      setModalMode("edit");
      setModalOpened(true);
    }
  };

  return (
    <>
      <style>{`
  .fc .fc-button {
    background-color: #228be6 !important;
    border-color: #228be6 !important;
    color: white !important;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 6px;
  }
  .fc .fc-button:hover {
    background-color: #1c7ed6 !important;
    border-color: #1c7ed6 !important;
  }
  .fc .fc-button:focus {
    box-shadow: 0 0 0 0.2rem rgba(34, 139, 230, 0.5) !important;
  }
  .fc .fc-button-primary:disabled {
    background-color: #a5d8ff !important;
    border-color: #a5d8ff !important;
    color: #f8f9fa !important;
  }

  /* ✅ Tuỳ chỉnh tiêu đề */
  .fc .fc-toolbar-title {
    text-transform: uppercase;
    font-size: 20px !important; /* tương đương text-xl */
    font-weight: 700 !important; /* tương đương font-bold */
    text-align: center;
    width: 100%;
  }

  /* Optional: căn giữa title container nếu cần */
  .fc-toolbar-chunk:nth-child(2) {
    flex: 1;
    justify-content: center;
    display: flex;
  }
`}</style>

      <Modal
        opened={opened}
        onClose={onClose}
        title={
          <div>
            <h1 className="text-xl font-bold">
              Lịch làm việc : {staffName || ""}
            </h1>
            <div className="mt-2 border-b border-gray-300"></div>
          </div>
        }
        size="90%"
      >
        {loading ? (
          <Loader />
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            locale={viLocale}
            height="auto"
            eventDisplay="block"
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
          />
        )}
      </Modal>

      <ScheduleEditModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        staffId={staffId}
        shiftDate={selectedDate}
        mode={modalMode}
        defaultData={editData}
        shiftOptions={shiftOptions}
        onSubmit={loadSchedules}
        onDelete={loadSchedules}
      />
    </>
  );
};

export default DetailScheduleStaffModal;
