import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router";
import { Link as ScrollLink } from "react-scroll";

export const Navbar = () => {
  const navItems = [
    { label: "Trang Chủ", href: "#intro-section" },
    { label: "Giới Thiệu", href: "#about-section" },
    { label: "Giải Pháp", href: "#solutions-section" },
    { label: "Bảng Giá", href: "#pricing-section" },
    { label: "Khách Hàng", href: "#feedback-section" },
  ];

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="sticky top-0 z-50 py-3 bg-white/80 backdrop-blur-md border-b border-neutral-200 text-blue-900 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 relative flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <img
            className="h-28 w-28 mr-3"
            src="/images/logo/home.svg"
            alt="Logo"
          />{" "}
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-6 font-medium">
          {navItems.map((item, index) => (
            <li key={index}>
              <ScrollLink
                to={item.href.replace("#", "")}
                smooth={true}
                duration={800}
                offset={-90}
                spy={true}
                activeClass="active"
                isDynamic={true}
                className="inline-block px-2 py-2 relative cursor-pointer transition-colors duration-300 hover: before:absolute before:left-0 before:bottom-0 before:h-0.5 before:bg-white before:w-0 before:transition-all before:duration-300 hover:before:w-full [&.active]:before:w-full [&.active]:font-semibold"
              >
                {item.label}
              </ScrollLink>
            </li>
          ))}
        </ul>

        {/* Desktop Sign In */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link
            to="/signin"
            className="py-2 px-6 border border-blue-700 text-blue-900 hover:bg-blue-900/10 rounded-md shadow-sm transition-all duration-300 font-medium"
          >
            Đăng nhập
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleNavbar}
            className=" focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileDrawerOpen ? (
              <X
                size={28}
                className="transition-transform duration-300 rotate-180"
              />
            ) : (
              <Menu size={28} className="transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/95 backdrop-blur-sm w-screen h-screen px-6 py-12 flex flex-col justify-center items-center lg:hidden overflow-y-auto">
          <ul className="space-y-6 text-center">
            {navItems.map((item, index) => (
              <li key={index}>
                <ScrollLink
                  to={item.href.replace("#", "")}
                  smooth={true}
                  duration={500}
                  offset={-80}
                  spy={true}
                  activeClass="active"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="text-white text-2xl font-medium cursor-pointer hover:text-blue-200 transition-colors duration-300"
                >
                  {item.label}
                </ScrollLink>
              </li>
            ))}
          </ul>
          <Link
            to="/signin"
            className="mt-8 py-2 px-6 bg-white text-blue-600 hover:bg-blue-100 rounded-md transition-colors duration-300 font-medium"
            onClick={() => setMobileDrawerOpen(false)}
          >
            Đăng nhập
          </Link>
        </div>
      )}
    </nav>
  );
};
