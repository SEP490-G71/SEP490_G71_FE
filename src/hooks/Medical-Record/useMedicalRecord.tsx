import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { MedicalRecord } from "../../types/Admin/Medical-Record/MedicalRecord";
import { toast } from "react-toastify";

const useMedicalRecord = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAllMedicalRecords = async (
    page: number = 0,
    size: number = 5,
    sortDir: "asc" | "desc" = "asc",
    filters?: {
      medicalRecordCode?: string;
      patientName?: string;
      doctorName?: string;
      patientId?: string;
      createdById?: string;
      status?: string;
      fromDate?: string | null;
      toDate?: string | null;
    }
  ) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/medical-records", {
        params: {
          page,
          size,
          sortDir, // truyền sortDir nếu backend có xử lý
          ...filters,
        },
      });
      setMedicalRecords(res.data.result.content);
      setTotalItems(res.data.result.totalElements);
    } catch (error) {
      console.error("Failed to fetch medical records", error);
      toast.error("Lỗi khi tải danh sách hồ sơ bệnh án");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/medical-records/${id}/preview`, {
        responseType: "blob",
      });

      const url = URL.createObjectURL(res.data);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Preview lỗi", error);
      toast.error("Không thể xem trước hồ sơ bệnh án");
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/medical-records/${id}/download`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `medical-record-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download lỗi", error);
      toast.error("Không thể tải hồ sơ bệnh án");
    }
  };

  return {
    medicalRecords,
    totalItems,
    loading,
    fetchAllMedicalRecords,
    handlePreview,
    handleDownload,
  };
};

export default useMedicalRecord;
