import { BoxIconLine } from "../../icons";
import { FaDollarSign } from "react-icons/fa";

interface InvoiceStatsProps {
  stats: {
    totalInvoices: number;
    totalAmount: number;
    monthlyRevenue: number;
    validInvoices: number;
  };
}

export default function InvoiceMetrics({ stats }: InvoiceStatsProps) {
  const metrics = [
    {
      label: "Tổng hoá đơn",
      value: stats.totalInvoices,
      icon: <BoxIconLine />,
    },
    {
      label: "Hoá đơn hợp lệ",
      value: stats.validInvoices,
      icon: <BoxIconLine />,
    },
    {
      label: "Doanh thu tháng này",
      value: stats.monthlyRevenue,
      isCurrency: true,
      icon: <FaDollarSign />,
    },
    {
      label: "Tổng doanh thu",
      value: stats.totalAmount,
      isCurrency: true,
      icon: <FaDollarSign />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="rounded-2xl bg-gray-50 dark:bg-gray-900 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition"
        >
          <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
            {metric.icon}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {metric.label}
          </p>
          <h4 className="mt-1 font-mono text-xl font-semibold text-gray-800 dark:text-white">
            {metric.isCurrency
              ? metric.value
                  .toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                  .replace("₫", "VNĐ")
              : metric.value.toLocaleString()}
          </h4>
        </div>
      ))}
    </div>
  );
}
