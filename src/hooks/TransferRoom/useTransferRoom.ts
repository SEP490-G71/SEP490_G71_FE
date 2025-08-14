// import { useState, useCallback } from "react";
// import axiosInstance from "../../services/axiosInstance";
// import { toast } from "react-toastify";

// interface TransferRoomPayload {
//   toDepartmentNumber: string;
//   reason: string;
// }

// export const useTransferRoom = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);

//   const transferRoom = useCallback(
//     async (recordId: string, payload: TransferRoomPayload) => {
//       setLoading(true);
//       setError(null);
//       setSuccess(false);

//       try {
//         const res = await axiosInstance.post(
//           `/room-transfers/${recordId}/transfer`,
//           payload
//         );
//         setSuccess(true);
//         toast.success("✅ Chuyển phòng thành công");
//         return res.data;
//       } catch (err: any) {
//         const msg =
//           err?.response?.data?.message || err.message || "Lỗi khi chuyển phòng";
//         setError(msg);
//         toast.error(`❌ ${msg}`);
//         throw err;
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   return { loading, error, success, transferRoom };
// };


import { useState, useCallback } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

export interface TransferRoomPayload {
  fromDeptId: string;   
  toDeptId: string;     
  reason?: string;
  
}


export const useTransferRoom = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const transferRoom = useCallback(
    async (recordId: string, payload: TransferRoomPayload) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const body = {
          fromDeptId: payload.fromDeptId,
          toDeptId: payload.toDeptId,
          reason: payload.reason,
          toDepartmentNumber: payload.toDeptId, // fallback cho BE cũ
        };
        
      try {
        const res = await axiosInstance.post(
          `/room-transfers/${recordId}/transfer`,body
          // ,payload 
        );
        setSuccess(true);
        toast.success("✅ Chuyển phòng thành công");
        return res.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || err.message || "Lỗi khi chuyển phòng";
        setError(msg);
        toast.error(`❌ ${msg}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, success, transferRoom };
};
