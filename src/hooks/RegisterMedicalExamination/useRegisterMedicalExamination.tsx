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

export interface Department {
  id: string;
  name: string;
  code?: string;
  roomNumber?: string;
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

  const queuePatient = async (
    patientId: string,
    registeredTime: string,
    onSuccess?: () => void,
    roomNumber?: string,
    specializationId?: string,
    isPriority?: boolean
  ) => {
    try {
      const payload: any = {
        patientId,
        registeredTime,
        specializationId,
        isPriority,
      };

      if (roomNumber) {
        payload.roomNumber = roomNumber;
      }

      await axiosInstance.post("/queue-patients", payload);
      toast.success("Đăng ký khám thành công");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("❌ Lỗi đăng ký khám:", err);
      const message = err?.response?.data?.message || "Đăng ký khám thất bại";
      toast.error(message);
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

  const fetchDepartmentsBySpecialization = async (
    specializationId: string
  ): Promise<Department[]> => {
    if (!specializationId) return [];

    try {
      const response = await axiosInstance.get("/departments/search", {
        params: {
          specializationId,
        },
      });
      return response.data?.result || [];
    } catch (error) {
      toast.error("Không thể tải danh sách phòng khám");
      console.error("❌ Lỗi khi fetch departments:", error);
      return [];
    }
  };

  // ✅✅✅ [ĐÃ THÊM] Lấy danh sách bệnh nhân đăng ký khám online
  const fetchOnlineRegisteredPatients = async (
    filters: {
      registeredAt: string;
      fullName?: string;
      email?: string;
      phoneNumber?: string;
    },
    page = 0,
    size = 10
  ): Promise<FetchPatientsResponse> => {
    try {
      const response = await axiosInstance.get("/registered-online", {
        params: {
          ...filters,
          page,
          size,
        },
      });

      const result = response.data?.result;
      return {
        content: result?.content || [],
        totalElements: result?.totalElements || 0,
      };
    } catch (error) {
      console.error("❌ Lỗi khi fetch registered-online:", error);
      toast.error("Không thể tải danh sách đăng ký khám online");
      return { content: [], totalElements: 0 };
    }
  };

  return {
    createPatient,
    fetchAllPatients,
    queuePatient,
    fetchTodayRegisteredPatients,
    fetchDepartmentsBySpecialization,
    fetchOnlineRegisteredPatients,
  };
};
