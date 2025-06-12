import { useState } from "react";

const doctors = [
  {
    name: "Trần Văn C",
    position: "Giám đốc Y khoa",
    description: "Chuyên gia trong lĩnh vực điều trị và quản lý chuyên môn.",
    image: "/images/LandingPageUser/doctor/doctors-1.jpg",
  },
  {
    name: "Lê Thị D",
    position: "Gây mê hồi sức",
    description:
      "Hơn 10 năm kinh nghiệm trong gây mê cho các ca phẫu thuật lớn.",
    image: "/images/LandingPageUser/doctor/doctors-1.jpg",
  },
  {
    name: "Cao Minh H",
    position: "Tim mạch",
    description:
      "Chuyên điều trị các bệnh lý mạch vành, cao huyết áp, suy tim.",
    image: "/images/LandingPageUser/doctor/doctors-1.jpg",
  },
  {
    name: "nguyễn Văn K",
    position: "Ngoại thần kinh",
    description: "Đảm nhận phẫu thuật não, tủy sống và các rối loạn thần kinh.",
    image: "/images/LandingPageUser/doctor/doctors-1.jpg",
  },
  {
    name: "Nguyễn Văn A",
    position: "Tai mũi họng",
    description:
      "Chuyên khám và điều trị bệnh lý tai mũi họng trẻ em & người lớn.",
    image: "/images/LandingPageUser/doctor/doctos-1.jpg",
  },
  {
    name: "Trần Thị B",
    position: "Da liễu",
    description: "Chuyên gia trong điều trị mụn, sẹo và các bệnh lý da khác.",
    image: "/images/LandingPageUser/doctor/doctors-1.jpg",
  },
];

export const DoctorsSection = () => {
  const doctorsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  const startIndex = (currentPage - 1) * doctorsPerPage;
  const currentDoctors = doctors.slice(startIndex, startIndex + doctorsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-900 mb-2">
          Danh sách bác sĩ
        </h2>
        <div className="h-1 w-24 bg-blue-500 mx-auto mb-4" />
        <p className="text-gray-600">
          Đội ngũ bác sĩ giàu kinh nghiệm luôn sẵn sàng đồng hành cùng bạn trong
          hành trình chăm sóc sức khỏe.
        </p>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {currentDoctors.map((doc, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex gap-6 items-center"
          >
            <img
              src={doc.image}
              alt={doc.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-200"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-900">{doc.name}</h3>
              <p className="text-gray-700 font-semibold mb-2">{doc.position}</p>
              <p className="text-gray-600 text-sm">{doc.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm border rounded disabled:opacity-40"
          >
            Trước
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 text-sm border rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm border rounded disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      )}
    </section>
  );
};
