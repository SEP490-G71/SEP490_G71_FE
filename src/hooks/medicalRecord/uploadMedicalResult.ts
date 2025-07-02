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

  // 🔍 Log chi tiết để debug
  console.log("📤 Uploading medical result:");
  console.log("🆔 resultId:", resultId);
  console.log("👨‍⚕️ staffId:", staffId);
  console.log("📝 note:", note);
  console.log("📎 file count:", files.length);
  files.forEach((file, index) => {
    console.log(`📎 file[${index}]:`, file.name, file.size, file.type);
  });

  // Gọi API
  return axiosInstance.post(
    `/medical-result/${resultId}/upload`,
    formData
  );
};

export default uploadMedicalResult;