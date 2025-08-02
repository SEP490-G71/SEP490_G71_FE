export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  WAITING = "WAITING",
  DONE = "DONE",
  CANCELED = "CANCELED",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING = "PENDING",
  FAILED = "FAILED",
   WaitingResult = "WAITING_RESULT",
  CALLING = "CALLING",

}

export const StatusLabel: Record<Status, string> = {
  [Status.ACTIVE]: "Đang hoạt động",
  [Status.INACTIVE]: "Không hoạt động",
  [Status.WAITING]: "Chờ khám",
  [Status.DONE]: "Hoàn tất",
  [Status.CANCELED]: "Đã hủy",
  [Status.IN_PROGRESS]: "Đang thực hiện",
  [Status.PENDING]: "Đang chờ",
  [Status.FAILED]: "Thất bại",
  [Status.CALLING]: "Đang gọi", 
    [Status.WaitingResult]: "Chờ kết quả",

};

export const StatusColor: Record<Status, string> = {
  [Status.ACTIVE]: "green",
  [Status.INACTIVE]: "gray",
  [Status.WAITING]: "orange",
  [Status.DONE]: "blue",
  [Status.CANCELED]: "red",
  [Status.IN_PROGRESS]: "green",
  [Status.PENDING]: "yellow",
  [Status.FAILED]: "red",
  [Status.CALLING]: "yellow", 
  [Status.WaitingResult]: "cyan",
};
