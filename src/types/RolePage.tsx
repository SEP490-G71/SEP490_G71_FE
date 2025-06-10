export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  resource: string; // ví dụ: 'Cơ sở', 'Dịch vụ'...
  actions: string[]; // ['view', 'create', 'update', 'delete', 'custom']
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions: Permission[];
}
