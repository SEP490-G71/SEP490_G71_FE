import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router";
export const Navbar = () => {
  const navItems = [
    { label: "Trang Chủ", href: "#" },
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
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-2" src="/images/logo.png" alt="Logo" />
            <span className="text-xl tracking-tight">MedSoft</span>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-0 divide-x divide-white/40">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="px-6 py-2 inline-block hover:text-white transition-colors duration-200"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center space-x-12 items-center">
            <Link
              to="/signin"
              className="py-2 px-3 bg-white text-blue-600 hover:bg-blue-100 rounded-md"
            >
              Đăng nhập
            </Link>
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6">
              <a
                href="#"
                className="py-2 px-3 bg-white text-blue-600 hover:bg-blue-100 rounded-md"
              >
                Sign In
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
