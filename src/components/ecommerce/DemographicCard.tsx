import { useDashboard } from "../../hooks/DashBoard/useDashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useEffect } from "react";

export default function DemographicCard() {
  const { stats, fetchDashboardStats } = useDashboard();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const birthdays = stats?.birthdaysToday || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Danh sách bệnh nhân có sinh nhật hôm nay 🎂
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
                Họ tên
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-theme-xs text-start text-gray-500 dark:text-gray-400"
              >
                Mã BN
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-theme-xs text-start text-gray-500 dark:text-gray-400"
              >
                Ngày sinh
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-theme-xs text-start text-gray-500 dark:text-gray-400"
              >
                SĐT
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-theme-xs text-start text-gray-500 dark:text-gray-400"
              >
                Email
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {birthdays.map((patient, index) => (
              <TableRow key={index}>
                <TableCell className="py-3 text-theme-sm text-gray-800 dark:text-white/90">
                  {patient.fullName}
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {patient.patientCode}
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-800 dark:text-white/90">
                  {new Date(patient.dob).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {patient.phone}
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {patient.email}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
