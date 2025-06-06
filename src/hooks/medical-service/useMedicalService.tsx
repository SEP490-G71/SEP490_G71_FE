import React, { useState } from "react";
import axiosInstance from "../../services/axiosInstance";

const useMedicalService = () => {
  const [medicalServices, setMedicalServices] = React.useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAllMedicalServices = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/medical-service");
      console.log(res.data.result);
      setMedicalServices(res.data.result.content);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    medicalServices,
    setMedicalServices,
    loading,
    setLoading,
    fetchAllMedicalServices,
  };
};

export default useMedicalService;
