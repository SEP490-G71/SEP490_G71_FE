import { BoxIconLine, GroupIcon } from "../../icons";
import { FaDollarSign } from "react-icons/fa";

export interface EcommerceStatsProps {
  stats: {
    totalInvoices: number;
    paidInvoices: number;
    totalRevenue: number;
    totalMedicalRecords: number;
    newPatientsThisMonth: number;
  };
}

export default function EcommerceMetrics({ stats }: EcommerceStatsProps) {
  const metrics = [
    {
      label: "Tổng hoá đơn",
      value: stats.totalInvoices || 0,
      isCurrency: false,
      icon: <BoxIconLine />,
    },
    {
      label: "Hoá đơn đã thanh toán",
      value: stats.paidInvoices || 0,
      isCurrency: false,
      icon: <BoxIconLine />,
    },
    {
      label: "Doanh thu",
      value: stats.totalRevenue || 0,
      isCurrency: true,
      icon: <FaDollarSign />,
    },
    {
      label: "Tổng hồ sơ bệnh án",
      value: stats.totalMedicalRecords || 0,
      isCurrency: false,
      icon: <GroupIcon />,
    },
    {
      label: "Bệnh nhân mới trong tháng",
      value: stats.newPatientsThisMonth || 0,
      isCurrency: false,
      icon: <GroupIcon />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="rounded-2xl bg-gray-50 dark:bg-gray-900 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition"
        >
          <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
            {metric.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 min-h-[20px]">
              {metric.label}
            </p>
            <h4 className="mt-1 font-mono text-xl font-semibold text-gray-800 dark:text-white min-h-[32px]">
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
        </div>
      ))}
    </div>
  );
}
