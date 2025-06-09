import { useState } from "react";
import { Footer } from "../../components/LandingPageAdmin/Footer";
import { Navbar } from "../../components/LandingPageAdmin/Navbar";
import { Pricing } from "../../components/LandingPageAdmin/Pricing";
import RegisterModal from "../../components/LandingPageAdmin/RegisterModal";
import HoverMenuProblems from "../../components/LandingPageAdmin/HoverMenuProblems";
import HoverMenuSolutions from "../../components/LandingPageAdmin/HoverMenuSolutions";
import FeedBack from "../../components/LandingPageAdmin/FeedBack";
import IntroSection from "../../components/LandingPageAdmin/IntroSection";

export const LandingPageAdminPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);
  return (
    <>
      <Navbar />

      <div className="bg-white w-screen h-screen" id="intro-section">
        <div className="w-full h-full">
          <IntroSection onRegisterClick={showModal} />
          <RegisterModal
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          />
        </div>
      </div>

      <div className="bg-[#f0f4f8] " id="solutions-section">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <HoverMenuProblems />
        </div>
      </div>

      <div className="bg-white" id="solutions-section">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <HoverMenuSolutions />
        </div>
      </div>

      <div className="bg-[#f0f4f8]" id="pricing-section">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <Pricing />
        </div>
      </div>

      <div className="bg-white" id="feedback-section">
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
