import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../services/axiosInstance";
import { SettingAdmin } from "../../types/Admin/settings/settingAdmin";
import { getErrorMessage } from "../../components/utils/getErrorMessage";

export const useSettingAdminService = () => {
  const [setting, setSetting] = useState<SettingAdmin | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSetting = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/settings");
      setSetting(res.data.result);
    } catch (error) {
      console.error("Lỗi khi fetch setting:", error);
      toast.error(getErrorMessage(error, "Không thể tải thông tin cài đặt"));
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (data: SettingAdmin) => {
    try {
      await axiosInstance.post("/settings", data);
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      console.error("Lỗi khi update setting:", error);
      toast.error(getErrorMessage(error, "Cập nhật thông tin thất bại"));
    }
  };

  useEffect(() => {
    fetchSetting();
  }, []);

  return {
    setting,
    loading,
    updateSetting,
  };
};
