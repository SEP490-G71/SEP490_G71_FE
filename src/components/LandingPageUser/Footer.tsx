import { FaFacebookF, FaYoutube, FaTiktok } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

export const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {/* Cột 1: Thông tin công ty */}
        <div>
          <p className="font-bold mb-2">Bệnh viên Đa khoa Quốc tế MedSoft</p>
          <p>
            ĐKKD số: <strong>0101816147</strong> - Sở KHĐT Hà Nội cấp ngày
            27/11/2019
          </p>
          <p>
            Giấy phép số: <strong>234/BYT-GPHD</strong> cấp ngày 24/09/2018
          </p>
          <p>Địa chỉ: Số 9, Phố Viên, Cổ Nhuế 2, Bắc Từ Liêm, Hà Nội</p>
          <p>Email: medsoft@gmail.com</p>
          <p className="font-bold mt-2">
            Tổng đài tư vấn: <span className="text-blue-700">19001806</span>
          </p>
        </div>

        {/* Cột 2: Giờ làm việc */}
        <div>
          <h4 className="font-bold mb-3">Bệnh viên Đa khoa Quốc tế MedSoft</h4>
          <p>ĐC: Số 9, Phố Viên, Cổ Nhuế 2, Bắc Từ Liêm, Hà Nội</p>
          <h4 className="font-bold mt-4 mb-2">GIỜ LÀM VIỆC</h4>
          <p className="font-semibold">Tại phòng khám:</p>
          <p>T2 - T7: Khám Nội: 6h30 - 19h</p>
          <p>Khám Sản: 7h - 19h</p>
          <p>Khám Ngoại, Nhi, TMH, PHCN: 7h30 - 19h</p>
          <p className="text-sm italic">CN: 6h30 - 16h30</p>
          <p className="font-semibold mt-2">Tại nhà thuốc:</p>
          <p>T2 - CN: 7h30 - 20h</p>
          <p className="font-semibold">Cấp cứu: 24/24</p>
        </div>

        {/* Cột 3: Liên hệ nhanh */}
        <div>
          <h4 className="font-bold mb-3">LIÊN HỆ:</h4>
          <p>
            Cấp cứu 24/7: <strong>0833 015 115</strong>
          </p>
          <p>
            Hotline Tiêm chủng: <strong>0911 615 115</strong>
          </p>
          <p>
            Hotline Khoa Sản: <strong>0969 804 966</strong>
          </p>
          <p>
            Đặt lịch khám: <strong>1900 1806</strong>
          </p>
        </div>

        {/* Cột 4: Mạng xã hội + Đăng ký email */}
        <div>
          <h4 className="font-bold mb-3">LIÊN KẾT MẠNG XÃ HỘI</h4>
          <div className="flex gap-4 mb-3">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
            >
              <FaYoutube />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800"
            >
              <FaTiktok />
            </a>
          </div>

          <ul className="list-disc ml-5 text-sm space-y-1 mb-4">
            <li>
              <a href="#" className="hover:underline">
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Liên hệ
              </a>
            </li>
          </ul>

          <h4 className="font-semibold mb-2">ĐĂNG KÝ ĐỂ NHẬN ƯU ĐÃI</h4>
          <div className="flex items-center">
            <input
              type="email"
              placeholder="Nhập địa chỉ email"
              className="w-full border border-gray-300 px-3 py-2 rounded-l outline-none"
            />
            <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r text-white">
              <IoSend />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
