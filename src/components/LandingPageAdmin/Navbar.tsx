import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router";
import { Link as ScrollLink } from "react-scroll";

export const Navbar = () => {
  const navItems = [
    { label: "Trang Chủ", href: "#intro-section" },
    { label: "Giới Thiệu", href: "#intro-section" },
    { label: "Giải Pháp", href: "#solutions-section" },
    { label: "Bảng Giá", href: "#pricing-section" },
    { label: "Khách Hàng", href: "#feedback-section" },
  ];

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="sticky top-0 z-50 py-3 bg-blue-500 border-b border-neutral-700/80 text-white">
      <div className="max-w-7xl mx-auto px-6 relative lg:text-sm">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-2" src="/images/logo.png" alt="Logo" />
            <span className="text-xl tracking-tight">MedSoft</span>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex ml-14 space-x-0 divide-x divide-white/40">
            {navItems.map((item, index) => (
              <li key={index}>
                <ScrollLink
                  to={item.href.replace("#", "")}
                  smooth={true}
                  duration={500}
                  offset={-80}
                  className="px-6 py-2 inline-block text-white relative after:block after:h-[2px] after:bg-white after:scale-x-0 after:transition-transform after:duration-300 after:origin-left hover:after:scale-x-100 hover:bg-white/10 rounded transition-all duration-300 cursor-pointer"
                >
                  {item.label}
                </ScrollLink>
              </li>
            ))}
          </ul>

          {/* Desktop Sign In */}
          <div className="hidden lg:flex justify-center space-x-12 items-center">
            <Link
              to="/signin"
              className="py-2 px-3 bg-white text-blue-600 hover:bg-blue-100 rounded-md"
            >
              Đăng nhập
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-20 bg-neutral-900/95 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <ScrollLink
                    to={item.href.replace("#", "")}
                    smooth={true}
                    duration={500}
                    offset={-80}
                    onClick={() => setMobileDrawerOpen(false)}
                    className="text-white text-xl cursor-pointer"
                  >
                    {item.label}
                  </ScrollLink>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6 mt-8">
              <Link
                to="/signin"
                className="py-2 px-3 bg-white text-blue-600 hover:bg-blue-100 rounded-md"
                onClick={() => setMobileDrawerOpen(false)}
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
