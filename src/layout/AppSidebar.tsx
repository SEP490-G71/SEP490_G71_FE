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
    { icon: <GridIcon />, name: "Thống kê", path: "/admin/dashboard" },
    {
      name: "Thông tin chung",
      icon: <IconCalendarEvent />,
      subItems: [
        { name: "Quản lý dịch vụ khám", path: "/admin/medical-service" },
        { name: "Quản lý chuyên khoa", path: "/admin/specializations" },
        { name: "Quản lý phòng ban", path: "/admin/departments" },
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
        { name: "Đơn xin nghỉ", path: "/admin/Leave" },
      ],
    },
    // {
    //   name: "Quản lý dịch vụ khám",
    //   icon: <FaBriefcaseMedical />,
    //   path: "/admin/medical-service",
    // },
    // { name: "Quản lý role", icon: <MdManageAccounts />, path: "/admin/role" },
    // {
    //   name: "Quản lý nhân viên",
    //   icon: <AiOutlineAudit />,
    //   path: "/admin/staffs",
    // },
    // {
    //   name: "Quản lý phòng ban",
    //   icon: <AiOutlineApartment />,
    //   path: "/admin/departments",
    // },
    // {
    //   name: "Quản lý chuyên khoa",
    //   icon: <MdOutlineLocalHospital />,
    //   path: "/admin/specializations",
    // },
    // {
    //   name: "Đăng ký khám",
    //   icon: <FaUserPlus />,
    //   path: "/admin/register-medical-examination",
    // },
    // {
    //   name: "khám lâm sàng",
    //   icon: <FaUserPlus />,
    //   path: "/admin/medical-examination",
    // },
    // { name: "Quản lý bệnh nhân", icon: <FaUsers />, path: "/admin/patients" },
    // {
    //   name: "Quản Lý Bệnh án",
    //   icon: <FaFileMedical />,
    //   path: "/admin/medical-records",
    // },
    // {
    //   name: "Xem Hàng Chờ",
    //   icon: <FaClock />,
    //   path: "/admin/view-medical-records",
    // },
    // {
    //   name: "Thu chi",
    //   icon: <IconCashRegister />,
    //   path: "/admin/medical-examination/billing",
    // },
    // {
    //   name: "Lịch làm việc",
    //   icon: <IconCalendarTime />,
    //   path: "/admin/work-schedule",
    // },
    // {
    //   name: "Quản lý ca làm",
    //   icon: <IconCalendarTime />,
    //   path: "/admin/divide-shift",
    // },
    {
      name: "Báo cáo",
      icon: <TbReportAnalytics />,
      subItems: [
        { name: "Doanh thu", path: "/admin/invoice" },
        {
          name: "Bệnh án",
          path: "/admin/medical-records",
        },
        { name: "Lịch làm việc tổng quan", path: "/admin/statistic-schedule" },
        { name: "Theo dịch vụ", path: "/admin/statistic-medical-service" },
        { name: "Khách hàng trong tháng", path: "/admin/statistic-patient" },
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
    // {
    //   name: "Khám bệnh",
    //   icon: <IconHeartRateMonitor />,
    //   subItems: [
    //     { name: "Khám lâm sàng", path: "/admin/medical-examination/clinical" },
    //   ],
    // },
    // {
    //   name: "Đơn xin nghỉ",
    //   icon: <IconTimeDurationOff />,
    //   path: "/admin/Leave",
    // },
    // {
    //   name: "Đơn xin nghỉ nhân viên",
    //   icon: <IconTimeDurationOff />,
    //   path: "/staff/leave",
    // },
    // {
    //   name: "Mẫu in hoá đơn",
    //   icon: <IconPrinter />,
    //   path: "/admin/invoice-templates",
    // },
    // {
    //   name: "Mẫu in bệnh án",
    //   icon: <IconReportMedical />,
    //   path: "/admin/medical-templates",
    // },
    // { name: "Cài đặt hệ thống", icon: <FaUserPlus />, path: "/admin/settings" },
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
      name: "Khám lâm sàng",
      icon: <FaUserPlus />,
      path: "/admin/medical-examination/clinical",
    },
    {
      name: "Bệnh án",
      icon: <FaFileMedical />,
      path: "/admin/medical-records",
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
  RECEPTIONIST: [
    {
      name: "Đăng ký khám",
      icon: <FaUserPlus />,
      path: "/admin/register-medical-examination",
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
      path: "/admin/medical-examination",
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

  // ✅ SỬA 3: Gộp menu của tất cả role, loại trùng path và tên submenu
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

  // useEffect(() => {
  //   const found = allNavItems.find((nav) =>
  //     nav.subItems?.some((subItem) => isActive(subItem.path))
  //   );

  //   if (!openSubmenu && found) {
  //     setOpenSubmenu(found.name);
  //   }
  // }, [location.pathname, allNavItems, openSubmenu, isActive]);

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

// import { useCallback, useEffect, useRef, useState } from "react";
// import { Link, useLocation } from "react-router";
// import { AiOutlineApartment, AiOutlineAudit } from "react-icons/ai";
// import { FaUserPlus, FaFileMedical, FaUsers, FaClock } from "react-icons/fa";
// import { FaBriefcaseMedical } from "react-icons/fa6";
// import { MdManageAccounts } from "react-icons/md";
// import { ChevronDownIcon, GridIcon, HorizontaLDots } from "../icons";
// import { useSidebar } from "../context/SidebarContext";
// import {
//   IconCashRegister,
//   IconHeartRateMonitor,
//   IconPrinter,
//   IconTimeDurationOff,
// } from "@tabler/icons-react";
// import { parseJwt } from "../../src/components/utils/jwt";
// import { RoleType } from "../enums/Role/RoleType";

// type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
// };

// const navItemsByRole: Record<RoleType, NavItem[]> = {
//   ADMIN: [
//     { icon: <GridIcon />, name: "Thống kê", path: "/admin/dashboard" },
//     {
//       name: "Quản lý dịch vụ khám",
//       icon: <FaBriefcaseMedical />,
//       path: "/admin/medical-service",
//     },
//     { name: "Quản lý role", icon: <MdManageAccounts />, path: "/admin/role" },
//     {
//       name: "Quản lý permission",
//       icon: <MdManageAccounts />,
//       path: "/admin/permission",
//     },
//     {
//       name: "Quản lý nhân viên",
//       icon: <AiOutlineAudit />,
//       path: "/admin/staffs",
//     },
//     {
//       name: "Quản lý phòng ban",
//       icon: <AiOutlineApartment />,
//       path: "/admin/departments",
//     },
//     { name: "Quản lý bệnh nhân", icon: <FaUsers />, path: "/admin/patients" },
//     {
//       name: "Quản Lý Bệnh án",
//       icon: <FaFileMedical />,
//       path: "/admin/medical-records",
//     },
//     {
//       name: "Lịch làm việc",
//       icon: <IconCashRegister />,
//       path: "/admin/work-schedule",
//     },
//     {
//       name: "Báo cáo",
//       icon: <IconHeartRateMonitor />,
//       subItems: [
//         { name: "Doanh thu", path: "/admin/invoice" },
//         { name: "Lịch làm việc tổng quan", path: "/admin/statistic-schedule" },
//         { name: " Dịch vụ", path: "/admin/statistic-medical-service" },
//         { name: "Bệnh nhân", path: "/admin/statistic-patient" },
//         { name: "Hoá đơn", path: "/admin/statistic-invoice" },
//       ],
//     },
//     {
//       name: "Đơn xin nghỉ",
//       icon: <IconTimeDurationOff />,
//       path: "/admin/Leave",
//     },
//     {
//       name: "Mẫu in hoá đơn",
//       icon: <IconPrinter />,
//       path: "/admin/invoice-templates",
//     },
//     {
//       name: "Mẫu in bệnh án",
//       icon: <IconPrinter />,
//       path: "/admin/medical-templates",
//     },
//     { name: "Settings", icon: <FaUserPlus />, path: "/admin/settings" },
//   ],
//   DOCTOR: [
//     {
//       name: "Khám lâm sàng",
//       icon: <FaFileMedical />,
//       path: "/admin/medical-examination",
//     },
//     {
//       name: "Lịch làm việc",
//       icon: <IconCashRegister />,
//       path: "/admin/work-schedule",
//     },
//     {
//       name: "Đơn xin nghỉ nhân viên",
//       icon: <IconTimeDurationOff />,
//       path: "/staff/leave",
//     },
//   ],
//   CASHIER: [
//     {
//       name: "Thu chi",
//       icon: <IconCashRegister />,
//       path: "/admin/medical-examination/billing",
//     },
//     { name: "Hoá đơn", icon: <FaFileMedical />, path: "/admin/invoice" },
//     {
//       name: "Đơn xin nghỉ nhân viên",
//       icon: <IconTimeDurationOff />,
//       path: "/staff/leave",
//     },
//   ],
//   RECEPTIONIST: [
//     {
//       name: "Đăng ký khám",
//       icon: <FaUserPlus />,
//       path: "/admin/register-medical-examination",
//     },
//     {
//       name: "Xem hàng chờ",
//       icon: <FaClock />,
//       path: "/admin/view-medical-records",
//     },
//     {
//       name: "Đơn xin nghỉ nhân viên",
//       icon: <IconTimeDurationOff />,
//       path: "/staff/leave",
//     },
//   ],
//   TECHNICIAN: [
//     {
//       name: "Xét nghiệm",
//       icon: <IconHeartRateMonitor />,
//       path: "/admin/technician-lab",
//     },
//     {
//       name: "Đơn xin nghỉ nhân viên",
//       icon: <IconTimeDurationOff />,
//       path: "/staff/leave",
//     },
//   ],
//   PATIENT: [
//     {
//       name: "Bệnh án của tôi",
//       icon: <FaFileMedical />,
//       path: "/admin/medical-examination",
//     },
//   ],
// };

// const AppSidebar: React.FC = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const location = useLocation();

//   const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
//   const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
//     {}
//   );
//   const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
//   // Map scope string trong JWT → RoleType
//   // const scopeToRoleMap: Record<string, RoleType> = {
//   //   ADMIN: RoleType.ADMIN,
//   //   DOCTOR: RoleType.DOCTOR,
//   //   CASHIER: RoleType.CASHIER,
//   //   RECEPTIONIST: RoleType.RECEPTIONIST,
//   //   TECHNICIAN: RoleType.TECHNICIAN,
//   //   PATIENT: RoleType.PATIENT,
//   // };

//   // Trả về mảng NavItem[], đã gộp từ các role
//   // const getCombinedNavItems = (scopes: string[]): NavItem[] => {
//   //   const roles = scopes
//   //     .map((s) => scopeToRoleMap[s])
//   //     .filter(Boolean) as RoleType[];

//   //   const mergedItems = roles.flatMap((r) => navItemsByRole[r]);

//   //   const unique = new Map<string, NavItem>();

//   //   for (const item of mergedItems) {
//   //     const key = item.path || item.name; // path ưu tiên hơn name nếu có
//   //     if (!unique.has(key)) {
//   //       unique.set(key, item);
//   //     }
//   //   }

//   //   return Array.from(unique.values());
//   // };

//   // const allNavItems = role ? navItemsByRole[role] : [];

//   // const token = localStorage.getItem("token");
//   // let allNavItems: NavItem[] = [];

//   // if (token) {
//   //   const payload = parseJwt(token);
//   //   const scopes: string[] = payload?.roles ?? [];
//   //   allNavItems = getCombinedNavItems(scopes);
//   // }

//   //Xác định role từ JWT
//   const token = localStorage.getItem("token");
//   let role: RoleType | null = null;

//   if (token) {
//     const payload = parseJwt(token);
//     const roles: string[] = payload?.roles ?? [];

//     const priority: RoleType[] = [
//       RoleType.ADMIN,
//       RoleType.DOCTOR,
//       RoleType.CASHIER,
//       RoleType.RECEPTIONIST,
//       RoleType.TECHNICIAN,
//       RoleType.PATIENT,
//     ];

//     // Ưu tiên lấy role đầu tiên trong danh sách `priority` mà người dùng có
//     for (const pri of priority) {
//       if (roles.includes(pri)) {
//         role = pri;
//         break;
//       }
//     }
//   }

//   const allNavItems: NavItem[] = role ? navItemsByRole[role] : [];

//   const isActive = useCallback(
//     (path: string) => location.pathname === path,
//     [location.pathname]
//   );

//   useEffect(() => {
//     let matchedIndex: number | null = null;
//     allNavItems.forEach((nav, index) => {
//       nav.subItems?.forEach((subItem) => {
//         if (isActive(subItem.path)) {
//           matchedIndex = index;
//         }
//       });
//     });
//     setOpenSubmenu(matchedIndex);
//   }, [location, isActive, allNavItems]);

//   useEffect(() => {
//     if (openSubmenu !== null) {
//       const key = `submenu-${openSubmenu}`;
//       const ref = subMenuRefs.current[key];
//       if (ref) {
//         setSubMenuHeight((prevHeights) => ({
//           ...prevHeights,
//           [key]: ref.scrollHeight || 0,
//         }));
//       }
//     }
//   }, [openSubmenu]);

//   const handleSubmenuToggle = (index: number) => {
//     setOpenSubmenu((prevIndex) => (prevIndex === index ? null : index));
//   };

//   const renderMenuItems = (items: NavItem[]) => (
//     <ul className="flex flex-col gap-4">
//       {items.map((nav, index) => {
//         const isOpen = openSubmenu === index;
//         const key = `submenu-${index}`;
//         return (
//           <li key={nav.name}>
//             {nav.subItems ? (
//               <button
//                 onClick={() => handleSubmenuToggle(index)}
//                 className={`menu-item group ${
//                   isOpen ? "menu-item-active" : "menu-item-inactive"
//                 }`}
//               >
//                 <span
//                   className={`menu-item-icon-size ${
//                     isOpen ? "menu-item-icon-active" : "menu-item-icon-inactive"
//                   }`}
//                 >
//                   {nav.icon}
//                 </span>
//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <span className="menu-item-text">{nav.name}</span>
//                 )}
//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <ChevronDownIcon
//                     className={`ml-auto w-5 h-5 transition-transform duration-200 ${
//                       isOpen ? "rotate-180 text-brand-500" : ""
//                     }`}
//                   />
//                 )}
//               </button>
//             ) : (
//               <Link
//                 to={nav.path!}
//                 className={`menu-item group ${
//                   isActive(nav.path!)
//                     ? "menu-item-active"
//                     : "menu-item-inactive"
//                 }`}
//               >
//                 <span
//                   className={`menu-item-icon-size ${
//                     isActive(nav.path!)
//                       ? "menu-item-icon-active"
//                       : "menu-item-icon-inactive"
//                   }`}
//                 >
//                   {nav.icon}
//                 </span>
//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <span className="menu-item-text">{nav.name}</span>
//                 )}
//               </Link>
//             )}
//             {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
//               <div
//                 ref={(el) => {
//                   subMenuRefs.current[key] = el;
//                 }}
//                 className="overflow-hidden transition-all duration-300"
//                 style={{
//                   height: isOpen ? `${subMenuHeight[key] || 0}px` : "0px",
//                 }}
//               >
//                 <ul className="mt-2 space-y-1 ml-9">
//                   {nav.subItems.map((subItem) => (
//                     <li key={subItem.name}>
//                       <Link
//                         to={subItem.path}
//                         className={`menu-dropdown-item ${
//                           isActive(subItem.path)
//                             ? "menu-dropdown-item-active"
//                             : "menu-dropdown-item-inactive"
//                         }`}
//                       >
//                         {subItem.name}
//                         <span className="flex items-center gap-1 ml-auto">
//                           {subItem.new && (
//                             <span className="menu-dropdown-badge">new</span>
//                           )}
//                           {subItem.pro && (
//                             <span className="menu-dropdown-badge">pro</span>
//                           )}
//                         </span>
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </li>
//         );
//       })}
//     </ul>
//   );

//   return (
//     <aside
//       className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${
//         isExpanded || isMobileOpen
//           ? "w-[290px]"
//           : isHovered
//           ? "w-[290px]"
//           : "w-[90px]"
//       } ${
//         isMobileOpen ? "translate-x-0" : "-translate-x-full"
//       } lg:translate-x-0`}
//       onMouseEnter={() => !isExpanded && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div
//         className={`py-8 flex ${
//           !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//         }`}
//       >
//         <Link to="/">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <>
//               <img
//                 className="dark:hidden"
//                 src="/images/logo/logo.svg"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//               />
//               <img
//                 className="hidden dark:block"
//                 src="/images/logo/logo-dark.svg"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//               />
//             </>
//           ) : (
//             <img
//               src="/images/logo/logo-icon.svg"
//               alt="Logo"
//               width={32}
//               height={32}
//             />
//           )}
//         </Link>
//       </div>
//       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//         <nav className="mb-6">
//           <div className="flex flex-col gap-4">
//             <div>
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "justify-start"
//                 }`}
//               >
//                 {!isExpanded ||
//                   !isHovered ||
//                   (!isMobileOpen && <HorizontaLDots className="size-6" />)}
//               </h2>
//               {renderMenuItems(allNavItems)}
//             </div>
//           </div>
//         </nav>
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;
