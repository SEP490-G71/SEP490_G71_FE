import { useState } from "react";
import { Footer } from "../../components/LandingPageAdmin/Footer";
import IntroSection from "../../components/LandingPageAdmin/Introsection";
import { Navbar } from "../../components/LandingPageAdmin/Navbar";
import { Pricing } from "../../components/LandingPageAdmin/Pricing";
import RegisterModal from "../../components/LandingPageAdmin/RegisterModal";
import HoverMenuProblems from "../../components/LandingPageAdmin/HoverMenuProblems";
import HoverMenuSolutions from "../../components/LandingPageAdmin/HoverMenuSolutions";
import FeedBack from "../../components/LandingPageAdmin/FeedBack";

export const LandingPageAdminPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);
  return (
    <>
      <Navbar />

      {/* Section Intro - #f0f4f8 */}
      <div className="bg-[#f0f4f8]" id="intro-section">
        <div className="max-w-7xl mx-auto pt-20 px-6">
          <IntroSection onRegisterClick={showModal} />
          <RegisterModal
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          />
        </div>
      </div>

      {/* Section HoverMenuProblems - white */}
      <div className="bg-white" id="solutions-section">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <HoverMenuProblems />
        </div>
      </div>

      {/* Section HoverMenuSolutions - #e6f0fa */}
      <div className="bg-[#e6f0fa]" id="solutions-section">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <HoverMenuSolutions />
        </div>
      </div>

      {/* Section Pricing - #f0f4f8 */}
      <div className="bg-[#f0f4f8]" id="pricing-section">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <Pricing />
        </div>
      </div>

      {/* FeedBack - #e6f0fa * */}
      <div className="bg-[#e6f0fa]" id="feedback-section">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <FeedBack />
        </div>
      </div>

      {/* Footer - white */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <Footer />
        </div>
      </div>
    </>
  );
};
