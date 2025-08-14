export interface ScheduleStatisticItem {
  staffId: string;
  staffName: string;
  staffCode: string;
  totalShifts: number;
  attendedShifts: number;
  leaveShifts: number;
  lateShifts: number;
  attendanceRate: number;
}
