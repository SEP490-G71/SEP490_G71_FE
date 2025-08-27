import { Outlet, Navigate } from "react-router";
import { useInShift } from "../../hooks/workSchedule/useInShift";

export default function ProtectedInShiftOutlet() {
  const { inShift, loading } = useInShift();

  if (loading) {
    return <div className="p-6 text-center">Đang kiểm tra ca làm...</div>;
  }

  if (inShift === false) {
    return <Navigate to="/admin/work-schedule-staff" replace />;
  }
  return <Outlet />;
}
