import { toast } from "react-toastify";
import axiosInstance from "../../services/axiosInstance";
import { Patient } from "../../../src/types/Admin/RegisterMedicalExamination/RegisterMedicalExamination";
import { getErrorMessage } from "../../components/utils/getErrorMessage";

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
    } catch (error) {
      console.error("❌ Lỗi tạo bệnh nhân:", error);
      toast.error(getErrorMessage(error, "Tạo bệnh nhân thất bại"));
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
      console.error(" Lỗi khi fetch /patients:", error);
      toast.error(getErrorMessage(error, "Không thể tải danh sách bệnh nhân"));
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
    } catch (error) {
      console.error(" Lỗi đăng ký khám:", error);
      toast.error(getErrorMessage(error, "Đăng ký khám thất bại"));
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
      console.error(" Lỗi khi fetch queue-patients/search:", error);
      toast.error(
        getErrorMessage(error, "Không thể tải danh sách đăng ký khám")
      );
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
      console.error(" Lỗi khi fetch departments:", error);
      toast.error(getErrorMessage(error, "Không thể tải danh sách phòng khám"));
      return [];
    }
  };

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
      console.error("Lỗi khi fetch registered-online:", error);
      toast.error(
        getErrorMessage(error, "Không thể tải danh sách đăng ký khám online")
      );
      return { content: [], totalElements: 0 };
    }
  };

  // ------------------------------
  // [NEW] Import queue patients từ file Excel
  // ------------------------------
  const importQueuePatients = async (file: File): Promise<any> => {
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await axiosInstance.post("/queue-patients/import", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Tuỳ backend trả gì, mình ưu tiên hiện message chung và đếm số dòng nếu có
      const result = res.data?.result ?? res.data;
      const okCount =
        result?.successCount ?? result?.imported ?? result?.count ?? undefined;

      toast.success(
        okCount !== undefined
          ? `Import thành công ${okCount} dòng`
          : "Import thành công"
      );
      return result;
    } catch (error) {
      console.error("❌ Lỗi import queue-patients:", error);
      toast.error(getErrorMessage(error, "Import thất bại"));
      throw error;
    }
  };

  return {
    createPatient,
    fetchAllPatients,
    queuePatient,
    fetchTodayRegisteredPatients,
    fetchDepartmentsBySpecialization,
    fetchOnlineRegisteredPatients,
    importQueuePatients, // [NEW]
  };
};

export default useRegisterMedicalExamination;
