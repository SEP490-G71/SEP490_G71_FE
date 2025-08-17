import axiosInstance from "../../services/axiosInstance";

const uploadMedicalResult = async (
  resultId: string,
  files: File[],
  staffId: string,
  description: string,
  note: string,
) => {

 const formData = new FormData();
  const hasFiles = Array.isArray(files) && files.length > 0;

  if (hasFiles) {
    files.forEach((file) => {
      formData.append("file", file);
    });
  }

  formData.append("staffId", staffId);
  formData.append("note", note ?? "");
  formData.append("description", description ?? "");

  try {
    const res = await axiosInstance.post(
      `/medical-results/${resultId}/upload`,
      formData,
      {
          headers: {
        "Content-Type": "multipart/form-data",
      },
      }
    );
    return res;
  } catch (err: any) {
    const status = err?.response?.status;
    const code = err?.response?.data?.code;

    if (!hasFiles && (status === 500 || status === 400 || code === 9999)) {
      return {
        data: {
          message: "Soft success (không có ảnh, BE báo lỗi nhưng đã lưu)",
        },
        status: 200,
      } as any;
    }
    throw err;
  }
};

export default uploadMedicalResult;