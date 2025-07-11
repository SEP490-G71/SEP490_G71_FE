import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { AiOutlineApartment, AiOutlineAudit } from "react-icons/ai";
import { FaUserPlus, FaFileMedical, FaUsers, FaClock } from "react-icons/fa";
import { FaBriefcaseMedical } from "react-icons/fa6";
import { MdManageAccounts } from "react-icons/md";
import { ChevronDownIcon, GridIcon, HorizontaLDots } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import {
  IconBusinessplan,
  IconCashRegister,
  IconHeartRateMonitor,
} from "@tabler/icons-react";
import { parseJwt } from "../../src/components/utils/jwt";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItemsByRole: Record<string, NavItem[]> = {
  admin: [
    { icon: <GridIcon />, name: "Thống kê", path: "/admin/dashboard" },
    {
      name: "Quản lý dịch vụ khám",
      icon: <FaBriefcaseMedical />,
      path: "/admin/medical-service",
    },
    { name: "Quản lý role", icon: <MdManageAccounts />, path: "/admin/role" },
    {
      name: "Quản lý permission",
      icon: <MdManageAccounts />,
      path: "/admin/permission",
    },
    {
      name: "Quản lý nhân viên",
      icon: <AiOutlineAudit />,
      path: "/admin/staffs",
    },
    {
      name: "Quản lý phòng ban",
      icon: <AiOutlineApartment />,
      path: "/admin/departments",
    },
    {
      name: "Quản lý hoá đơn",
      icon: <IconBusinessplan />,
      path: "/admin/invoice",
    },
    {
      name: "Đăng ký khám",
      icon: <FaUserPlus />,
      path: "/admin/register-medical-examination",
    },
    {
      name: "Quản lý bệnh nhân",
      icon: <FaUsers />,
      path: "/admin/patients",
    },
    {
      name: "Quản Lý Bệnh án",
      icon: <FaFileMedical />,
      path: "/admin/medical-records",
    },
    {
      name: "Xem Hàng Chờ",
      icon: <FaClock />,
      path: "/admin/view-medical-records",
    },
    {
      name: "Thu chi",
      icon: <IconCashRegister />,
      path: "/admin/medical-examination/billing",
    },
    {
      name: "Lịch làm việc",
      icon: <IconCashRegister />,
      path: "/admin/work-schedule",
    },
    {
      name: "Khám bệnh",
      icon: <IconHeartRateMonitor />,
      subItems: [
        {
          name: "Khám lâm sàng",
          path: "/admin/medical-examination/clinical",
        },
        {
          name: "Tai mũi họng",
          path: "/admin/medical-examination/ent",
        },
      ],
    },
  ],
  staff: [
    {
      name: "Đăng ký khám",
      icon: <FaUserPlus />,
      path: "/admin/register-medical-examination",
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

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Xác định role từ JWT
  const token = localStorage.getItem("token");
  let role = "user";
  if (token) {
    const payload = parseJwt(token);
    const scopes = payload?.scope?.split(" ") || [];

    if (scopes.includes("ROLE_ADMIN")) role = "admin";
    else if (scopes.includes("ROLE_STAFF")) role = "staff";
    else if (scopes.includes("ROLE_USER")) role = "user";
  }

  // Lấy danh sách menu theo role
  const allNavItems = navItemsByRole[role] || [];

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let matchedIndex: number | null = null;
    allNavItems.forEach((nav, index) => {
      nav.subItems?.forEach((subItem) => {
        if (isActive(subItem.path)) {
          matchedIndex = index;
        }
      });
    });
    setOpenSubmenu(matchedIndex);
  }, [location, isActive, allNavItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `submenu-${openSubmenu}`;
      const ref = subMenuRefs.current[key];
      if (ref) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: ref.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prevIndex) => (prevIndex === index ? null : index));
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        const isOpen = openSubmenu === index;
        const key = `submenu-${index}`;
        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index)}
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
                  <span className="menu-item-text">{nav.name}</span>
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
