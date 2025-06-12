import { useState } from "react";

const departments = [
  {
    id: "cardiology",
    title: "Tim mạch",
    subtitle:
      "Chẩn đoán và điều trị các bệnh lý về tim, mạch máu và hệ tuần hoàn",
    description:
      "Khoa Tim mạch cung cấp dịch vụ khám và điều trị cho các bệnh nhân mắc bệnh lý tim bẩm sinh, suy tim, rối loạn nhịp tim và các bệnh mạch vành. Đội ngũ bác sĩ nhiều kinh nghiệm cùng với trang thiết bị hiện đại giúp chẩn đoán chính xác và can thiệp hiệu quả.",
    image: "/public/images/LandingPageUser/department/departments-1.jpg",
  },
  {
    id: "neurology",
    title: "Thần kinh",
    subtitle: "Khám và điều trị bệnh lý liên quan đến hệ thần kinh trung ương",
    description:
      "Khoa Thần kinh chuyên điều trị các bệnh như đau nửa đầu, động kinh, đột quỵ, Parkinson và các rối loạn thần kinh khác. Chúng tôi áp dụng các phương pháp chẩn đoán hiện đại và các phác đồ điều trị cá nhân hóa cho từng bệnh nhân.",
    image: "/images/LandingPageUser/department/departments-2.jpg",
  },
  {
    id: "hepatology",
    title: "Gan mật",
    subtitle: "Chẩn đoán và quản lý các bệnh về gan, túi mật và tụy",
    description:
      "Khoa Gan mật tập trung vào điều trị các bệnh lý viêm gan virus, xơ gan, gan nhiễm mỡ, bệnh lý túi mật và các khối u gan. Đội ngũ bác sĩ tận tâm sẽ theo dõi sát sao quá trình điều trị và phục hồi chức năng gan cho bệnh nhân.",
    image: "/images/LandingPageUser/department/departments-3.jpg",
  },
  {
    id: "pediatrics",
    title: "Nhi khoa",
    subtitle: "Chăm sóc sức khỏe toàn diện cho trẻ sơ sinh và trẻ nhỏ",
    description:
      "Khoa Nhi cung cấp dịch vụ khám, tư vấn và điều trị các bệnh lý cấp và mãn tính ở trẻ em. Bác sĩ nhi giàu kinh nghiệm cùng không gian thân thiện với trẻ giúp quá trình điều trị trở nên nhẹ nhàng và hiệu quả hơn.",
    image: "/images/LandingPageUser/department/departments-4.jpg",
  },
  {
    id: "eye-care",
    title: "Mắt",
    subtitle: "Khám mắt định kỳ, điều trị các bệnh lý và phẫu thuật khúc xạ",
    description:
      "Khoa Mắt chuyên điều trị các bệnh lý như cận thị, loạn thị, viễn thị, đục thủy tinh thể và các vấn đề võng mạc. Trang thiết bị đo khám hiện đại cùng phẫu thuật chính xác giúp cải thiện thị lực tối ưu cho bệnh nhân.",
    image: "/images/LandingPageUser/department/departments-5.jpg",
  },
];

export const DepartmentsSection = () => {
  const [activeDept, setActiveDept] = useState(departments[0]);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-900 mb-2">
          Các chuyên khoa
        </h2>
        <div className="h-1 w-24 bg-blue-500 mx-auto mb-4" />
        <p className="text-gray-600">
          Các chuyên khoa tại bệnh viện áp dụng công nghệ y tế tiên tiến, hỗ trợ
          chẩn đoán chính xác và điều trị hiệu quả theo tiêu chuẩn quốc tế.
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 space-y-4">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setActiveDept(dept)}
              className={`block text-left font-bold text-xl transition-colors ${
                activeDept.id === dept.id
                  ? "text-blue-600"
                  : "text-gray-800 hover:text-blue-500"
              }`}
            >
              {dept.title}
            </button>
          ))}
        </div>

        <div className="flex-1">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 border-l pl-6 pr-6">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                {activeDept.title}
              </h3>
              <p className="italic text-gray-500 mb-4">{activeDept.subtitle}</p>
              <p className="text-gray-700 leading-relaxed">
                {activeDept.description}
              </p>
            </div>

            <img
              src={activeDept.image}
              alt={activeDept.title}
              className="w-full max-w-sm rounded-md shadow-md object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
