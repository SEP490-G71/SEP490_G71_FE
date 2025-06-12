// types/RolePage.ts

export interface PermissionResponse {
  name: string;
  description?: string;
}

export interface GroupedPermissionResponse {
  groupName: string;
  permissions: PermissionResponse[];
}

export interface RoleRequest {
  name: string;
  description: string;
  permissions: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: PermissionResponse[];
}
