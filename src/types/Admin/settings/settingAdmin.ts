export interface SettingAdmin {
  hospitalName: string;
  hospitalPhone: string;
  hospitalEmail?: string;
  hospitalAddress: string;
  bankAccountNumber: string;
  bankCode: string;
  latestCheckInMinutes: number;
  paginationSizeList: number[];
  queueOpenTime: string;
  queueCloseTime: string;
  minBookingDaysBefore: number;
  minLeaveDaysBefore: number;
  monthlyTargetRevenue: number;
}
