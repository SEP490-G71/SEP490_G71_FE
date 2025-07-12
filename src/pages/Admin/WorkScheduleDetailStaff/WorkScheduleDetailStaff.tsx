import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import viLocale from "@fullcalendar/core/locales/vi";
import { WorkScheduleDetail } from "../../../types/Admin/WorkSchedule/WorkSchedule";

interface Props {
  schedules: WorkScheduleDetail[];
}

const WorkScheduleDetailStaff: React.FC<Props> = ({ schedules }) => {
  const statusColorMap: Record<string, string> = {
    COMPLETED: "#4ade80", // xanh lá nhẹ
    PENDING: "#facc15", // vàng nhẹ
    CANCELLED: "#f87171", // đỏ hồng
  };

  const shiftLabelMap: Record<string, string> = {
    MORNING: "Sáng ☀️",
    AFTERNOON: "Chiều 🌤️",
    NIGHT: "Tối 🌙",
    FULL_DAY: "Cả ngày 🕐",
  };

  const events = schedules.map((item) => ({
    title: `${shiftLabelMap[item.shift]} - ${item.status}`,
    start: item.shiftDate,
    allDay: true,
    extendedProps: {
      color: statusColorMap[item.status] || "#60a5fa", // xanh dương nhẹ
    },
  }));

  const renderEventContent = (eventInfo: any) => {
    return (
      <div
        style={{
          backgroundColor: eventInfo.event.extendedProps.color,
          color: "#1f2937", // text-gray-800
          padding: "6px 8px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 500,
          display: "inline-block",
          width: "100%",
          boxSizing: "border-box",
          border: "1px solid #e5e7eb", // gray-200 border
        }}
      >
        {eventInfo.event.title}
      </div>
    );
  };

  return (
    <div style={{ padding: 16 }}>
      <style>
        {`
    div .fc .fc-toolbar-title {
      font-size: 22px !important;
      font-weight: 600 !important;
      color: #111827 !important;
      text-transform: uppercase !important; /* hoặc capitalize */
    }

          /* Thứ trong tuần */
          div .fc .fc-col-header-cell-cushion {
            font-size: 15px !important;
            font-weight: 500 !important;
            color: #374151 !important; /* gray-700 */
          }

          /* Nút Today, Prev, Next */
          div .fc .fc-button {
            border-radius: 6px !important;
            background-color: #e0f2fe !important; /* blue-100 */
            border: 1px solid #bae6fd !important;  /* blue-200 */
            color: #0284c7 !important; /* blue-600 */
            font-weight: 500 !important;
            padding: 6px 12px !important;
          }

          div .fc .fc-button:hover {
            background-color: #bae6fd !important; /* blue-200 */
          }

          div .fc .fc-button-primary:not(:disabled):active {
            background-color: #7dd3fc !important; /* blue-300 */
          }
        `}
      </style>

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
        height="auto"
      />
    </div>
  );
};

export default WorkScheduleDetailStaff;
