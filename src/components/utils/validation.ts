// Validate tên (dùng cho nhân viên, phòng ban,...)
export const validateName = (value: string): string | null => {
  if (!value || value.trim() === "") return "Tên không được để trống";
  if (value.length < 3 || value.length > 100) return "Tên phải từ 3 đến 100 ký tự";
  if (!/^[A-Za-zÀ-ỹ\s]+$/.test(value)) return "Tên chỉ được chứa chữ cái và khoảng trắng";
  return null;
};
// Validate mô tả
export const validateDescription = (value: string): string | null => {
  if (value && (value.length < 3 || value.length > 500))
    return "Mô tả phải từ 3 đến 500 ký tự";
  return null;
};

// Validate số phòng
export const validateRoomNumber = (value: string): string | null => {
  if (!value || value.trim() === "") return "Số phòng không được bỏ trống";
  if (!/^[A-Za-z0-9]{3,5}$/.test(value))
    return "Số phòng phải từ 3-5 ký tự, không dấu và không khoảng trắng";
  return null;
};

// Validate số điện thoại
export const validatePhone = (value: string): string | null => {
  if (!/^\d{10}$/.test(value)) return "Số điện thoại phải đủ 10 chữ số";
  return null;
};

// Validate email
export const validateEmail = (value: string): string | null => {
  if (!/^\S+@\S+\.\S+$/.test(value)) return "Email phải có dang abc@gmail.com";
  return null;
};

// Validate ngày sinh
export const validateDob = (value: string): string | null => {
  if (!value) return "Ngày sinh không được để trống";

  const selectedDate = new Date(value);
  const now = new Date();

  if (selectedDate > now) return "Ngày sinh không được là tương lai";

  const age = now.getFullYear() - selectedDate.getFullYear();
  const monthDiff = now.getMonth() - selectedDate.getMonth();
  const dayDiff = now.getDate() - selectedDate.getDate();

  const isBirthdayPassedThisYear =
    monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0);

  const actualAge = isBirthdayPassedThisYear ? age : age - 1;

  if (actualAge < 17) return "Nhân viên phải từ 17 tuổi trở lên";

  return null;
};

// Validate loại phòng
export const validateDepartmentType = (value: string): string | null => {
  return value ? null : "Loại phòng không được để trống";
};

export const validateDateNotFuture = (date: Date | null): string | null => {
  if (!date) return null;
  const today = new Date();
  if (date > today) return "Không được chọn ngày trong tương lai";
  return null;
};


export const validateFromDateToDate = (
  from: Date | null,
  to: Date | null
): string | null => {
  if (from && to && from > to) {
    return "Ngày bắt đầu không được lớn hơn ngày kết thúc";
  }
  return null;
};


// ✅ Validate ngày phải cách hôm nay ít nhất X ngày
export const validateMinDaysFromToday = (
  date: Date | null,
  minDays: number = 2
): string | null => {
  if (!date) return "Ngày không được để trống";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (selected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "Không được chọn ngày trong quá khứ";
  if (diffDays < minDays) return `Ngày phải cách ngày hiện tại ít nhất ${minDays} ngày`;

  return null;
};
