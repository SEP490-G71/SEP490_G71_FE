import axiosInstance from "../../services/axiosInstance";

const uploadMedicalResult = async (
  resultId: string,
  files: File[],
  staffId: string,
  note: string
) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("file", file); 
  });
  formData.append("staffId", staffId);
  formData.append("note", note);

  return axiosInstance.post(
    `/medical-result/${resultId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export default uploadMedicalResult;
