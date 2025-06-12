// hooks/permission/usePermissionService.ts
import axiosInstance from "../../services/axiosInstance";
import { GroupedPermissionResponse } from "../../types/Admin/Role/RolePage";

export default function usePermissionService() {
  const fetchGroupedPermissions = async (): Promise<
    GroupedPermissionResponse[]
  > => {
    const response = await axiosInstance.get("/permissions/grouped");
    console.log("Fetched grouped permissions:", response.data);

    return response.data.result;
  };

  return { fetchGroupedPermissions };
}
