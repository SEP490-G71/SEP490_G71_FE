// hooks/permission/usePermissionService.ts
import axiosInstance from "../../services/axiosInstance";
import {
  GroupedPermissionResponse,
  PermissionResponse,
} from "../../types/Admin/Role/RolePage";

export default function usePermissionService() {
  const fetchGroupedPermissions = async (): Promise<
    GroupedPermissionResponse[]
  > => {
    const response = await axiosInstance.get("/permissions/grouped");
    return response.data.result;
  };

  const fetchAllPermissions = async (): Promise<PermissionResponse[]> => {
    const response = await axiosInstance.get("/permissions");
    return response.data.result;
  };

  const fetchPermissionByName = async (
    name: string
  ): Promise<PermissionResponse | null> => {
    try {
      const response = await axiosInstance.get(`/permissions/${name}`);
      return response.data.result;
    } catch (error) {
      console.error("Failed to fetch permission:", error);
      return null;
    }
  };

  const createPermission = async (
    data: PermissionResponse & { groupName: string }
  ) => {
    await axiosInstance.post("/permissions", data);
  };

  const updatePermission = async (
    name: string,
    data: Partial<PermissionResponse> & { groupName?: string }
  ) => {
    await axiosInstance.put(`/permissions/${name}`, data);
  };

  const deletePermission = async (name: string) => {
    await axiosInstance.delete(`/permissions/${name}`);
  };

  return {
    fetchGroupedPermissions,
    fetchAllPermissions,
    fetchPermissionByName,
    createPermission,
    updatePermission,
    deletePermission,
  };
}
