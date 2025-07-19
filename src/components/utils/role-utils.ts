// chỉnh lại nếu path khác
import { RoleType } from "../../enums/Role/RoleType";
import { NavItem } from ""; // hoặc tách NavItem ra type riêng

const scopeToRoleMap: Record<string, RoleType> = {
  ROLE_ADMIN: RoleType.ADMIN,
  ROLE_DOCTOR: RoleType.DOCTOR,
  ROLE_CASHIER: RoleType.CASHIER,
  ROLE_RECEPTIONIST: RoleType.RECEPTIONIST,
  ROLE_TECHNICIAN: RoleType.TECHNICIAN,
  ROLE_PATIENT: RoleType.PATIENT,
};

export const getCombinedNavItems = (
  scopes: string[],
  navItemsByRole: Record<RoleType, NavItem[]>
): NavItem[] => {
  const roles = scopes
    .map((s) => scopeToRoleMap[s])
    .filter(Boolean) as RoleType[];

  const mergedItems = roles.flatMap((r) => navItemsByRole[r]);

  const unique = new Map<string, NavItem>();
  for (const item of mergedItems) {
    const key = item.path || item.name;
    if (!unique.has(key)) {
      unique.set(key, item);
    }
  }

  return Array.from(unique.values());
};
