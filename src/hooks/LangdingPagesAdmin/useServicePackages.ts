import { useCallback, useRef, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { ServicePackage } from "../../types/Admin/LandingPageAdmin/ServicePackage";

const useServicePackages = () => {
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(false);

  const loadingRef = useRef(false);

  const getErrorMessage = (error: any) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    "Không thể tải danh sách gói dịch vụ.";

  const fetchServicePackages = useCallback(async () => {
    if (loadingRef.current) return; // chặn spam
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await axiosInstance.get("/service-packages");
      const data: ServicePackage[] = res?.data?.result ?? [];
      setServicePackages(data);
      if (data.length === 0) {
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách gói dịch vụ:", err);
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  return { servicePackages, loading, fetchServicePackages };
};

export default useServicePackages;
