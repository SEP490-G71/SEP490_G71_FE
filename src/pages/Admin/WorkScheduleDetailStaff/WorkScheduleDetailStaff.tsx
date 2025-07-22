import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import viLocale from "@fullcalendar/core/locales/vi";
import { Loader } from "@mantine/core";
import { useWorkScheduleDetailStaff } from "../../../hooks/WorkScheduleDetailStaff/useWorkScheduleDetailStaff";
import { WorkScheduleDetail } from "../../../types/Admin/WorkSchedule/WorkSchedule";
import { toast } from "react-toastify";
import dayjs from "dayjs";

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

const WorkScheduleDetailStaff: React.FC = () => {
  const { schedules, loading, checkInWorkSchedule } =
    useWorkScheduleDetailStaff();

  const shiftLabelMap: Record<string, string> = {
    MORNING: "Ca sáng",
    AFTERNOON: "Ca chiều",
    NIGHT: "Ca tối",
  };

  const statusLabelMap: Record<string, string> = {
    SCHEDULED: "(Chờ điểm danh)",
    ATTENDED: "(Đã điểm danh)",
    ABSENT: "(Vắng mặt)",
    ON_LEAVE: "(Đã nghỉ)",
  };

  const events = schedules.map((item: WorkScheduleDetail) => {
    const shiftKey = item.shift.name as keyof typeof shiftLabelMap;
    const shiftName = shiftLabelMap[shiftKey] || item.shift.name;
    const statusLabel = statusLabelMap[item.status] || item.status;
    const { backgroundColor, textColor } = getColorByShiftName(shiftName);

    return {
      id: item.id,
      title: `${shiftName} ${statusLabel}`,
      start: item.shiftDate,
      allDay: true,
      backgroundColor,
      textColor,
      extendedProps: {
        rawDate: item.shiftDate,
        status: item.status,
      },
    };
  });

  const handleEventClick = (info: any) => {
    const { rawDate, status } = info.event.extendedProps;
    const eventDate = dayjs(rawDate).startOf("day");
    const today = dayjs().startOf("day");

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

    checkInWorkSchedule(info.event.id);
  };

  return (
    <div style={{ padding: 16 }}>
      <style>{`
        .fc .fc-toolbar-title {
          text-transform: uppercase;
          font-size: 20px !important;
          font-weight: 700 !important;
          text-align: center;
          width: 100%;
        }
        .fc .fc-toolbar-chunk:nth-child(2) {
          flex: 1;
          justify-content: center;
          display: flex;
        }
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
      `}</style>

      {loading ? (
        <Loader color="blue" />
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locales={[viLocale]}
          locale="vi"
          events={events}
          eventClick={handleEventClick}
          height="auto"
          eventDisplay="block"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
        />
      )}
    </div>
  );
};

export default WorkScheduleDetailStaff;
