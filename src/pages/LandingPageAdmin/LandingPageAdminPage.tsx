import { useState } from "react";
import { Footer } from "../../components/LandingPageAdmin/Footer";
import { Navbar } from "../../components/LandingPageAdmin/Navbar";
// import { Pricing } from "../../components/LandingPageAdmin/Pricing";
import RegisterModal from "../../components/LandingPageAdmin/RegisterModal";
import HoverMenuProblems from "../../components/LandingPageAdmin/HoverMenuProblems";
import HoverMenuSolutions from "../../components/LandingPageAdmin/HoverMenuSolutions";
import FeedBack from "../../components/LandingPageAdmin/FeedBack";
import IntroSection from "../../components/LandingPageAdmin/IntroSection";
import axios from "axios";
import type { Hospital } from "../../types/Admin/LandingPageAdmin/Hospital";
import { toast } from "react-toastify";
import About from "../../components/LandingPageAdmin/About";

export const LandingPageAdminPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedPackageId, setSelectedPackageId] = useState<
    string | undefined
  >();

  const showModal = (packageId?: string) => {
    setSelectedPackageId(packageId);
    setIsModalVisible(true);
  };

  const handleCancel = () => setIsModalVisible(false);

  const handleOk = async (values: Hospital, resetForm: () => void) => {
    setLoading(true);
    console.log("Thông tin đăng ký: ", values);

    try {
      const response = await axios.post(
        "https://api.datnd.id.vn/medical-diagnosis/auth/register-tenant",
        {
          name: values.name,
          code: values.code,
          email: values.email,
          phone: values.phone,
          servicePackageId: values.servicePackageId,
        }
      );

      if (response.status === 200) {
        toast.success("Đăng ký thành công! Vui lòng kiểm tra email!");
        setIsModalVisible(false);
        resetForm();
      } else {
        toast.error(response.data.message || "Không thêm đăng ký thành công");
      }
    } catch (error: any) {
      console.error("Có lỗi khi gửi dữ liệu đăng ký:", error);
      toast.error("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#f0f4f8]" id="intro-section">
        <div className="max-w-7xl mx-auto px-6 pt-1">
          <IntroSection onRegisterClick={() => showModal()} />
          <RegisterModal
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            loading={loading}
            servicePackageId={selectedPackageId}
          />
        </div>
      </div>

      <div className="bg-white" id="about-section">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <About />
        </div>
      </div>

      <div className="bg-[#f0f4f8]" id="solutions-section">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <HoverMenuProblems />
        </div>
      </div>

      <div className="bg-[#f0f4f8]" id="solutions-section">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <HoverMenuSolutions />
        </div>
      </div>

      {/* <div className="bg-white" id="pricing-section">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <Pricing onRegisterClick={showModal} />
        </div>
      </div> */}

      <div className="bg-[#f0f4f8]" id="feedback-section">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <FeedBack />
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <Footer />
        </div>
      </div>
    </>
  );
};
