import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { ServicePackage } from "../../types/Admin/LandingPageAdmin/ServicePackage";

const useServicePackages = () => {
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (error: any) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Không thể tải danh sách gói dịch vụ."
    );
  };

  const fetchServicePackages = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/service-packages");
      const data = response.data.result ?? [];
      setServicePackages(data);

      if (data.length === 0) {
        toast.info("Không có gói dịch vụ nào.");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách gói dịch vụ:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    servicePackages,
    loading,
    fetchServicePackages,
  };
};

export default useServicePackages;
