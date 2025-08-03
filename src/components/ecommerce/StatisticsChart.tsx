import { useDashboard } from "../../hooks/DashBoard/useDashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useEffect } from "react";

export default function StatisticsChart() {
  const { stats, fetchDashboardStats } = useDashboard();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const workPerformance = stats?.workPerformance || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Hiệu suất làm việc nhân viên
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-theme-xs text-start text-gray-500 dark:text-gray-400"
              >
                Tên nhân viên
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-theme-xs text-start text-gray-500 dark:text-gray-400"
              >
                Mã NV
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-theme-xs text-start text-gray-500 dark:text-gray-400"
              >
                Ca làm
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-theme-xs text-start text-gray-500 dark:text-gray-400"
              >
                Ca nghỉ
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-theme-xs text-start text-gray-500 dark:text-gray-400"
              >
                Tỷ lệ đi làm (%)
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {workPerformance.map((staff, index) => (
              <TableRow key={index}>
                <TableCell className="py-3 text-theme-sm text-gray-800 dark:text-white/90">
                  {staff.staffName}
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {staff.staffCode}
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-800 dark:text-white/90">
                  {staff.attendedShifts}
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {staff.leaveShifts}
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {staff.attendanceRate.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
