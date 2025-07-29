import dayjs from "dayjs";

interface LeaveDetail {
  date: string;
  shiftId: string;
}

export const isFullDayLeave = (details: LeaveDetail[]): boolean => {
  if (!details || details.length === 0) return false;

  const dateToShifts: Record<string, Set<string>> = {};

  for (const d of details) {
    if (!dateToShifts[d.date]) {
      dateToShifts[d.date] = new Set();
    }
    dateToShifts[d.date].add(d.shiftId);
  }

  const uniqueDates = Object.keys(dateToShifts).sort();
  if (uniqueDates.length < 2) return false;

  const areDatesContinuous =
    dayjs(uniqueDates[uniqueDates.length - 1]).diff(
      dayjs(uniqueDates[0]),
      "day"
    ) === uniqueDates.length - 1;

  const hasFullShiftsPerDay = Object.values(dateToShifts).every(
    (shifts) => shifts.size >= 3 // Có thể đổi thành === 3 nếu cần cứng nhắc
  );

  return areDatesContinuous && hasFullShiftsPerDay;
};
