import { useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDashboard } from "../../hooks/DashBoard/useDashboard";

export default function MonthlySalesChart() {
  const { stats, fetchDashboardStats } = useDashboard();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (!stats) {
    return (
      <div className="p-4 text-center text-gray-500">
        Đang tải biểu đồ doanh thu...
      </div>
    );
  }

  const revenueCategories = stats?.monthlyRevenueStats?.labels || [];
  const revenueData = stats?.monthlyRevenueStats?.data || [];

  const invoiceCategories = stats?.monthlyInvoiceStats?.labels || [];
  const invoiceData = stats?.monthlyInvoiceStats?.data || [];

  const revenueOptions: ApexOptions = {
    colors: ["#3b82f6"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: revenueCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { title: { text: undefined } },
    legend: { show: false },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (val: number) =>
          val
            .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
            .replace("₫", "VNĐ"),
      },
    },
  };

  const invoiceOptions: ApexOptions = {
    colors: ["#10b981"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 180,
      toolbar: { show: false },
    },
    dataLabels: { enabled: true },
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories: invoiceCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { title: { text: undefined } },
    legend: { show: false },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toLocaleString()} hóa đơn`,
      },
    },
  };

  const revenueSeries = [{ name: "Doanh thu", data: revenueData }];
  const invoiceSeries = [{ name: "Số hóa đơn", data: invoiceData }];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Thống kê theo tháng
        </h3>
        <div className="relative inline-block">
          {/* <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button> */}
          {/* <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem onItemClick={closeDropdown}>Xem thêm</DropdownItem>
            <DropdownItem onItemClick={closeDropdown}>Xoá</DropdownItem>
          </Dropdown> */}
        </div>
      </div>

      {/* Biểu đồ 1: Doanh thu */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
          Doanh thu theo tháng (VNĐ)
        </h4>
        <Chart
          options={revenueOptions}
          series={revenueSeries}
          type="bar"
          height={180}
        />
      </div>

      {/* Biểu đồ 2: Số lượng hóa đơn */}
      <div>
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
          Số hóa đơn theo tháng
        </h4>
        <Chart
          options={invoiceOptions}
          series={invoiceSeries}
          type="line"
          height={180}
        />
      </div>
    </div>
  );
}
