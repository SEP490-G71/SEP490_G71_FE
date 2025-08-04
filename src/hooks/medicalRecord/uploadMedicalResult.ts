import axiosInstance from "../../services/axiosInstance";

const uploadMedicalResult = async (
  resultId: string,
  files: File[],
  staffId: string,
  note: string,
   description: string
) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("file", file); 
  });
  formData.append("staffId", staffId);
  formData.append("note", note);
  formData.append("description", description);

  return axiosInstance.post(
    `/medical-results/${resultId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export default uploadMedicalResult;
