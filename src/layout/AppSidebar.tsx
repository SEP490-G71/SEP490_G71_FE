import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { FaUserPlus, FaFileMedical, FaUsers, FaClock } from "react-icons/fa";
import { ChevronDownIcon, GridIcon, HorizontaLDots } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import {
  IconCashRegister,
  IconTimeDurationOff,
  IconCalendarEvent,
} from "@tabler/icons-react";
import { TbReportAnalytics } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";

import { useUserInfo } from "../hooks/auth/useUserInfo";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItemsByRole: Record<string, NavItem[]> = {
  ADMIN: [
    {
      name: "Thống kê",
      icon: <GridIcon />,
      subItems: [
        { name: "Tổng quan thống kê ", path: "/admin/dashboard" },
        { name: "Ai report", path: "/admin/ai-report" },
      ],
    },
    {
      name: "Thông tin chung",
      icon: <IconCalendarEvent />,
      subItems: [
        { name: "Quản lý chuyên khoa", path: "/admin/specializations" },
        { name: "Quản lý phòng ban", path: "/admin/departments" },
        { name: "Quản lý dịch vụ khám", path: "/admin/medical-service" },
        { name: "Quản lý ca làm", path: "/admin/divide-shift" },
      ],
    },
    {
      name: "	Nhân sự & bệnh nhân",
      icon: <FaUsers />,
      subItems: [
        { name: "Quản lý nhân viên", path: "/admin/staffs" },
        { name: "Quản lý bệnh nhân", path: "/admin/patients" },
        { name: "Quản lý lịch làm việc", path: "/admin/work-schedule" },
        { name: "Quản lý đơn xin nghỉ", path: "/admin/Leave" },
      ],
    },

    {
      name: "Báo cáo",
      icon: <TbReportAnalytics />,
      subItems: [
        { name: "Doanh thu", path: "/admin/invoice" },
        {
          name: "Doanh thu theo dịch vụ",
          path: "/admin/statistic-medical-service",
        },
        {
          name: "Bệnh án",
          path: "/admin/medical-records",
        },
        { name: "Hiệu suất làm việc", path: "/admin/statistic-schedule" },
        {
          name: "Sinh nhật khách hàng",
          path: "/admin/statistic-patient",
        },
      ],
    },
    {
      name: "Phản hồi",
      icon: <TbReportAnalytics />,
      subItems: [
        { name: "Phản hồi nhân viên", path: "/admin/statistic-staffFeedBack" },
        {
          name: "Phản hồi dịch vụ",
          path: "/admin/statistic-ServiceFeedBack",
        },
      ],
    },
    {
      name: "Cấu hình hệ thống",
      icon: <IoMdSettings />,
      subItems: [
        { name: "Mẫu in hoá đơn", path: "/admin/invoice-templates" },
        { name: "Mẫu in bệnh án", path: "/admin/medical-templates" },
        { name: "Quản lý quyền", path: "/admin/role" },
        { name: "Cài đặt hệ thống", path: "/admin/settings" },
      ],
    },
  ],
  CASHIER: [
    {
      name: "Thu chi",
      icon: <IconCashRegister />,
      path: "/admin/medical-examination/billing",
    },
    {
      name: "Lịch làm việc staff",
      icon: <IconCashRegister />,
      path: "/admin/work-schedule-staff",
    },
    {
      name: "Đơn xin nghỉ nhân viên",
      icon: <IconTimeDurationOff />,
      path: "/staff/leave",
    },
  ],
  DOCTOR: [
    {
      name: "Khám tổng quát",
      icon: <FaUserPlus />,
      path: "/admin/medical-examination",
    },
    // {
    //   name: "khám chuyên khoa",
    //   icon: <FaUserPlus />,
    //   path: "/admin/medical-examination/clinical",
    // },
    // {
    //   name: "Bệnh án",
    //   icon: <FaFileMedical />,
    //   path: "/admin/medical-records",
    // },
    {
      name: "Xem hàng chờ",
      icon: <FaClock />,
      path: "/admin/view-medical-records",
    },
    {
      name: "Lịch làm việc staff",
      icon: <IconCashRegister />,
      path: "/admin/work-schedule-staff",
    },
    {
      name: "Đơn xin nghỉ nhân viên",
      icon: <IconTimeDurationOff />,
      path: "/staff/leave",
    },
  ],
  RECEPTIONIST: [
    {
      name: "Đăng ký khám",
      icon: <FaUserPlus />,
      path: "/admin/register-medical-examination",
    },
    {
      name: "Lịch khám online",
      icon: <FaUserPlus />,
      path: "/admin/register-online",
    },
    {
      name: "Xem hàng chờ",
      icon: <FaClock />,
      path: "/admin/view-medical-records",
    },
    {
      name: "Lịch làm việc staff",
      icon: <IconCashRegister />,
      path: "/admin/work-schedule-staff",
    },
    {
      name: "Đơn xin nghỉ nhân viên",
      icon: <IconTimeDurationOff />,
      path: "/staff/leave",
    },
  ],
  TECHNICIAN: [
    {
      name: "Khám lâm sàng",
      icon: <FaUserPlus />,
      path: "/admin/medical-examination/clinical",
    },
    {
      name: "Lịch làm việc staff",
      icon: <IconCashRegister />,
      path: "/admin/work-schedule-staff",
    },
    {
      name: "Đơn xin nghỉ nhân viên",
      icon: <IconTimeDurationOff />,
      path: "/staff/leave",
    },
  ],
  PATIENT: [
    {
      name: "Xem bệnh án",
      icon: <FaFileMedical />,
      path: "/admin/medical-records",
    },
  ],
  user: [
    {
      name: "Bệnh án",
      icon: <FaFileMedical />,
      path: "/admin/medical-examination",
    },
  ],
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { userInfo } = useUserInfo();

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const mergedNavItemsMap = new Map<string, NavItem>();
  if (userInfo?.roles) {
    userInfo.roles.forEach((role) => {
      const roleNavItems = navItemsByRole[role] || [];
      roleNavItems.forEach((item) => {
        if (item.subItems && !item.path) {
          const existing = Array.from(mergedNavItemsMap.values()).find(
            (v) => v.name === item.name
          );
          if (!existing) {
            mergedNavItemsMap.set(`submenu-${item.name}`, item);
          }
        } else if (item.path && !mergedNavItemsMap.has(item.path)) {
          mergedNavItemsMap.set(item.path, item);
        }
      });
    });
  }

  const allNavItems = Array.from(mergedNavItemsMap.values());

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `submenu-${openSubmenu}`;
      const ref = subMenuRefs.current[key];
      if (ref) {
        setSubMenuHeight((prev) => ({ ...prev, [key]: ref.scrollHeight || 0 }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (name: string) => {
    setOpenSubmenu((prevKey) => (prevKey === name ? null : name));
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => {
        const isOpen = openSubmenu === nav.name;
        const key = `submenu-${nav.name}`;
        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(nav.name)}
                className={`menu-item group ${
                  isOpen ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isOpen ? "menu-item-icon-active" : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text text-[14px]">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-500" : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              <Link
                to={nav.path!}
                className={`menu-item group ${
                  isActive(nav.path!)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path!)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[key] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isOpen ? `${subMenuHeight[key] || 0}px` : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span className="menu-dropdown-badge">new</span>
                          )}
                          {subItem.pro && (
                            <span className="menu-dropdown-badge">pro</span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${
        isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
          ? "w-[290px]"
          : "w-[90px]"
      } ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {!isExpanded ||
                  !isHovered ||
                  (!isMobileOpen && <HorizontaLDots className="size-6" />)}
              </h2>
              {renderMenuItems(allNavItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
