// PatientPortalHeader.tsx
import { useState } from "react";
import {
  Menu as Burger,
  X,
  Stethoscope,
  ChevronDown,
  LogOut,
  User2,
} from "lucide-react";
import HomeLogo from "/images/logo/home.svg";
import { Modal, Menu, Divider, UnstyledButton, Text } from "@mantine/core";
import { Link, useLocation, useNavigate } from "react-router";
import { AppointmentForm } from "../../../components/LandingPageUser/AppointmentForm";

type Props = {
  username?: string;
  loadingUser?: boolean;
};

export const PatientPortalHeader = ({ username, loadingUser }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Lịch sử khám", path: "/patient/examinationHistory" },
    { label: "Hóa đơn", path: "/patient/invoiceHistory" },
  ];

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const toggleNavbar = () => setMobileDrawerOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/home"; // hoặc navigate("/home/login")
  };

  return (
    <>
      {/* Header */}
      <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-30">
        <div className="w-full flex items-center justify-between px-4 py-1">
          {/* Logo + Menu */}
          <div className="flex items-center gap-6">
            <img
              src={HomeLogo}
              alt="Logo"
              className="h-10 md:h-12 w-auto object-contain"
            />
            <div className="hidden md:flex items-center gap-6 text-base font-medium text-gray-700">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`hover:text-blue-600 transition-all border-b-2 ${
                    location.pathname === item.path
                      ? "text-blue-600 border-blue-600"
                      : "border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Username dropdown + Icon đặt lịch */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setBookingModalOpen(true)}
              title="Đặt lịch khám"
              className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2"
            >
              <Stethoscope className="w-6 h-6 text-blue-600" />
              <div className="flex flex-col leading-tight text-left">
                <span className="text-xs text-blue-600 font-semibold">
                  Tư vấn
                </span>
                <span className="text-xs text-blue-600">Đặt lịch</span>
              </div>
            </button>

            {/* Dropdown username */}
            {!loadingUser && !!username && (
              <Menu width={220} position="bottom-end" shadow="md" withArrow>
                <Menu.Target>
                  <UnstyledButton className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-50">
                    <Text size="sm" className="text-gray-700 font-medium">
                      {username}
                    </Text>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <div className="px-10 py-2">
                    <Text
                      size="sm"
                      className="text-gray-700 font-medium truncate"
                    >
                      {username}
                    </Text>
                  </div>

                  <Menu.Item
                    leftSection={<User2 className="w-4 h-4" />}
                    onClick={() => navigate("/patient/profile")}
                  >
                    Thông tin cá nhân
                  </Menu.Item>

                  <Divider my="xs" />

                  <Menu.Item
                    color="red"
                    leftSection={<LogOut className="w-4 h-4" />}
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden ml-auto">
            <button onClick={toggleNavbar} aria-label="Toggle Menu">
              {mobileDrawerOpen ? <X size={28} /> : <Burger size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileDrawerOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-md px-6 py-4 space-y-4">
            {/* Username trên mobile */}
            {!loadingUser && !!username && (
              <div className="text-gray-700 font-medium">{username}</div>
            )}

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileDrawerOpen(false)}
                className={`block text-gray-700 text-base font-medium hover:text-blue-600 ${
                  location.pathname === item.path ? "text-blue-600" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}

            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full border px-4 py-2 rounded hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Stethoscope className="w-5 h-5" />
              Tư vấn / Đặt lịch
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-gray-100 text-gray-800 px-5 py-2 border rounded hover:bg-red-600 hover:text-white transition-all text-sm font-medium"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </nav>

      {/* Modal đặt lịch khám */}
      <Modal
        opened={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Đặt lịch khám"
        size="lg"
        centered
      >
        <AppointmentForm />
      </Modal>

      {/* Spacer cho header fixed */}
      <div className="h-[64px]" />
    </>
  );
};
