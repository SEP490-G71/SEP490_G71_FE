import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../services/axiosInstance";
import { getErrorMessage } from "../../components/utils/getErrorMessage";
import { RawRoomTransfer, RoomTransferFilters, RoomTransferRow } from "../../types/RoomTranfer/RoomTransfer";
import { MedicalRecordStatus } from "../../enums/MedicalRecord/MedicalRecordStatus";
const toMedicalRecordStatus = (s: unknown): MedicalRecordStatus => {
  const v = typeof s === "string" ? s : "";
  return (Object.values(MedicalRecordStatus) as string[]).includes(v)
    ? (v as MedicalRecordStatus)
    : MedicalRecordStatus.WAITING_FOR_RESULT; 
};

const mapToRow = (x: RawRoomTransfer): RoomTransferRow => ({
  id: x.id,

  medicalRecordId: x.medicalRecord?.id ?? "",
  medicalRecordCode: x.medicalRecord?.medicalRecordCode ?? "",
  patientName: x.medicalRecord?.patientName ?? "",
  recordDoctorName: x.medicalRecord?.doctorName ?? "",
   recordStatus: toMedicalRecordStatus(x.medicalRecord?.status),
  recordCreatedAt: x.medicalRecord?.createdAt ?? "",

  fromDepartmentId: x.fromDepartment?.id ?? "",
  fromDepartmentName: x.fromDepartment?.name ?? "",
  fromRoomNumber: x.fromDepartment?.roomNumber ?? "",

  toDepartmentId: x.toDepartment?.id ?? "",
  toDepartmentName: x.toDepartment?.name ?? "",
  toRoomNumber: x.toDepartment?.roomNumber ?? "",

  transferredById: x.transferredBy?.id ?? "",
  transferredByName: x.transferredBy?.fullName ?? "",
  transferredByCode: x.transferredBy?.staffCode ?? "",

  transferTime: x.transferTime ?? "",
  reason: x.reason ?? "",

  doctorId: x.doctor?.id ?? "",
  doctorName: x.doctor?.fullName ?? "",
  doctorCode: x.doctor?.staffCode ?? "",

  conclusionText: x.conclusionText ?? "",
  isFinal: !!x.isFinal,
});

export const useRoomTransfers = () => {
  const [rows, setRows] = useState<RoomTransferRow[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchRoomTransfers = async (params: RoomTransferFilters) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/room-transfers", { params });

      const content: RawRoomTransfer[] = res.data?.result?.content ?? [];
      const total: number = res.data?.result?.totalElements ?? content.length ?? 0;

      const mapped = content.map(mapToRow);

      setRows(mapped);
      setTotalItems(total);
    
    } catch (error: any) {
      console.error("Failed to fetch room transfers:", error);
      toast.error(getErrorMessage(error, "Không thể tải dữ liệu chuyển phòng."));
    } finally {
      setLoading(false);
    }
  };

  return { rows, totalItems, loading, fetchRoomTransfers };
};
