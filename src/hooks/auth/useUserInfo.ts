import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { RoleType } from "../../enums/Role/RoleType";

export interface UserInfo {
  accountId: string | null;
  userId: string | null;
  username: string;
  roles: RoleType[];
  permissions: string[];
}

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axiosInstance.get("/accounts/myInfo");

        if (res.data?.code === 1000 && res.data?.result) {
          const data = res.data.result;

          const roles = (data.roles || []).map((role: string) =>
            role.toUpperCase()
          ) as RoleType[];

          setUserInfo({
            accountId: data.accountId,
            userId: data.userId,
            username: data.username,
            roles,
            permissions: data.permissions || [],
          });
        } else {
          throw new Error("Không thể lấy thông tin người dùng");
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Không thể tải thông tin người dùng";
        toast.error(message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { userInfo, loading, error };
};
