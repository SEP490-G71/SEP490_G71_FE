import { toast } from "react-toastify";
import axiosInstance from "../../services/axiosInstance";
import { Patient } from "../../../src/types/Admin/RegisterMedicalExamination/RegisterMedicalExamination";

interface PatientFilters {
  patientCode?: string;
  phone?: string;
  email?: string;
  fullName?: string;
}

interface FetchPatientsResponse {
  content: Patient[];
  totalElements: number;
}

export const useRegisterMedicalExamination = () => {
  // Tạo mới bệnh nhân
  const createPatient = async (
    formData: Partial<Patient>
  ): Promise<Patient | null> => {
    try {
      const res = await axiosInstance.post("/patients", {
        ...formData,
        gender: formData.gender?.toUpperCase(),
      });

      const createdPatient: Patient = res.data.result;
      toast.success("Tạo bệnh nhân thành công");
      return createdPatient;
    } catch (error: any) {
      console.error("❌ Lỗi tạo bệnh nhân:", error);
      const message =
        error?.response?.data?.message || "Tạo bệnh nhân thất bại";
      toast.error(message);
      return null;
    }
  };

  // Lấy danh sách bệnh nhân (có phân trang + lọc)
  const fetchAllPatients = async (
    page = 0,
    size = 10,
    filters: PatientFilters = {}
  ): Promise<FetchPatientsResponse> => {
    try {
      const response = await axiosInstance.get("/patients", {
        params: {
          page,
          size,
          ...filters,
        },
      });

      const result = response.data.result;
      return {
        content: result.content || [],
        totalElements: result.totalElements || 0,
      };
    } catch (error) {
      console.error("❌ Lỗi khi fetch /patients:", error);
      toast.error("Không thể tải danh sách bệnh nhân");
      return { content: [], totalElements: 0 };
    }
  };

  // Đăng ký khám cho bệnh nhân
  const queuePatient = async (
    patientId: string,
    type: string = "CONSULTATION",
    registeredTime: string,
    onSuccess?: () => void
  ) => {
    try {
      await axiosInstance.post("/queue-patients", {
        patientId,
        type,
        registeredTime,
      });
      toast.success("Đăng ký khám thành công");

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("❌ Lỗi đăng ký khám:", err);
      toast.error("Đăng ký khám thất bại");
    }
  };

  // Lấy danh sách bệnh nhân đã đăng ký hôm nay
  const fetchTodayRegisteredPatients = async (
    page = 0,
    size = 10
  ): Promise<FetchPatientsResponse> => {
    try {
      const response = await axiosInstance.get("/patients/today", {
        params: { page, size },
      });

      const result = response.data?.result;

      if (result?.content && Array.isArray(result.content)) {
        return {
          content: result.content,
          totalElements: result.totalElements || result.content.length,
        };
      }

      console.warn("⚠️ Không có danh sách content trong result:", result);
      return { content: [], totalElements: 0 };
    } catch (error) {
      console.error("❌ Lỗi khi fetch /patients/today:", error);
      toast.error("Không thể tải danh sách đã đăng ký hôm nay");
      return { content: [], totalElements: 0 };
    }
  };

  return {
    createPatient,
    fetchAllPatients,
    queuePatient,
    fetchTodayRegisteredPatients,
  };
};
