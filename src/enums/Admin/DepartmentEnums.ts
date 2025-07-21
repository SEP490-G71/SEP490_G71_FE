export enum DepartmentType {
  CONSULTATION = "CONSULTATION",
  LABORATORY = "LABORATORY",
  ADMINISTRATION = "ADMINISTRATION",
}
export const DepartmentTypeLabel: Record<DepartmentType, string> = {
  [DepartmentType.CONSULTATION]: "Khám bệnh",
  [DepartmentType.LABORATORY]: "Phòng thí nghiệm",
  [DepartmentType.ADMINISTRATION]: "Quản lý",
};