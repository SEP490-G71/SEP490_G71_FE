import { useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";
import MedicalServicePage from "./MedicalServicePage";
import useMedicalService from "../../../hooks/medical-service/useMedicalService";

export default function MecicalService() {
  const { fetchAllMedicalServices } = useMedicalService();

  useEffect(() => {
    fetchAllMedicalServices();
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <MedicalServicePage />
    </>
  );
}
