const feedbacks = [
  {
    content:
      "Từ khi áp dụng phần mềm, lịch hẹn của tôi và các bác sĩ trong phòng khám được quản lý rất rõ ràng. Phần mềm còn tự động gửi nhắc lịch cho bệnh nhân qua SMS và email nên số ca khám bị lỡ giảm hẳn. Nhờ vậy, chúng tôi có thể tập trung vào chuyên môn thay vì xử lý các vấn đề phát sinh.",
    name: "Chị A",
    role: "Bác sĩ",
    avatar: "/images/feedback-1.jpg",
  },
  {
    content:
      "Là người quản lý phòng khám, tôi rất hài lòng với các báo cáo doanh thu, chi phí mà phần mềm cung cấp. Tôi có thể theo dõi tình hình tài chính hàng ngày, dễ dàng lập kế hoạch và ra quyết định kịp thời. Ngoài ra, tính năng phân quyền giúp tôi kiểm soát rõ ràng các quyền truy cập của từng nhân viên.",
    name: "Anh A",
    role: "Quản lý",
    avatar: "/images/feedback-2.jpg",
  },
  {
    content:
      "Việc lưu trữ hồ sơ bệnh án giờ đây trở nên rất an toàn và dễ dàng. Tôi có thể tra cứu thông tin bệnh nhân mọi lúc, mọi nơi. Bên cạnh đó, hệ thống giúp tôi có cái nhìn tổng thể về tình hình hoạt động của phòng khám, hỗ trợ rất tốt cho việc ra quyết định của ban giám đốc.",
    name: "Chị B",
    role: "Giám đốc",
    avatar: "/images/feedback-3.jpg",
  },
];

const FeedBack = () => {
  return (
    <div className="py-30 px-4 max-w-7xl mx-auto">
      <h2
        className="text-center font-bold mb-10"
        style={{
          fontWeight: 700,
          fontSize: "2.25rem",
          lineHeight: 1.2,
          color: "#1f2937",
          letterSpacing: "0.05em",
        }}
      >
        KHÁCH HÀNG NÓI GÌ VỀ MedSoft
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {feedbacks.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-between h-full rounded-xl shadow-md overflow-hidden bg-white"
          >
            <div className="p-6 flex-1">
              <div className="text-red-500 text-4xl mb-4">“</div>
              <p className="text-gray-700 text-sm">{item.content}</p>
            </div>

            {/* phần nền đỏ + avatar */}
            <div className="relative bg-red-500 p-6 mt-6 rounded-t-[100px] flex flex-col items-center">
              <div className="absolute -top-10">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-20 h-20 rounded-full border-4 border-white object-cover"
                />
              </div>
              <div className="mt-12 text-white text-center">
                <p className="font-bold text-base">{item.name}</p>
                <p className="text-sm">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedBack;
