import { useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";
import StaffsServicePage from "./StaffsServicePage";
import useStaffss from "../../../hooks/staffs-service/useStaffs";

export default function StaffsService() {
  const { fetchStaffs, loading, staffs, setStaffs, totalItems, setLoading } =
    useStaffss();

  useEffect(() => {
    fetchStaffs();
  }, []);

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
