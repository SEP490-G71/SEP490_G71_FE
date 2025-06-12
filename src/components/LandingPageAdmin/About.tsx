import { Container, Text } from "@mantine/core";

export default function About() {
  return (
    <Container
      size="md"
      className="flex flex-col items-center text-center py-16"
    >
      {/* Title */}
      <h2 className="text-[32px] md:text-[40px] text-blue-900 font-bold leading-relaxed mb-8">
        Chuyển đổi số: Nhu cầu cấp thiết của ngành y tế Việt Nam
      </h2>

      {/* Optional Sub-title */}
      <p className="text-blue-600 text-lg font-medium mb-4">
        Giải pháp số cho phòng khám nhỏ và vừa
      </p>

      {/* Body Text */}
      <Text
        size="md"
        className="text-gray-700 max-w-2xl text-center leading-relaxed"
      >
        Chuyển đổi số đang là xu hướng tất yếu trong nhiều lĩnh vực tại Việt
        Nam, đặc biệt trong ngành y tế — nơi mà sự chính xác, tốc độ và trải
        nghiệm bệnh nhân ngày càng được chú trọng. Tuy nhiên, tại các phòng khám
        nhỏ và vừa, tỷ lệ ứng dụng chuyển đổi số còn hạn chế do chi phí cao và
        sự phức tạp của các hệ thống hiện tại.
        <br />
        <br />
        Nhằm giải quyết bài toán này, MedSoft cung cấp nền tảng web tối ưu hỗ
        trợ đặt lịch trực tuyến, quản lý hồ sơ bệnh án điện tử, theo dõi điều
        trị và thanh toán. Giải pháp giúp các phòng khám nhỏ và vừa dễ dàng tiếp
        cận công nghệ hiện đại, tối ưu vận hành, nâng cao năng lực cạnh tranh và
        mang lại trải nghiệm y tế tốt hơn cho người dân.
      </Text>
    </Container>
  );
}
