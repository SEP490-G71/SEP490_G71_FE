// import { useEffect, useState, useCallback } from "react";
// import axiosInstance from "../../services/axiosInstance";
// import { toast } from "react-toastify";
// import { useUserInfo } from "../auth/useUserInfo";

// interface UseInShiftResult {
//   inShift: boolean | null;
//   loading: boolean;
//   error: string | null;
//   refetch: () => Promise<boolean | null>;
// }

// export const useInShift = (): UseInShiftResult => {
//   const { loading: userLoading, error: userError } = useUserInfo();

//   const [inShift, setInShift] = useState<boolean | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchInShift = useCallback(async (): Promise<boolean | null> => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axiosInstance.get("/work-schedules/me/in-shift");

//       if (res.data?.code === 1000) {
//         const value = Boolean(res.data?.result);
//         setInShift(value);
//         return value;
//       }
//       throw new Error(res.data?.message || "Không thể kiểm tra ca làm việc.");
//     } catch (err: any) {
//       const message =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Không thể kiểm tra ca làm việc.";
//       setError(message);
//       toast.error(message);
//       setInShift(null);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (!userLoading) {
//       if (userError) {
//         setError(userError);
//         setLoading(false);
//         setInShift(null);
//       } else {
//         fetchInShift();
//       }
//     }
//   }, [userLoading, userError, fetchInShift]);

//   return { inShift, loading, error, refetch: fetchInShift };
// };


import { useEffect, useState, useCallback, useMemo } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { useUserInfo } from "../auth/useUserInfo";

interface UseInShiftResult {
  inShift: boolean | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<boolean | null>;
}

// Tuỳ chọn: cho phép ép bật/tắt gọi API từ bên ngoài
type UseInShiftOptions = {
  enabled?: boolean; // default: !isAdmin
};

export const useInShift = (opts?: UseInShiftOptions): UseInShiftResult => {
  const { userInfo, loading: userLoading, error: userError } = useUserInfo();

  const [inShift, setInShift] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Xác định ADMIN
  const isAdmin = useMemo(
    () => Boolean((userInfo?.roles as string[] | undefined)?.includes("ADMIN")),
    [userInfo?.roles]
  );

  // Nếu không truyền opts.enabled, mặc định: ADMIN => không gọi API
  const enabled = opts?.enabled ?? !isAdmin;

  const fetchInShift = useCallback(async (): Promise<boolean | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/work-schedules/me/in-shift");

      if (res.data?.code === 1000) {
        const value = Boolean(res.data?.result);
        setInShift(value);
        return value;
      }

      // Không phải code thành công
      const msg = res.data?.message || "Không thể kiểm tra ca làm việc.";
      throw Object.assign(new Error(msg), { response: { data: res.data } });
    } catch (err: any) {
      const code = err?.response?.data?.code;
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể kiểm tra ca làm việc.";

      setError(message);
      setInShift(null);

      // Nếu backend trả về code 1316 (Không tìm thấy nhân viên),
      // ta vẫn coi là lỗi cho staff, nhưng thường là do chưa mapping nhân viên.
      // Giảm ồn: không toast cho ADMIN (vì ADMIN vốn không gọi), và không toast khi disabled.
      if (enabled) {
        // Với code 1316 có thể toast warning thay vì error, tuỳ ý:
        if (code === 1316) {
          toast.warn(message);
        } else {
          toast.error(message);
        }
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    // Chờ xong user info
    if (userLoading) return;

    // Nếu info lỗi → kết thúc
    if (userError) {
      setError(userError);
      setLoading(false);
      setInShift(null);
      return;
    }

    // Nếu bị tắt (ADMIN hoặc opts.enabled=false) → không gọi API
    if (!enabled) {
      setInShift(null);
      setError(null);
      setLoading(false);
      return;
    }

    // Staff/role khác → gọi API kiểm tra ca
    fetchInShift();
  }, [userLoading, userError, enabled, fetchInShift]);

  return { inShift, loading, error, refetch: fetchInShift };
};
