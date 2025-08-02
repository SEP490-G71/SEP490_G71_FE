import axios from "axios";

export const usePreviewMedicalRecord = () => {
  const previewMedicalRecord = async (recordId: string): Promise<string | null> => {
    if (!recordId) {
      alert("Không có mã hồ sơ để xem trước");
      return null;
    }

    try {
      const response = await axios.get(`/medical-records/${recordId}/preview`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      return url;
    } catch (error) {
      console.error("❌ previewMedicalRecord error:", error);
      alert("Không thể xem trước hồ sơ khám bệnh");
      return null;
    }
  };

  return { previewMedicalRecord };
};
