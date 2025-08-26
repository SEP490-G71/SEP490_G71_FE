// src/pages/superadmin/SuperAdminDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import axiosInstanceSuperAdmin from "../../../services/axiosInstanceSuperAdmin";

import Select from "react-select";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";

type Tx = Record<string, any>;

type Filters = {
  tenantCode: string;
  packageName: string;
  startDate: string;
  endDate: string;
};

type Stats = {
  paidPackageCount: number;
  totalRevenue: number;
  tenantCount: number;
};

type Tenant = {
  tenantCode?: string;
  code?: string;
  name?: string;
  displayName?: string;
  status?: "ACTIVE" | "INACTIVE" | string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
};

// [RENEW] kiểu dữ liệu gói dịch vụ (đoán trường phổ biến, vẫn an toàn nếu API trả thêm trường)
type ServicePackage = {
  id: string;
  name?: string;
  packageName?: string;
  durationMonths?: number;
  duration?: number;
  price?: number;
  amount?: number;
};

const toYMD = (d: Date | null) => (d ? dayjs(d).format("YYYY-MM-DD") : "");
const formatVND = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n)
    ? `${n.toLocaleString("vi-VN")} VNĐ`
    : String(v ?? "");
};
const formatDateUI = (v: any) =>
  dayjs(v).isValid() ? dayjs(v).format("DD/MM/YYYY") : "";

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<"transactions" | "tenants">(
    "transactions"
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [items, setItems] = useState<Tx[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const [tenantCode, setTenantCode] = useState("");
  const [pkg, setPkg] = useState<{ value: string; label: string } | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [filters, setFilters] = useState<Filters>({
    tenantCode: "",
    packageName: "",
    startDate: "",
    endDate: "",
  });

  const packageOptions = [
    { value: "Gói 3 tháng", label: "Gói 3 tháng" },
    { value: "Gói 6 tháng", label: "Gói 6 tháng" },
    { value: "Gói 12 tháng", label: "Gói 12 tháng" },
    { value: "Gói 24 tháng", label: "Gói 24 tháng" },
  ];

  const cols = [
    { key: "tenantCode", label: "MÃ TENANT" },
    { key: "packageName", label: "GÓI DỊCH VỤ" },
    { key: "quantity", label: "SỐ LƯỢNG" },
    { key: "price", label: "GIÁ" },
    { key: "startDate", label: "BẮT ĐẦU" },
    { key: "endDate", label: "KẾT THÚC" },
  ] as const;

  const buildParams = (p: number, s: number, f: Filters) => {
    const params: Record<string, any> = { page: p - 1, size: s };

    if (f.tenantCode.trim()) params.tenantCode = f.tenantCode.trim();
    if (f.packageName.trim()) params.packageName = f.packageName.trim();

    if (f.startDate) {
      const from = `${f.startDate}T00:00:00`;
      params.startDate = from;
      params.fromDate = from;
      params.createdFrom = from;
      params.createdAtFrom = from;
    }
    if (f.endDate) {
      const to = `${f.endDate}T23:59:59`;
      params.endDate = to;
      params.toDate = to;
      params.createdTo = to;
      params.createdAtTo = to;
    }
    return params;
  };

  const applyClientDateFilter = (list: Tx[], f: Filters) => {
    if (!f.startDate && !f.endDate) return list;

    const start = f.startDate ? dayjs(`${f.startDate} 00:00:00`) : null;
    const end = f.endDate ? dayjs(`${f.endDate} 23:59:59`) : null;

    return list.filter((row) => {
      const raw =
        row.createdAt ||
        row.created_at ||
        row.startDate ||
        row.start_date ||
        row.endDate ||
        row.end_date;

      if (!raw) return true;
      const d = dayjs(typeof raw === "string" ? raw.replace("T", " ") : raw);
      if (!d.isValid()) return true;
      if (start && d.isBefore(start)) return false;
      if (end && d.isAfter(end)) return false;
      return true;
    });
  };

  const fetchData = async (p = page, s = pageSize, f: Filters = filters) => {
    setLoading(true);
    try {
      const res = await axiosInstanceSuperAdmin.get("/transaction-history", {
        params: buildParams(p, s, f),
      });

      const body = res.data;
      let list: Tx[] = Array.isArray(body?.result?.content)
        ? body.result.content
        : Array.isArray(body?.content)
        ? body.content
        : Array.isArray(body)
        ? body
        : [];

      const before = list.length;
      list = applyClientDateFilter(list, f);
      const after = list.length;

      const total =
        typeof body?.result?.totalElements === "number"
          ? body.result.totalElements
          : typeof body?.totalElements === "number"
          ? body.totalElements
          : after;

      setItems(list);
      setTotalItems(total);

      if (f.startDate || f.endDate) {
        console.log(`[Filter] server=${before} → client=${after}`, f);
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Không tải được lịch sử giao dịch"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await axiosInstanceSuperAdmin.get(
        "/purchase-packages/statistics"
      );
      const body = res.data?.result || res.data;
      setStats({
        paidPackageCount: Number(body?.paidPackageCount ?? 0),
        totalRevenue: Number(body?.totalRevenue ?? 0),
        tenantCount: Number(body?.tenantCount ?? 0),
      });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Không tải được thống kê tổng hợp"
      );
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sa_token");
    localStorage.removeItem("superadmin_token");
    localStorage.removeItem("token");
    sessionStorage.clear();

    toast.success("Đã đăng xuất");
    setTimeout(() => {
      window.location.href = "/superadmin/signin";
    }, 400);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "transactions") {
      fetchData(page, pageSize, filters);
    }
  }, [page, pageSize, activeTab]);

  const data = useMemo(() => {
    if (totalItems === items.length) {
      const startIdx = (page - 1) * pageSize;
      return items.slice(startIdx, startIdx + pageSize);
    }
    return items;
  }, [items, totalItems, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const snap: Filters = {
      tenantCode,
      packageName: pkg?.value ?? "",
      startDate: toYMD(startDate),
      endDate: toYMD(endDate),
    };
    setFilters(snap);
    setPage(1);
    await fetchData(1, pageSize, snap);
  };

  const onReset = async () => {
    setTenantCode("");
    setPkg(null);
    setStartDate(null);
    setEndDate(null);
    const cleared: Filters = {
      tenantCode: "",
      packageName: "",
      startDate: "",
      endDate: "",
    };
    setFilters(cleared);
    setPage(1);
    await fetchData(1, pageSize, cleared);
  };

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [updating, setUpdating] = useState<Record<string, boolean>>({}); // map theo tenantCode

  const normalizedCode = (t: Tenant) => t.tenantCode || t.code || "";

  const fetchTenants = async () => {
    setLoadingTenants(true);
    try {
      const res = await axiosInstanceSuperAdmin.get("/tenants");
      const body = res.data?.result ?? res.data;
      const list: Tenant[] = Array.isArray(body?.content)
        ? body.content
        : Array.isArray(body?.items)
        ? body.items
        : Array.isArray(body?.data)
        ? body.data
        : Array.isArray(body)
        ? body
        : [];
      setTenants(list);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Không tải được danh sách tenants"
      );
    } finally {
      setLoadingTenants(false);
    }
  };

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    tenantCode: string;
    status: "ACTIVE" | "INACTIVE" | null;
  }>({ open: false, tenantCode: "", status: null });

  const askUpdateStatus = (
    tenantCode: string,
    status: "ACTIVE" | "INACTIVE"
  ) => {
    setConfirmModal({ open: true, tenantCode, status });
  };

  const confirmUpdate = async () => {
    if (!confirmModal.tenantCode || !confirmModal.status) return;
    const tenantCode = confirmModal.tenantCode;
    const status = confirmModal.status;

    setUpdating((m) => ({ ...m, [tenantCode]: true }));
    try {
      await axiosInstanceSuperAdmin.put(`/tenants/${tenantCode}`, { status });
      toast.success(
        `Cập nhật trạng thái "${tenantCode}" thành ${status} thành công`
      );
      await fetchTenants(); // refresh
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Cập nhật trạng thái thất bại"
      );
    } finally {
      setUpdating((m) => ({ ...m, [tenantCode]: false }));
      setConfirmModal({ open: false, tenantCode: "", status: null });
    }
  };

  useEffect(() => {
    if (activeTab === "tenants") {
      fetchTenants();
    }
  }, [activeTab]);

  // =========================
  // [RENEW] STATE & HELPERS
  // =========================
  const [renewModal, setRenewModal] = useState<{
    open: boolean;
    tenantCode: string;
  }>({ open: false, tenantCode: "" });

  const [loadingPackages, setLoadingPackages] = useState(false);
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [postingRenew, setPostingRenew] = useState(false);

  // [RENEW] mở modal & nạp danh sách gói
  const openRenewModal = async (tenantCode: string) => {
    setRenewModal({ open: true, tenantCode });
    setSelectedPackageId("");
    setLoadingPackages(true);
    try {
      const res = await axiosInstanceSuperAdmin.get("/service-packages");
      const body = res.data?.result ?? res.data;
      const list: ServicePackage[] = Array.isArray(body?.content)
        ? body.content
        : Array.isArray(body?.items)
        ? body.items
        : Array.isArray(body?.data)
        ? body.data
        : Array.isArray(body)
        ? body
        : [];

      setPackages(
        list
          .filter((p) => {
            if (!p || !(p as any).id) return false;

            // Nếu API có field isTrial
            if ((p as any).isTrial === true) return false;

            // Nếu API có packageType
            if ((p as any).packageType?.toUpperCase() === "TRIAL") return false;

            // Nếu chỉ có tên, lọc theo chữ "dùng thử" hoặc "trial"
            const label = ((p as any).name ?? (p as any).packageName ?? "")
              .toString()
              .toLowerCase();
            if (label.includes("dùng thử") || label.includes("trial"))
              return false;

            return true;
          })
          .map((p) => ({
            id: (p as any).id,
            name: (p as any).name ?? (p as any).packageName,
            packageName: (p as any).packageName ?? (p as any).name,
            durationMonths:
              (p as any).durationMonths ?? (p as any).duration ?? undefined,
            price: (p as any).price ?? (p as any).amount,
            amount: (p as any).amount ?? (p as any).price,
          }))
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Không tải được danh sách gói dịch vụ"
      );
    } finally {
      setLoadingPackages(false);
    }
  };

  const submitRenew = async () => {
    if (!renewModal.tenantCode) {
      toast.error("Thiếu tenantCode");
      return;
    }
    if (!selectedPackageId) {
      toast.error("Vui lòng chọn gói trước khi gia hạn");
      return;
    }

    setPostingRenew(true);
    try {
      await axiosInstanceSuperAdmin.post("/purchase-packages", {
        tenantCode: renewModal.tenantCode,
        packageId: selectedPackageId,
      });
      toast.success("Gia hạn thành công");
      setRenewModal({ open: false, tenantCode: "" });
      // có thể cập nhật thống kê/lịch sử nếu cần
      if (activeTab === "tenants") {
        await fetchTenants();
      } else {
        await fetchStats();
        await fetchData(1, pageSize, filters);
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Gia hạn thất bại"
      );
    } finally {
      setPostingRenew(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      {/* Top bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">
            Super Admin
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
            title="Đăng xuất"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="inline-flex rounded-lg border overflow-hidden">
          <button
            className={`px-4 py-2 text-sm ${
              activeTab === "transactions"
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            Lịch sử giao dịch
          </button>
          <button
            className={`px-4 py-2 text-sm border-l ${
              activeTab === "tenants"
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("tenants")}
          >
            Tenants
          </button>
        </div>
      </div>

      {activeTab === "transactions" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="rounded-lg border bg-white px-4 py-3 sm:py-4 shadow-sm">
              <div className="text-xs sm:text-sm text-gray-500 mb-1">
                Số gói đã mua
              </div>
              <div className="text-xl sm:text-2xl font-semibold">
                {loadingStats ? "…" : stats?.paidPackageCount ?? 0}
              </div>
            </div>
            <div className="rounded-lg border bg-white px-4 py-3 sm:py-4 shadow-sm">
              <div className="text-xs sm:text-sm text-gray-500 mb-1">
                Tổng doanh thu
              </div>
              <div className="text-xl sm:text-2xl font-semibold tabular-nums">
                {loadingStats ? "…" : formatVND(stats?.totalRevenue ?? 0)}
              </div>
            </div>
            <div className="rounded-lg border bg-white px-4 py-3 sm:py-4 shadow-sm">
              <div className="text-xs sm:text-sm text-gray-500 mb-1">
                Số tenant
              </div>
              <div className="text-xl sm:text-2xl font-semibold">
                {loadingStats ? "…" : stats?.tenantCount ?? 0}
              </div>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6 rounded-lg border bg-white p-3 sm:p-4"
          >
            <div className="col-span-1">
              <label className="block text-xs sm:text-sm mb-1">
                Tenant code
              </label>
              <input
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="VD: thucuc"
                value={tenantCode}
                onChange={(e) => setTenantCode(e.target.value)}
              />
            </div>

            <div className="col-span-1 overflow-visible">
              <label className="block text-xs sm:text-sm mb-1">
                Gói dịch vụ
              </label>
              <Select
                placeholder="Chọn gói"
                options={packageOptions}
                value={pkg}
                onChange={(v) => setPkg(v as any)}
                isClearable
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  menu: (base) => ({ ...base, zIndex: 9999 }),
                }}
                menuPlacement="auto"
                menuShouldScrollIntoView
              />
            </div>

            <div className="col-span-1">
              <label className="block text-xs sm:text-sm mb-1">Từ ngày</label>
              <DatePicker
                selected={startDate}
                onChange={(d) => setStartDate(d)}
                dateFormat="yyyy-MM-dd"
                placeholderText="YYYY-MM-DD"
                className="w-full border rounded-md px-3 py-2 text-sm"
                isClearable
                maxDate={endDate || undefined}
                portalId="datepicker-root"
                popperPlacement="bottom-start"
                popperClassName="!z-[9999]"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-xs sm:text-sm mb-1">Đến ngày</label>
              <DatePicker
                selected={endDate}
                onChange={(d) => setEndDate(d)}
                dateFormat="yyyy-MM-dd"
                placeholderText="YYYY-MM-DD"
                className="w-full border rounded-md px-3 py-2 text-sm"
                isClearable
                minDate={startDate || undefined}
                portalId="datepicker-root"
                popperPlacement="bottom-start"
                popperClassName="!z-[9999]"
              />
            </div>

            <div className="col-span-1 flex gap-2 sm:items-end">
              <button
                type="submit"
                className="flex-1 sm:flex-none sm:min-w-[110px] px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Đang tìm..." : "Tìm kiếm"}
              </button>
              <button
                type="button"
                className="flex-1 sm:flex-none sm:min-w-[90px] px-4 py-2 rounded-md border text-sm hover:bg-gray-50"
                onClick={onReset}
                disabled={loading}
              >
                Tải lại
              </button>
            </div>
          </form>

          <div className="w-full border rounded-lg overflow-hidden shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full text-xs sm:text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-[11px] sm:text-xs font-semibold uppercase sticky top-0 z-10">
                  <tr>
                    <th className="px-3 sm:px-4 py-3">STT</th>
                    {cols.map((c) => (
                      <th
                        key={c.key}
                        className={`px-3 sm:px-4 py-3 whitespace-nowrap ${
                          c.key === "price" ? "text-center" : ""
                        }`}
                      >
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        className="px-4 py-10 text-center"
                        colSpan={1 + cols.length}
                      >
                        Đang tải…
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td
                        className="px-4 py-8 text-center"
                        colSpan={1 + cols.length}
                      >
                        Chưa có giao dịch
                      </td>
                    </tr>
                  ) : (
                    data.map((row, idx) => (
                      <tr
                        key={idx}
                        className="odd:bg-white even:bg-gray-50 hover:bg-gray-100/70"
                      >
                        <td className="px-3 sm:px-4 py-3">
                          {(page - 1) * pageSize + idx + 1}
                        </td>
                        {cols.map((c) => {
                          const v = row[c.key];
                          if (c.key === "price") {
                            return (
                              <td
                                key={c.key}
                                className="px-3 sm:px-4 py-3 whitespace-nowrap text-right tabular-nums"
                                title={formatVND(v)}
                              >
                                {formatVND(v)}
                              </td>
                            );
                          }
                          if (c.key === "tenantCode") {
                            return (
                              <td key={c.key} className="px-3 sm:px-4 py-3">
                                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-800">
                                  {String(v ?? "")}
                                </span>
                              </td>
                            );
                          }
                          if (c.key === "packageName") {
                            return (
                              <td key={c.key} className="px-3 sm:px-4 py-3">
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                                  {String(v ?? "")}
                                </span>
                              </td>
                            );
                          }
                          if (c.key === "startDate" || c.key === "endDate") {
                            return (
                              <td
                                key={c.key}
                                className="px-3 sm:px-4 py-3 whitespace-nowrap"
                              >
                                {v ? formatDateUI(v) : ""}
                              </td>
                            );
                          }
                          return (
                            <td
                              key={c.key}
                              className="px-3 sm:px-4 py-3 whitespace-nowrap"
                            >
                              {String(v ?? "")}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 sm:px-4 py-3 border-t text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>Hiển thị</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPageSize(v);
                    setPage(1);
                  }}
                  className="border rounded px-2 py-1"
                >
                  {[5, 10, 20, 50].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span>
                  trên <span className="font-medium">{totalItems}</span> kết quả
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => page > 1 && setPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
                >
                  ←
                </button>
                <span>
                  Trang <span className="font-medium">{page}</span> /{" "}
                  {totalPages}
                </span>
                <button
                  onClick={() => page < totalPages && setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "tenants" && (
        <div className="w-full border rounded-lg overflow-hidden shadow-sm bg-white">
          <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b">
            <h2 className="text-sm sm:text-base font-semibold">
              Danh sách Tenants
            </h2>
            <button
              className="px-3 py-1.5 text-sm rounded border hover:bg-gray-50"
              onClick={fetchTenants}
              disabled={loadingTenants}
              title="Tải lại"
            >
              {loadingTenants ? "Đang tải…" : "Tải lại"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full text-xs sm:text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-[11px] sm:text-xs font-semibold uppercase">
                <tr>
                  <th className="px-3 sm:px-4 py-3">STT</th>
                  <th className="px-3 sm:px-4 py-3 whitespace-nowrap">
                    MÃ TENANT
                  </th>
                  <th className="px-3 sm:px-4 py-3 whitespace-nowrap">
                    TÊN HIỂN THỊ
                  </th>
                  <th className="px-3 sm:px-4 py-3 whitespace-nowrap">
                    TRẠNG THÁI
                  </th>

                  <th className="px-3 sm:px-4 py-3 whitespace-nowrap text-center">
                    HÀNH ĐỘNG
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loadingTenants ? (
                  <tr>
                    <td className="px-4 py-10 text-center" colSpan={6}>
                      Đang tải…
                    </td>
                  </tr>
                ) : tenants.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-center" colSpan={6}>
                      Chưa có tenant
                    </td>
                  </tr>
                ) : (
                  tenants.map((t, idx) => {
                    const code = normalizedCode(t);
                    const display = t.displayName || t.name || code || "";
                    const status = (t.status || "").toUpperCase() as
                      | "ACTIVE"
                      | "INACTIVE"
                      | string;

                    return (
                      <tr
                        key={code || idx}
                        className="odd:bg-white even:bg-gray-50"
                      >
                        <td className="px-3 sm:px-4 py-3">{idx + 1}</td>
                        <td className="px-3 sm:px-4 py-3">
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-800">
                            {code}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-3">{display}</td>
                        <td className="px-3 sm:px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${
                              status === "ACTIVE"
                                ? "bg-green-50 text-green-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {status || "UNKNOWN"}
                          </span>
                        </td>

                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-center">
                          <div className="inline-flex gap-2">
                            <button
                              className="px-3 py-1.5 rounded-md border text-xs sm:text-sm hover:bg-gray-50"
                              disabled={!!updating[code]}
                              onClick={() => askUpdateStatus(code, "ACTIVE")}
                              title="Đặt ACTIVE"
                            >
                              {updating[code] ? "..." : "Kích hoạt"}
                            </button>
                            <button
                              className="px-3 py-1.5 rounded-md border text-xs sm:text-sm hover:bg-gray-50"
                              disabled={!!updating[code]}
                              onClick={() => askUpdateStatus(code, "INACTIVE")}
                              title="Đặt INACTIVE"
                            >
                              {updating[code] ? "..." : "Tạm dừng"}
                            </button>

                            {/* [RENEW] nút Gia hạn */}
                            <button
                              className="px-3 py-1.5 rounded-md border text-xs sm:text-sm hover:bg-gray-50"
                              onClick={() => openRenewModal(code)}
                              title="Gia hạn gói"
                            >
                              Gia hạn
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-[90%] max-w-sm rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Xác nhận cập nhật</h3>
            <p className="mb-6">
              Bạn có chắc muốn cập nhật tenant{" "}
              <span className="font-semibold">{confirmModal.tenantCode}</span>{" "}
              thành <span className="font-semibold">{confirmModal.status}</span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded border hover:bg-gray-100"
                onClick={() =>
                  setConfirmModal({ open: false, tenantCode: "", status: null })
                }
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={confirmUpdate}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          [RENEW] Modal Gia hạn
          ========================= */}
      {renewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-[92%] max-w-lg rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Gia hạn tenant:{" "}
              <span className="font-semibold">{renewModal.tenantCode}</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Chọn gói</label>
                <div className="border rounded">
                  {loadingPackages ? (
                    <div className="p-3 text-sm text-gray-600">Đang tải…</div>
                  ) : packages.length === 0 ? (
                    <div className="p-3 text-sm text-gray-600">
                      Không có gói khả dụng
                    </div>
                  ) : (
                    <ul className="max-h-64 overflow-auto divide-y">
                      {packages.map((p) => {
                        const label =
                          p.packageName ||
                          p.name ||
                          `Gói ${p.durationMonths ?? ""} tháng`;
                        const duration =
                          p.durationMonths ?? p.duration ?? undefined;
                        const price = p.amount ?? p.price;
                        return (
                          <li
                            key={p.id}
                            className={`p-3 cursor-pointer hover:bg-gray-50 ${
                              selectedPackageId === p.id ? "bg-blue-50" : ""
                            }`}
                            onClick={() => setSelectedPackageId(p.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{label}</div>
                                <div className="text-xs text-gray-600">
                                  {duration
                                    ? `Thời hạn: ${duration} tháng`
                                    : " "}
                                </div>
                              </div>
                              <div className="text-sm font-semibold tabular-nums">
                                {price ? formatVND(price) : ""}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded border hover:bg-gray-100"
                onClick={() => setRenewModal({ open: false, tenantCode: "" })}
                disabled={postingRenew}
              >
                Đóng
              </button>
              <button
                className={`px-4 py-2 rounded text-white ${
                  postingRenew
                    ? "bg-blue-400"
                    : selectedPackageId
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-300 cursor-not-allowed"
                }`}
                onClick={submitRenew}
                disabled={postingRenew || !selectedPackageId}
              >
                {postingRenew ? "Đang xử lý…" : "Xác nhận gia hạn"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
