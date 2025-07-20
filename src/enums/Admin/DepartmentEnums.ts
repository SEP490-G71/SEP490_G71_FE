export enum DepartmentType {
  CONSULTATION = "CONSULTATION",
  LABORATORY = "LABORATORY",
  ADMINISTRATION = "ADMINISTRATION",
}
export const DepartmentTypeLabel: Record<DepartmentType, string> = {
  [DepartmentType.CONSULTATION]: "KHÁM BỆNH",
  [DepartmentType.LABORATORY]: "PHÒNG THÍ NGHIỆM",
  [DepartmentType.ADMINISTRATION]: "QUẢN LÝ",
};