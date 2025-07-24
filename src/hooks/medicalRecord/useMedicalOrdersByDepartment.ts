import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";

export interface MedicalOrderInDepartment {
  orderId: string;
  medicalRecordId: string;
  medicalRecordCode: string;
  patientName: string;
  serviceName: string;
  status: string;
  createdAt: string;
}

const useMedicalOrdersByDepartment = (departmentId: string) => {
  const [orders, setOrders] = useState<MedicalOrderInDepartment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!departmentId) return;

      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.get(
          `/medical-records/orders/department/${departmentId}`
        );
        setOrders(res.data.result || []);
      } catch (err) {
        setError(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [departmentId]);

  return { orders, loading, error };
};

export default useMedicalOrdersByDepartment;
