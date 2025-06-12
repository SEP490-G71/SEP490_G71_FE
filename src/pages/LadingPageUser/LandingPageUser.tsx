import React, { useRef, useLayoutEffect, useState } from "react";
import { Header } from "../../components/LandingPageUser/Header";
import Home from "../../components/LandingPageUser/Home";
import AboutUs from "../../components/LandingPageUser/AboutUs";
import Services from "../../components/LandingPageUser/Service";
import { AppointmentForm } from "../../components/LandingPageUser/AppointmentForm";
import { DepartmentsSection } from "../../components/LandingPageUser/DepartmentsSection";
import { DoctorsSection } from "../../components/LandingPageUser/DoctorsSection";
import { Footer } from "../../components/LandingPageUser/Footer";

const LandingPageUser: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  return (
    <div>
      <div ref={headerRef}>
        <Header />
      </div>
      <section id="home">
        <Home headerHeight={headerHeight} />
      </section>
      <section id="about" className="scroll-mt-[100px]">
        <AboutUs />
      </section>
      <section id="services" className="scroll-mt-[100px]">
        <Services />
      </section>
      <section id="appointment" className="scroll-mt-[100px]">
        <AppointmentForm />
      </section>
      <section id="departments" className="scroll-mt-[100px]">
        <DepartmentsSection />
      </section>
      <section id="doctors" className="scroll-mt-[100px]">
        <DoctorsSection />
      </section>
      <section id="contact" className="scroll-mt-[100px]">
        <Footer />
      </section>
    </div>
  );
};

export default LandingPageUser;
