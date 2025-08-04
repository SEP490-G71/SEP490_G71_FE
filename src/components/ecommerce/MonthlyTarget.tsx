import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface MonthlyTargetProps {
  target: {
    targetAmount: number;
    currentAmount: number;
    progressPercent: number;
  };
}

export default function MonthlyTarget({ target }: MonthlyTargetProps) {
  const series = [target.progressPercent];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Tiến độ"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Mục tiêu tháng
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Mục tiêu doanh thu bạn đã đặt cho tháng này
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="max-h-[330px]" id="chartDarkStyle">
            <Chart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            +{target.progressPercent}%
          </span>
        </div>

        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          Bạn đã đạt{" "}
          {((target.currentAmount / target.targetAmount) * 100).toFixed(2)}% mục
          tiêu tháng này. Tiếp tục cố gắng nhé!
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Mục tiêu
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {target.targetAmount
              .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
              .replace("₫", "VNĐ")}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Doanh thu hiện tại
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {target.currentAmount
              .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
              .replace("₫", "VNĐ")}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Trung bình/ngày
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {Number((target.currentAmount / 30).toFixed(0))
              .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
              .replace("₫", "VNĐ")}
          </p>
        </div>
      </div>
      <p className="mt-2 pb-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Hãy duy trì phong độ hiện tại để đạt được mục tiêu sớm nhất. Đừng quên
        theo dõi tiến độ hằng ngày để đảm bảo hiệu suất ổn định và đạt mục tiêu
        doanh thu đã đề ra!
      </p>
    </div>
  );
}
