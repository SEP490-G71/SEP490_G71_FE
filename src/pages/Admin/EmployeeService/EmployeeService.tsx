import { useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";

import EmployeeServicePage from "./EmployeeServicePage";
import useEmployees from "../../../hooks/employee-service/useEmployee";

export default function EmployeeService() {
  const {
    fetchEmployees,
    loading,
    employees,
    setEmployees,
    totalItems,
    setLoading,
  } = useEmployees();

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <>
      <PageMeta
        title="Quản lý nhân viên | Admin Dashboard"
        description="Trang quản lý nhân viên trong hệ thống"
      />

      {/* Có thể thêm Breadcrumb nếu cần */}
      {/* <PageBreadcrumb pageTitle="Quản lý nhân viên" /> */}

      <EmployeeServicePage />
    </>
  );
}
