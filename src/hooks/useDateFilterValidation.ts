// hooks/useDateFilterValidation.ts
import { toast } from "react-toastify";

export const validateDateNotFuture = (value: Date | null): string | null => {
  if (!value) return null;

  const now = new Date();
  if (value > now) return "Không được chọn ngày ở tương lai";

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

export const useDateFilterValidation = () => {
  const validate = (from: Date | null, to: Date | null): boolean => {
    const error1 = validateDateNotFuture(from);
    const error2 = validateDateNotFuture(to);
    const error3 = validateFromDateToDate(from, to);

    if (error1 || error2 || error3) {
      toast.error(error1 || error2 || error3);
      return false;
    }

    return true;
  };

  return { validate };
};
