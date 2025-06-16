import PageMeta from "../../../components/common/PageMeta";
import StaffsServicePage from "./StaffsServicePage";

export default function StaffsService() {
  return (
    <>
      <PageMeta
        title="Quản lý nhân viên | Admin Dashboard"
        description="Trang quản lý nhân viên trong hệ thống"
      />

      <StaffsServicePage />
    </>
  );
}
