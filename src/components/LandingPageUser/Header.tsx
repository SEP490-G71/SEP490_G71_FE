import { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import { Menu, X } from "lucide-react";
import HomeLogo from "/images/logo/home.svg";

export const Header = () => {
  const navItems = [
    { label: "Giới thiệu", href: "#home" },
    { label: "Tổng quan", href: "#about" },
    { label: "Dịch vụ", href: "#services" },
    { label: "Bộ phận", href: "#departments" },
    { label: "Bác sĩ", href: "#doctors" },
    { label: "Kết nối", href: "#contact" },
  ];

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleNavbar = () => setMobileDrawerOpen(!mobileDrawerOpen);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Ẩn top bar khi cuộn xuống, hiện lại khi cuộn lên
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowTopBar(false);
      } else {
        setShowTopBar(true);
      }

      setLastScrollY(currentScrollY);

      // Xác định section active
      const offsets = navItems.map((item) => {
        const id = item.href.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          return {
            id,
            offsetTop: el.offsetTop - 150,
            offsetBottom: el.offsetTop + el.offsetHeight - 150,
          };
        }
        return null;
      });

      const current = offsets.find(
        (section) =>
          section &&
          currentScrollY >= section.offsetTop &&
          currentScrollY < section.offsetBottom
      );

      if (current && current.id !== activeSection) {
        setActiveSection(current.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection, lastScrollY]);

  return (
    <>
      {/* Top bar - không chiếm chỗ khi ẩn */}
      <div
        className={`fixed top-0 left-0 w-full bg-sky-600 text-white text-sm lg:text-base z-40 transition-transform duration-300 ${
          showTopBar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-2 py-2 flex justify-between items-center">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1">
              <MdEmail className="text-lg" /> MedSoft@gmail.com
            </span>
            <span className="flex items-center gap-1">
              <MdPhone className="text-lg" /> +1 5589 55488 55
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-200 transition-colors">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-gray-200 transition-colors">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-gray-200 transition-colors">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={`fixed top-0 left-0 w-full bg-white shadow-md z-30 transition-all duration-300 ${
          showTopBar ? "mt-[40px]" : "mt-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-2 py-2 flex items-center justify-between border-b">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img
              src={HomeLogo}
              alt="Logo"
              className="h-10 md:h-16 lg:h-20 w-auto object-contain"
            />
          </div>

          {/* Desktop menu */}
          <ul className="hidden md:flex gap-6 text-gray-700 font-medium items-center text-lg ml-auto mr-6">
            {navItems.map((item, index) => {
              const id = item.href.replace("#", "");
              const isActive = activeSection === id;

              return (
                <li
                  key={index}
                  className={`cursor-pointer transition-colors relative ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "hover:text-blue-600"
                  }`}
                >
                  <a href={item.href}>{item.label}</a>
                  {isActive && (
                    <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600" />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Appointment button (desktop) */}
          <div className="hidden md:block">
            <button
              onClick={() => {
                const section = document.getElementById("appointment");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all text-sm font-medium"
            >
              Đặt lịch hẹn
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden ml-auto">
            <button onClick={toggleNavbar} aria-label="Toggle Menu">
              {mobileDrawerOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileDrawerOpen && (
          <div className="md:hidden bg-white border-t shadow-md px-6 py-4 space-y-4">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="block text-gray-700 text-base font-medium hover:text-blue-600 transition-colors"
                onClick={() => setMobileDrawerOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button className="w-full bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all text-sm font-medium">
              Đặt lịch hẹn
            </button>
          </div>
        )}
      </nav>

      {/* Spacer to offset fixed header height */}
      <div className="h-[130px]" />
    </>
  );
};
