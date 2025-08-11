export const getErrorMessage = (error: any, fallback = "Đã có lỗi xảy ra") => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.title ||
    (Array.isArray(error?.response?.data?.errors) &&
      error?.response?.data?.errors[0]) ||
    error?.message ||
    fallback
  );
};
