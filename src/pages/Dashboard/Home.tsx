import { useEffect } from "react";
import { useDashboard } from "../../hooks/DashBoard/useDashboard";
import { useChatHistory } from "../../hooks/DashBoard/useChat";

import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import PageMeta from "../../components/common/PageMeta";
import ChatbotWidget from "../../components/ecommerce/ChatbotWidget";
import DemographicCard from "../../components/ecommerce/DemographicCard";

export default function Home() {
  const { stats, fetchDashboardStats } = useDashboard();
  const { messages, fetchChatHistory, setMessages } = useChatHistory();

  useEffect(() => {
    fetchDashboardStats();
    fetchChatHistory();
  }, []);

  if (!stats) return null;
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard"
        description="React.js Dashboard page"
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 xl:col-span-12 space-y-6">
          <EcommerceMetrics stats={stats} />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <MonthlySalesChart />
        </div>
        <div className="col-span-12 xl:col-span-5">
          {stats.monthlyTarget && (
            <MonthlyTarget target={stats.monthlyTarget} />
          )}
        </div>

        <div className="col-span-12 xl:col-span-7">
          {stats.topServices && (
            <RecentOrders topServices={stats.topServices} />
          )}
        </div>

        <div className="col-span-12 xl:col-span-5">
          <StatisticsChart />
        </div>

        <div className="col-span-12">
          <DemographicCard />
        </div>
      </div>

      <ChatbotWidget messages={messages} setMessages={setMessages} />
    </>
  );
}
