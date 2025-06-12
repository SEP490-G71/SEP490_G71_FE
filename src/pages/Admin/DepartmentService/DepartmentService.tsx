import { useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";
import DepartmentServicePage from "./DepartmentServicePage";
import useDepartmentService from "../../../hooks/department-service/useDepartmentService";

export default function DepartmentService() {
  const {
    fetchAllDepartments,
    loading,
    setLoading,
    departments,
    setDepartments,
  } = useDepartmentService();

  useEffect(() => {
    fetchAllDepartments();
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />

      <DepartmentServicePage />
    </>
  );
}
