// export enum Status {
//   ACTIVE = "ACTIVE",
//   INACTIVE = "INACTIVE",
//   WAITING = "WAITING",
//   DONE = "DONE",
//   CANCELED = "CANCELED",
//   IN_PROGRESS = "IN_PROGRESS",
//   PENDING = "PENDING",
//   FAILED = "FAILED",
//    AWAITING_RESULT = "AWAITING_RESULT",
//   CALLING = "CALLING",

// }

// export const StatusLabel: Record<Status, string> = {
//   [Status.ACTIVE]: "Đang hoạt động",
//   [Status.INACTIVE]: "Không hoạt động",
//   [Status.WAITING]: "Chờ khám",
//   [Status.DONE]: "Hoàn tất",
//   [Status.CANCELED]: "Đã hủy",
//   [Status.IN_PROGRESS]: "Đang thực hiện",
//   [Status.PENDING]: "Đang chờ",
//   [Status.FAILED]: "Thất bại",
//   [Status.CALLING]: "Đang gọi", 
//     [Status.AWAITING_RESULT]: "Chờ kết quả",

// };

// export const StatusColor: Record<Status, string> = {
//   [Status.ACTIVE]: "green",
//   [Status.INACTIVE]: "gray",
//   [Status.WAITING]: "orange",
//   [Status.DONE]: "blue",
//   [Status.CANCELED]: "red",
//   [Status.IN_PROGRESS]: "green",
//   [Status.PENDING]: "yellow",
//   [Status.FAILED]: "red",
//   [Status.CALLING]: "yellow", 
//   [Status.AWAITING_RESULT]: "yellow",
// };


export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  WAITING = "WAITING",
  DONE = "DONE",
  CANCELED = "CANCELED",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING = "PENDING",
  FAILED = "FAILED",
  AWAITING_RESULT = "AWAITING_RESULT",
  CALLING = "CALLING",
}

export const StatusLabel: Record<Status, string> = {
  [Status.ACTIVE]: "Đang hoạt động",
  [Status.INACTIVE]: "Không hoạt động",
  [Status.WAITING]: "Chờ khám",
  [Status.DONE]: "Hoàn tất",
  [Status.CANCELED]: "Đã qua lượt",
  [Status.IN_PROGRESS]: "Đang thực hiện",
  [Status.PENDING]: "Đang chờ",
  [Status.FAILED]: "Thất bại",
  [Status.CALLING]: "Đang gọi",
  [Status.AWAITING_RESULT]: "Chờ kết quả",
};

export const StatusColor: Record<Status, string> = {
  [Status.ACTIVE]: "green",          // Hoạt động
  [Status.INACTIVE]: "gray",         // Không hoạt động
  [Status.WAITING]: "orange",        // Chờ khám
  [Status.DONE]: "blue",             // Hoàn tất
  [Status.CANCELED]: "red",          // Đã hủy
  [Status.IN_PROGRESS]: "green",      // Đang thực hiện
  [Status.PENDING]: "yellow",        // Đang chờ xử lý
  [Status.FAILED]: "rose",           // Thất bại
  [Status.CALLING]: "yellow",        // Đang gọi vào khám
  [Status.AWAITING_RESULT]: "indigo",  // Chờ kết quả sau khám
};
