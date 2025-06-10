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
        Nam, đặc biệt trong ngành y tế - nơi mà sự chính xác, tốc độ và trải
        nghiệm bệnh nhân ngày càng được chú trọng.
        <br />
        <br />
        Tại Việt Nam, nhu cầu chuyển đổi số trong lĩnh vực y tế ngày càng tăng,
        đặc biệt ở các phòng khám nhỏ và vừa. Tuy nhiên, tỷ lệ ứng dụng còn hạn
        chế do chi phí cao và sự phức tạp của các hệ thống hiện tại, trong khi
        phần lớn cơ sở y tế là các phòng khám nhỏ.
        <br />
        <br />
        Nhằm giải quyết bài toán này, MedSoft mang đến nền tảng web tối ưu cho
        các phòng khám nhỏ và vừa, hỗ trợ đặt lịch trực tuyến, quản lý hồ sơ
        bệnh án điện tử, theo dõi điều trị và quy trình thanh toán, góp phần
        nâng cao chất lượng dịch vụ và thúc đẩy chuyển đổi số y tế.
        <br />
        <br />
        MedSoft không chỉ giúp các phòng khám nhỏ và vừa tiếp cận công nghệ hiện
        đại một cách dễ dàng, mà còn mở ra cơ hội nâng cao năng lực cạnh tranh,
        tối ưu hoá vận hành và mang lại trải nghiệm y tế tốt hơn cho người dân.
      </Text>
    </Container>
  );
}
