export interface Staff {
  id: string;
  fullName: string;
  staffCode: string;
  gender: string;
  phone: string;
}

export interface WorkSchedule {
  staffId: string;
  staffName: string;
  shifts: ("MORNING" | "AFTERNOON" | "NIGHT" | "FULL_DAY")[];
  daysOfWeek: string[];
  startDate: string;
  endDate: string;
  note: string | null;
}

export interface WorkScheduleDetail {
  id: string;
  staffId: string;
  staffName: string;
  shift: "MORNING" | "AFTERNOON" | "NIGHT" | "FULL_DAY";
  shiftDate: string;
  status: string;
  note: string | null;
}
