import { useCallback, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { ServicePackage } from "../../types/Admin/LandingPageAdmin/ServicePackage";

const useServicePackages = () => {
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (error: any) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    "Không thể tải danh sách gói dịch vụ.";

  const fetchServicePackages = useCallback(async () => {
    if (loading) return; // tránh spam khi user bấm nhanh
    setLoading(true);
    try {
      const res = await axiosInstance.get("/service-packages");
      const data = res.data.result ?? [];
      setServicePackages(data);
      if (data.length === 0) toast.info("Không có gói dịch vụ nào.");
    } catch (err) {
      console.error("Lỗi khi tải danh sách gói dịch vụ:", err);
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { servicePackages, loading, fetchServicePackages };
};

export default useServicePackages;
