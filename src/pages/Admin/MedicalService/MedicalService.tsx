import { useEffect } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import BasicTableOne from "../../../components/tables/BasicTables/BasicTableOne";
import useMedicalService from "../../../hooks/medical-service/useMedicalService";
import CustomTableDemo from "./CustomTableDemo";

export default function MecicalService() {
  const {
    fetchAllMedicalServices,
    loading,
    setLoading,
    medicalServices,
    setMedicalServices,
  } = useMedicalService();

  useEffect(() => {
    fetchAllMedicalServices();
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      {/* <PageBreadcrumb pageTitle="Quản lý dịch vụ khám" /> */}
      {/* <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <BasicTableOne />
        </ComponentCard>
      </div> */}
      <CustomTableDemo />
    </>
  );
}
