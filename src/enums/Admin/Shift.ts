export enum Shift {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  NIGHT = "NIGHT",
  FULL_DAY = "FULL_DAY",
}

export const ShiftLabels: Record<Shift, string> = {
  [Shift.MORNING]: "Ca sáng",
  [Shift.AFTERNOON]: "Ca chiều",
  [Shift.NIGHT]: "Ca tối",
  [Shift.FULL_DAY]: "Cả ngày",
};