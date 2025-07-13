import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import viLocale from "@fullcalendar/core/locales/vi";
import { Loader } from "@mantine/core";
import { useWorkScheduleDetailStaff } from "../../../hooks/WorkScheduleDetailStaff/useWorkScheduleDetailStaff";
import { WorkScheduleDetail } from "../../../types/Admin/WorkSchedule/WorkSchedule";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const WorkScheduleDetailStaff: React.FC = () => {
  const { schedules, loading, checkInWorkSchedule } =
    useWorkScheduleDetailStaff();

  const shiftLabelMap: Record<string, string> = {
    MORNING: "Sáng ☀️",
    AFTERNOON: "Chiều 🌤️",
    NIGHT: "Tối 🌙",
    FULL_DAY: "Cả ngày 🕐",
  };

  const shiftColorMap: Record<string, string> = {
    MORNING: "#fef08a",
    AFTERNOON: "#a5f3fc",
    NIGHT: "#c4b5fd",
    FULL_DAY: "#fca5a5",
  };

  const statusLabelMap: Record<string, string> = {
    SCHEDULED: "Đã phân công",
    ATTENDED: "Đã điểm danh",
    ABSENT: "Vắng mặt",
    ON_LEAVE: "Đã xin nghỉ",
  };

  const events = schedules.map((item: WorkScheduleDetail) => ({
    id: item.id,
    title: `${shiftLabelMap[item.shift]} - ${
      statusLabelMap[item.status] || item.status
    }`,
    start: item.shiftDate,
    allDay: true,
    extendedProps: {
      shift: item.shift,
      color: shiftColorMap[item.shift] || "#e0e7ff",
      rawDate: item.shiftDate,
      status: item.status,
    },
  }));

  const renderEventContent = (eventInfo: any) => {
    return (
      <div
        style={{
          backgroundColor: eventInfo.event.extendedProps.color,
          color: "#111827",
          padding: "4px 6px",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: 500,
          lineHeight: "1.2",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          wordBreak: "break-word",
          border: "1px solid #e5e7eb",
          whiteSpace: "normal",
          cursor: "pointer",
        }}
      >
        {eventInfo.event.title}
      </div>
    );
  };

  const handleEventClick = (info: any) => {
    const { rawDate, status } = info.event.extendedProps;
    const eventDate = dayjs(rawDate).startOf("day");
    const today = dayjs().startOf("day");

    // Chỉ cho chấm công nếu là hôm nay và status là SCHEDULED
    if (eventDate.isBefore(today)) {
      toast.warning("Không thể chấm công cho ca làm trong quá khứ.");
      return;
    }

    if (eventDate.isAfter(today)) {
      toast.warning("Chỉ có thể chấm công vào đúng ngày làm việc.");
      return;
    }

    if (status !== "SCHEDULED") {
      toast.warning("Ca làm này không thể chấm công.");
      return;
    }

    // Hợp lệ: thực hiện chấm công
    const workScheduleId = info.event.id;
    checkInWorkSchedule(workScheduleId);
  };

  return (
    <div style={{ padding: 16 }}>
      <style>{`
        div .fc .fc-toolbar-title {
          font-size: 22px !important;
          font-weight: 600 !important;
          color: #111827 !important;
          text-transform: uppercase !important;
        }
        div .fc .fc-col-header-cell-cushion {
          font-size: 15px !important;
          font-weight: 500 !important;
          color: #374151 !important;
        }
        div .fc .fc-button {
          border-radius: 6px !important;
          background-color: #e0f2fe !important;
          border: 1px solid #bae6fd !important;
          color: #0284c7 !important;
          font-weight: 500 !important;
          padding: 6px 12px !important;
        }
        div .fc .fc-button:hover {
          background-color: #bae6fd !important;
        }
        div .fc .fc-button-primary:not(:disabled):active {
          background-color: #7dd3fc !important;
        }
      `}</style>

      {loading ? (
        <Loader color="blue" />
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locales={[viLocale]}
          locale="vi"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            end: "",
          }}
          events={events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          height="auto"
          dayMaxEventRows={3}
          views={{
            dayGridMonth: {
              dayMaxEventRows: 4,
            },
          }}
        />
      )}
    </div>
  );
};

export default WorkScheduleDetailStaff;
