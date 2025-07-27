import { useEffect, useState } from "react";
import axios from "axios";
import { ServicePackage } from "../../types/Admin/LandingPageAdmin/ServicePackage";
import { toast } from "react-toastify";

export const useServicePackages = () => {
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://14.225.254.152:8080/medical-diagnosis/service-packages"
        );
        setServicePackages(response.data.result || []);
      } catch (error) {
        toast.error("Không thể tải danh sách gói dịch vụ");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return { servicePackages, loading };
};
