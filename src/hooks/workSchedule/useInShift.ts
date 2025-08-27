import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { useUserInfo } from "../auth/useUserInfo";

interface UseInShiftResult {
  inShift: boolean | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<boolean | null>;
}

export const useInShift = (): UseInShiftResult => {
  const { loading: userLoading, error: userError } = useUserInfo();

  const [inShift, setInShift] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      throw new Error(res.data?.message || "Không thể kiểm tra ca làm việc.");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể kiểm tra ca làm việc.";
      setError(message);
      toast.error(message);
      setInShift(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userLoading) {
      if (userError) {
        setError(userError);
        setLoading(false);
        setInShift(null);
      } else {
        fetchInShift();
      }
    }
  }, [userLoading, userError, fetchInShift]);

  return { inShift, loading, error, refetch: fetchInShift };
};
