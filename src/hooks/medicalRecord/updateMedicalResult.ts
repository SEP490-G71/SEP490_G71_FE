import axiosInstance from "../../services/axiosInstance";

const updateMedicalResult = async (
  resultId: string,
  files: File[],
  existingImageUrls: string[], // Ảnh cũ
  staffId: string,
  note: string
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("file", file); 
  });

  existingImageUrls.forEach((url) => {
     formData.append("imageUrls[]", url); 
  });

  formData.append("staffId", staffId);
  formData.append("note", note);

  return axiosInstance.put(
    `/medical-results/${resultId}/update`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


export default updateMedicalResult;
