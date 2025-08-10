
export enum SatisfactionLevel {
  VERY_BAD = "VERY_BAD",
  BAD = "BAD",
  AVERAGE = "AVERAGE",
  GOOD = "GOOD",
  EXCELLENT = "EXCELLENT",
}

// Map để hiển thị tiếng Việt
export const SatisfactionLevelMap: Record<SatisfactionLevel, string> = {
  [SatisfactionLevel.VERY_BAD]: "Rất tệ",
  [SatisfactionLevel.BAD]: "Tệ",
  [SatisfactionLevel.AVERAGE]: "Bình thường",
  [SatisfactionLevel.GOOD]: "Tốt",
  [SatisfactionLevel.EXCELLENT]: "Xuất sắc",
};

