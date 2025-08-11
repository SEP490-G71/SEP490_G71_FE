import { useState, useCallback } from "react";
import axiosInstance from "../../services/axiosInstance";

export interface InvoiceServiceItem {
  serviceId: string;
  quantity: number;
}

export interface InvoiceServiceRequest {
  services: InvoiceServiceItem[];
  note?: string;
}

export interface MedicalResponse<T = any> {
  result?: T;
  message?: string;
}

export const useAddServicesAsNewInvoice = () => {
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);

  const addServicesAsNewInvoice = useCallback(
    async (recordId: string, payload: InvoiceServiceRequest) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const res = await axiosInstance.post<MedicalResponse>(
          `/medical-records/${recordId}/new-invoice`,
          payload
        );
        setSuccess(true);
        return res.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || err?.message || "Unknown error";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, success, addServicesAsNewInvoice };
};
