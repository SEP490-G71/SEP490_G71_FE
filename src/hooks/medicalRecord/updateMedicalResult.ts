import axiosInstance from "../../services/axiosInstance";

type UpdateMedicalResultArgs = {
  resultId: string;
  newFiles: File[];
  deleteImageIds?: string[];
  staffId: string;
  description?: string;
  note?: string;
};

const updateMedicalResult = async ({
  resultId,
  newFiles,
  deleteImageIds = [],
  staffId,
  description = "",
  note = "",
}: UpdateMedicalResultArgs) => {
  const fd = new FormData();

  newFiles.forEach((f) => fd.append("file", f));
  deleteImageIds.forEach((id) => fd.append("deleteImageIds", id));

  fd.append("staffId", staffId);
  fd.append("description", description);
  fd.append("note", note);

  return axiosInstance.put(`/medical-results/${resultId}/update`, fd, {
    headers: {
      "Content-Type": "multipart/form-data; charset=UTF-8",
    },
  });
};

export default updateMedicalResult;
