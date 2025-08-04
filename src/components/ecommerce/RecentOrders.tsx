import { TopService } from "../../hooks/DashBoard/useDashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Props {
  topServices: TopService[];
}

export default function RecentOrders({ topServices }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Dịch vụ được sử dụng nhiều nhất
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
                Mã dịch vụ
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-theme-xs text-start text-gray-500 dark:text-gray-400"
              >
                Tên dịch vụ
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-theme-xs text-start text-gray-500 dark:text-gray-400"
              >
                Lượt sử dụng
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-theme-xs text-start text-gray-500 dark:text-gray-400"
              >
                Doanh thu
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {topServices.map((service, index) => (
              <TableRow key={index}>
                <TableCell className="py-3 text-theme-sm text-gray-800 dark:text-white/90">
                  {service.serviceName}
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-800 dark:text-white/90">
                  {service.serviceCode}
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {service.usageCount}
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {service.revenue.toLocaleString("vi-VN")} ₫
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
