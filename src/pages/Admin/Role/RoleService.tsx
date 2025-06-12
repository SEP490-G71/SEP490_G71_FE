import { useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";
import RolePage from "./RolePage";
import useRoleService from "../../../hooks/role/useRoleService";

export default function RoleService() {
  const { fetchAllRoles } = useRoleService();

  useEffect(() => {
    fetchAllRoles();
  }, []);

  return (
    <>
      <PageMeta
        title="Quản lý vai trò | Admin Dashboard"
        description="Trang quản lý vai trò (Role) trong hệ thống Admin Dashboard"
      />
      <RolePage />
    </>
  );
}
