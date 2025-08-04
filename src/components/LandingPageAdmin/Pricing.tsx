import { CheckCircle2 } from "lucide-react";
import useServicePackages from "../../hooks/LangdingPagesAdmin/useServicePackages";
import { formatCurrency } from "../../hooks/LangdingPagesAdmin/formatCurrency";
import { ServicePackage } from "../../types/Admin/LandingPageAdmin/ServicePackage";
import { useEffect } from "react";

export const Pricing = ({
  onRegisterClick,
}: {
  onRegisterClick: (packageId: string) => void;
}) => {
  const { servicePackages, loading, fetchServicePackages } =
    useServicePackages();
  useEffect(() => {
    fetchServicePackages();
  }, []);

  const featuresByPackage: Record<
    string,
    { text: string; isIncluded: boolean }[]
  > = {
    "Gói 3 tháng": [
      { text: "Quản lý lịch hẹn cơ bản", isIncluded: true },
      { text: "Hỗ trợ khách hàng 24/7", isIncluded: true },
      { text: "Thống kê đơn giản", isIncluded: true },
      { text: "Báo cáo tài chính nâng cao", isIncluded: false },
      { text: "Tự động gửi email nhắc lịch", isIncluded: false },
    ],
    "Gói 6 tháng": [
      { text: "Quản lý lịch hẹn cơ bản", isIncluded: true },
      { text: "Hỗ trợ khách hàng 24/7", isIncluded: true },
      { text: "Thống kê đơn giản", isIncluded: true },
      { text: "Báo cáo tài chính nâng cao", isIncluded: true },
      { text: "Tự động gửi email nhắc lịch", isIncluded: false },
    ],
    "Gói 12 tháng": [
      { text: "Quản lý lịch hẹn cơ bản", isIncluded: true },
      { text: "Hỗ trợ khách hàng 24/7", isIncluded: true },
      { text: "Thống kê đơn giản", isIncluded: true },
      { text: "Báo cáo tài chính nâng cao", isIncluded: true },
      { text: "Tự động gửi email nhắc lịch", isIncluded: true },
    ],
    "Gói dùng thử": [
      { text: "Quản lý lịch hẹn cơ bản", isIncluded: true },
      { text: "Hỗ trợ khách hàng 24/7", isIncluded: false },
      { text: "Thống kê đơn giản", isIncluded: false },
      { text: "Báo cáo tài chính nâng cao", isIncluded: false },
      { text: "Tự động gửi email nhắc lịch", isIncluded: false },
    ],
  };

  return (
    <div className="mt-20">
      <h2
        className="text-3xl sm:text-5xl lg:text-6xl text-center my-8 tracking-wide"
        style={{
          fontWeight: 700,
          fontSize: "2.25rem",
          lineHeight: 1.2,
          color: "#1f2937",
          letterSpacing: "0.05em",
        }}
      >
        Bảng giá
      </h2>

      {loading ? (
        <p className="text-center">Đang tải...</p>
      ) : (
        <div className="flex flex-wrap">
          {servicePackages.map((option: ServicePackage) => (
            <div key={option.id} className="w-full sm:w-1/2 lg:w-1/4 p-2">
              {/* ✅ SỬA: dùng flex-col h-full để cố định chiều cao + đều nút */}
              <div className="flex flex-col h-full border border-neutral-700 rounded-xl min-h-[500px] p-6">
                {/* Phần tiêu đề + giá */}
                <div>
                  <p className="text-2xl font-semibold mb-4 break-words">
                    {option.packageName}
                  </p>
                  <p className="mb-4">
                    <span className="text-4xl font-bold mr-2">
                      {formatCurrency(option.price)}
                    </span>
                    <span className="text-neutral-400">
                      /{option.billingType === "MONTHLY" ? "Tháng" : "Năm"}
                    </span>
                  </p>
                </div>

                <div className="flex-grow">
                  <ul className="text-base space-y-3 break-words">
                    {featuresByPackage[option.packageName]?.map(
                      (feature, idx) => (
                        <li key={idx} className="flex items-start">
                          {feature.isIncluded ? (
                            <CheckCircle2
                              className="mt-1 text-blue-600"
                              size={18}
                            />
                          ) : (
                            <span className="mt-1 text-gray-400 text-lg">
                              ✖
                            </span>
                          )}
                          <span
                            className={`ml-2 ${
                              feature.isIncluded
                                ? ""
                                : "line-through text-gray-400"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </li>
                      )
                    )}
                  </ul>

                  {option.packageName === "Gói 3 tháng" && (
                    <p className="mt-2 text-sm text-gray-400">
                      Phù hợp cho phòng khám nhỏ muốn thử nghiệm hệ thống.
                    </p>
                  )}
                  {option.packageName === "Gói 6 tháng" && (
                    <p className="mt-2 text-sm text-gray-400">
                      Tiết kiệm hơn 15% so với gói 3 tháng.
                    </p>
                  )}
                  {option.packageName === "Gói 12 tháng" && (
                    <p className="mt-2 text-sm text-gray-400">
                      Ưu đãi dài hạn – tiết kiệm đến 35% chi phí.
                    </p>
                  )}
                  {option.packageName === "Gói dùng thử" && (
                    <p className="mt-2 text-sm text-gray-400">
                      Trải nghiệm toàn bộ tính năng miễn phí.
                    </p>
                  )}
                </div>

                {/* Button */}
                <div className="mt-6">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onRegisterClick(option.id);
                    }}
                    className="inline-flex justify-center items-center text-center w-full h-12 text-lg font-medium hover:bg-orange-900 border border-orange-900 rounded-lg transition duration-200"
                  >
                    Đăng ký
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
