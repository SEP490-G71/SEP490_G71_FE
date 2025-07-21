export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  WAITING = "WAITING",
  DONE = "DONE",
  CANCELED = "CANCELED",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export const StatusLabel: Record<Status, string> = {
  [Status.ACTIVE]: "Đang hoạt động",
  [Status.INACTIVE]: "Không hoạt động",
  [Status.WAITING]: "Chờ xử lý",
  [Status.DONE]: "Hoàn tất",
  [Status.CANCELED]: "Đã hủy",
  [Status.IN_PROGRESS]: "Đang thực hiện",
  [Status.PENDING]: "Đang chờ",
  [Status.FAILED]: "Thất bại",
};


export const StatusColor: Record<Status, string> = {
  [Status.ACTIVE]: "green",
  [Status.INACTIVE]: "gray",
  [Status.WAITING]: "orange",
  [Status.DONE]: "blue",
  [Status.CANCELED]: "red",
  [Status.IN_PROGRESS]: "indigo",
  [Status.PENDING]: "yellow",
  [Status.FAILED]: "red",
};