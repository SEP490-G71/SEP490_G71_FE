import { toast } from "react-toastify";
import axiosInstance from "../../services/axiosInstance";
import { Patient } from "../../../src/types/Admin/RegisterMedicalExamination/RegisterMedicalExamination";

interface PatientFilters {
  patientCode?: string;
  phone?: string;
  email?: string;
  fullName?: string;
}

interface QueuePatientFilters {
  phone?: string;
  patientCode?: string;
  specialization?: string;
  registeredTimeFrom?: string | null;
  registeredTimeTo?: string | null;
  status?: string;
  roomNumber?: string;
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

  // Đăng ký khám
  const queuePatient = async (
    patientId: string,
    registeredTime: string,
    onSuccess?: () => void,
    roomNumber?: string,
    specializationId?: string
  ) => {
    try {
      await axiosInstance.post("/queue-patients", {
        patientId,
        registeredTime,
        roomNumber,
        specializationId,
      });
      toast.success("Đăng ký khám thành công");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("❌ Lỗi đăng ký khám:", err);
      toast.error("Đăng ký khám thất bại");
    }
  };

  const fetchTodayRegisteredPatients = async (
    page = 0,
    size = 10,
    filters: QueuePatientFilters = {}
  ): Promise<FetchPatientsResponse> => {
    try {
      const response = await axiosInstance.get("/queue-patients/search", {
        params: {
          page,
          size,
          ...filters,
        },
      });

      const result = response.data?.result;
      return {
        content: result?.content || [],
        totalElements: result?.totalElements || 0,
      };
    } catch (error) {
      console.error("❌ Lỗi khi fetch queue-patients/search:", error);
      toast.error("Không thể tải danh sách đăng ký khám");
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
