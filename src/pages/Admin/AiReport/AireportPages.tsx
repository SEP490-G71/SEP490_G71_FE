import { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  Group,
  Title,
  Text,
  Loader,
  Stack,
  Badge,
  NumberFormatter,
  Modal,
  Divider,
  ScrollArea,
  CopyButton,
  ActionIcon,
  Tooltip,
  Paper,
  List,
  ThemeIcon,
  Table,
  Select,
  Button,
} from "@mantine/core";
import { MonthPickerInput, DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import axiosInstance from "../../../services/axiosInstance";

import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  registerables,
  type ChartData,
  type ChartOptions,
} from "chart.js";

ChartJS.register(...registerables);
import { IconCheck, IconCopy, IconCircleDot } from "@tabler/icons-react";
import CustomTable from "../../../components/common/CustomTable";
import { toast } from "react-toastify";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";

interface InvoiceDailyRow {
  date: string;
  revenue: number;
  expected: number;
  diffPct?: number;
  level?: string;
  direction?: "UP" | "DOWN" | string;
}
interface InvoicesDailyPayload {
  month: string;
  monthlyTarget?: number;
  totalToDate?: number;
  expectedToDate?: number;
  diffPctToDate?: number;
  levelToDate?: string;
  data: InvoiceDailyRow[];
}

interface MetricItem {
  id: string;
  metricCode: string;
  periodStart: string;
  periodEnd: string;
  level: "CRITICAL" | "WARN" | "OK" | string;
  actualValue: number;
  targetValue: number;
  diffPct: number;
  momPct: number;
}

interface MetricDetail extends MetricItem {
  payloadJson?: unknown | string;
}

interface MetricsResponse {
  content: MetricItem[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const AireportPages = () => {
  const [monthStr, setMonthStr] = useState<string>(dayjs().format("YYYY-MM"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<InvoicesDailyPayload | null>(null);

  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [mtPage, setMtPage] = useState(1);
  const [mtPageSize, setMtPageSize] = useState(10);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<MetricDetail | null>(null);

  // Abort controller để tránh race khi đổi trang/size nhanh
  const metricsAbortRef = useRef<AbortController | null>(null);

  const monthParam = useMemo(() => {
    if (!monthStr) return "";
    const d = dayjs(monthStr, ["YYYY-MM", "YYYY-MM-DD"], true);
    return d.isValid()
      ? d.format("YYYY-MM")
      : dayjs(monthStr).format("YYYY-MM");
  }, [monthStr]);

  const fetchDailyInvoices = async () => {
    if (!monthParam) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/invoices/daily`, {
        params: { month: monthParam },
      });
      setPayload(res.data?.result ?? null);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Lỗi chưa phân loại";
      setError(msg);
      toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDailyInvoices();
  }, [monthParam]);

  // --- FILTER (đang nhập) ---
  const [fltStart, setFltStart] = useState<Date | null>(null);
  const [fltEnd, setFltEnd] = useState<Date | null>(null);
  const [fltLevel, setFltLevel] = useState<string | null>(null); // ALL | CRITICAL | WARN | OK

  // --- FILTER ĐÃ ÁP DỤNG (chỉ đổi khi bấm Tìm kiếm) ---
  const [appliedStart, setAppliedStart] = useState<Date | null>(null);
  const [appliedEnd, setAppliedEnd] = useState<Date | null>(null);
  const [appliedLevel, setAppliedLevel] = useState<string | null>(null);

  const toYMD = (d: Date | null) =>
    d ? dayjs(d).format("YYYY-MM-DD") : undefined;

  // Đảm bảo To >= From khi nhập
  useEffect(() => {
    if (fltStart && fltEnd && dayjs(fltEnd).isBefore(fltStart, "day")) {
      setFltEnd(fltStart);
    }
  }, [fltStart, fltEnd]);

  // ======= Helpers Việt hoá =======

  // [VI] Mapping level → tiếng Việt thống nhất trên toàn file
  const levelVi = (level?: string) => {
    switch ((level || "").toUpperCase()) {
      case "CRITICAL":
        return "Nguy cấp";
      case "WARN":
      case "WARNING":
        return "Cảnh báo";
      case "OK":
      case "NORMAL":
        return "Ổn định";
      default:
        return level || "-";
    }
  };

  // [VI] Mapping direction → tiếng Việt
  const directionVi = (dir?: string) => {
    switch ((dir || "").toUpperCase()) {
      case "UP":
        return "Tăng";
      case "DOWN":
        return "Giảm";
      default:
        return dir || "-";
    }
  };

  // [VI] Mapping impact → màu + nhãn tiếng Việt
  const impactColor = (impact?: string) =>
    impact?.toLowerCase() === "high"
      ? "red"
      : impact?.toLowerCase() === "medium"
      ? "yellow"
      : impact?.toLowerCase() === "low"
      ? "green"
      : "gray";

  const impactVi = (impact?: string) => {
    switch ((impact || "").toLowerCase()) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return impact || "-";
    }
  };

  // Fetch metrics (đọc từ applied*)
  const fetchMetrics = async (opts?: { page?: number; size?: number }) => {
    if (metricsAbortRef.current) metricsAbortRef.current.abort();
    const controller = new AbortController();
    metricsAbortRef.current = controller;

    setMetricsLoading(true);
    setMetricsError(null);
    try {
      const params: Record<string, any> = {
        page: opts?.page ?? mtPage - 1,
        size: opts?.size ?? mtPageSize,
        metricCode: "dailyRevenue",
      };

      const start = toYMD(appliedStart);
      const end = toYMD(appliedEnd);
      if (start && end) {
        params.fromDate = start;
        params.toDate = end;
      } else if (start && !end) {
        params.fromDate = start;
        params.toDate = start;
      }
      if (appliedLevel && appliedLevel !== "ALL") params.level = appliedLevel;

      const res = await axiosInstance.get(`/metrics`, {
        params,
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;
      setMetrics(res.data?.result ?? null);
    } catch (e: any) {
      if (e?.name === "CanceledError" || e?.message === "canceled") return;
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Không tải được chỉ số (metrics)";
      setMetricsError(msg);
      toast.error(msg, { position: "top-right", autoClose: 3000 });
    } finally {
      if (!metricsAbortRef.current?.signal.aborted) setMetricsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    return () => {
      if (metricsAbortRef.current) metricsAbortRef.current.abort();
    };
  }, [mtPage, mtPageSize]);

  useEffect(() => {
    const changed =
      appliedStart !== null ||
      appliedEnd !== null ||
      appliedLevel !== null ||
      true;
    if (!changed) return;

    if (mtPage !== 1) {
      setMtPage(1);
    } else {
      fetchMetrics({ page: 0 });
    }
  }, [appliedStart, appliedEnd, appliedLevel]);

  const handleApplyFilters = () => {
    setAppliedStart(fltStart);
    setAppliedEnd(fltEnd);
    setAppliedLevel(fltLevel || "ALL");
  };

  const handleResetFilters = () => {
    setFltStart(null);
    setFltEnd(null);
    setFltLevel(null);
    setAppliedStart(null);
    setAppliedEnd(null);
    setAppliedLevel(null);
    if (mtPage !== 1) setMtPage(1);
  };

  const handleViewMetric = async (row: MetricItem) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetail(null);
    try {
      const res = await axiosInstance.get(`/metrics/${row.id}`);
      const raw: MetricDetail = res.data?.result ?? null;
      if (raw) {
        let parsed: unknown = raw.payloadJson;
        if (typeof parsed === "string") {
          try {
            parsed = JSON.parse(parsed);
          } catch {}
        }
        setDetail({ ...raw, payloadJson: parsed });
      } else {
        setDetail(null);
      }
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Không tải được chi tiết chỉ số";
      toast.error(msg, { position: "top-right", autoClose: 3000 });
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const chartData = useMemo<ChartData<"bar" | "line", number[], string>>(() => {
    const days = payload?.data ?? [];
    const labels = days.map((d) => dayjs(d.date).format("DD"));
    const revenueBgColors = days.map((d) =>
      d?.direction === "UP" ? "rgba(34,197,94,0.7)" : "rgba(239,68,68,0.7)"
    );
    const revenueBorderColors = days.map((d) =>
      d?.direction === "UP" ? "rgba(34,197,94,1)" : "rgba(239,68,68,1)"
    );
    return {
      labels,
      datasets: [
        {
          type: "bar",
          label: "Doanh thu", // [VI] "Revenue" → "Doanh thu"
          data: days.map((d) => d.revenue ?? 0),
          backgroundColor: revenueBgColors,
          borderColor: revenueBorderColors,
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          type: "line",
          label: "Kỳ vọng", // [VI] "Expected" → "Kỳ vọng" (hoặc "Mục tiêu" tuỳ ngữ cảnh)
          data: days.map((d) => d.expected ?? 0),
          borderColor: "rgba(59,130,246,1)",
          backgroundColor: "rgba(59,130,246,0.15)",
          borderWidth: 2,
          tension: 0.3,
          fill: false,
          yAxisID: "y",
        },
      ],
    };
  }, [payload]);

  const options = useMemo<ChartOptions<"bar" | "line">>(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: `Doanh thu theo ngày – ${payload?.month ?? monthParam}`, // [VI]
        },
        tooltip: {
          callbacks: {
            afterBody: (items: any[]) => {
              const idx = items?.[0]?.dataIndex ?? 0;
              const row = payload?.data?.[idx];
              if (!row) return "";
              const parts: string[] = [];
              if (typeof row.diffPct === "number")
                parts.push(`Chênh lệch %: ${row.diffPct}%`); // [VI]
              if (row.level) parts.push(`Mức độ: ${levelVi(row.level)}`); // [VI]
              if (row.direction)
                parts.push(`Xu hướng: ${directionVi(row.direction)}`); // [VI]
              return parts.join("\n");
            },
          },
        },
      },
      scales: {
        x: { stacked: false },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (v: any) =>
              new Intl.NumberFormat("vi-VN").format(Number(v)),
          },
          title: { display: true, text: "VNĐ" }, // [VI] "VND" → "VNĐ"
        },
      },
    };
  }, [payload, monthParam]);

  const columns = [
    { key: "metricCode", label: "Mã chỉ số", sortable: true }, // [VI]
    {
      key: "periodStart",
      label: "Từ ngày", // [VI] "Start Date"
      render: (row: MetricItem) => dayjs(row.periodStart).format("DD/MM/YYYY"),
    },
    {
      key: "periodEnd",
      label: "Đến ngày", // [VI] "End Date"
      render: (row: MetricItem) => dayjs(row.periodEnd).format("DD/MM/YYYY"),
    },
    {
      key: "level",
      label: "Mức độ", // [VI]
      render: (row: MetricItem) => (
        <Badge
          color={
            row.level === "CRITICAL"
              ? "red"
              : row.level === "WARN"
              ? "orange"
              : row.level === "OK"
              ? "green"
              : "green"
          }
          variant="light"
        >
          {levelVi(row.level)}
        </Badge>
      ),
    },
    {
      key: "actualValue",
      label: "Thực tế", // [VI] "Actual"
      render: (row: MetricItem) => (
        <NumberFormatter
          value={row.actualValue}
          thousandSeparator
          suffix=" VND"
        />
      ),
    },
    {
      key: "targetValue",
      label: "Mục tiêu", // [VI] "Target"
      render: (row: MetricItem) => (
        <NumberFormatter
          value={row.targetValue}
          thousandSeparator
          suffix=" VND"
        />
      ),
    },
    {
      key: "diffPct",
      label: "Chênh lệch %", // [VI] "Diff %"
      render: (row: MetricItem) => `${row.diffPct}%`,
    },
    {
      key: "momPct",
      label: "MoM % (so với tháng trước)", // [VI] rõ nghĩa
      render: (row: MetricItem) => `${row.momPct}%`,
    },
  ] as const;

  const payloadText = useMemo(() => {
    if (!detail) return "";
    try {
      return JSON.stringify(detail.payloadJson ?? {}, null, 2);
    } catch {
      return String(detail.payloadJson ?? "");
    }
  }, [detail]);

  const renderKV = (obj: any) => {
    if (!obj || typeof obj !== "object") {
      return <Text>{String(obj)}</Text>;
    }
    const rows = Object.entries(obj).map(([k, v]) => (
      <Table.Tr key={k}>
        <Table.Td w={180}>
          <Text fw={500}>{k}</Text>
        </Table.Td>
        <Table.Td>
          {Array.isArray(v) ? (
            <List spacing={4} size="sm">
              {v.map((it, i) => (
                <List.Item
                  key={i}
                  icon={
                    <ThemeIcon size={16} radius="xl" variant="light">
                      <IconCircleDot size={12} />
                    </ThemeIcon>
                  }
                >
                  {typeof it === "object" ? renderKV(it) : String(it)}
                </List.Item>
              ))}
            </List>
          ) : typeof v === "object" ? (
            renderKV(v)
          ) : (
            <Text>{String(v)}</Text>
          )}
        </Table.Td>
      </Table.Tr>
    ));
    return (
      <Table striped withTableBorder withColumnBorders highlightOnHover>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    );
  };

  const renderPayloadContent = (payload: any) => {
    if (!payload) return <Text c="dimmed">—</Text>;

    const summary = (payload.summary ?? payload.report ?? payload.note) as
      | string
      | undefined;

    const strategies = Array.isArray(payload.strategies)
      ? payload.strategies
      : undefined;

    const insights = Array.isArray(payload.insights)
      ? payload.insights
      : undefined;

    if (summary || strategies || insights) {
      return (
        <Stack gap="sm">
          {summary && (
            <Paper p="sm" radius="md" withBorder>
              <Text fw={600} mb={4}>
                Tổng quan {/* [VI] */}
              </Text>
              <Text>{summary}</Text>
            </Paper>
          )}

          {insights && insights.length > 0 && (
            <Paper p="sm" radius="md" withBorder>
              <Text fw={600} mb={6}>
                Điểm nổi bật {/* [VI] */}
              </Text>
              <List
                spacing={6}
                size="sm"
                icon={<ThemeIcon size={16} radius="xl" />}
              >
                {insights.map((tip: any, i: number) => (
                  <List.Item key={i}>{String(tip)}</List.Item>
                ))}
              </List>
            </Paper>
          )}

          {strategies && strategies.length > 0 && (
            <Stack gap="sm">
              <Text fw={600}>Chiến lược đề xuất</Text> {/* [VI] */}
              {strategies.map((s: any, idx: number) => (
                <Paper key={idx} p="sm" radius="md" withBorder>
                  <Group justify="space-between" align="center" mb={6}>
                    <Text fw={600}>{s.title ?? `Chiến lược #${idx + 1}`}</Text>
                    {s.impact && (
                      <Badge color={impactColor(s.impact)} variant="light">
                        Tác động: {impactVi(s.impact)} {/* [VI] */}
                      </Badge>
                    )}
                  </Group>
                  <Group gap="xl" mb={6}>
                    {"eta_days" in s && (
                      <Text size="sm" c="dimmed">
                        Dự kiến hoàn thành:{" "}
                        <Text span fw={600}>
                          {s.eta_days}
                        </Text>{" "}
                        ngày
                      </Text>
                    )}
                  </Group>
                  {Array.isArray(s.actions) && s.actions.length > 0 && (
                    <>
                      <Text size="sm" c="dimmed" mb={4}>
                        Hành động:
                      </Text>
                      <List spacing={4} size="sm">
                        {s.actions.map((a: any, i: number) => (
                          <List.Item key={i}>{String(a)}</List.Item>
                        ))}
                      </List>
                    </>
                  )}
                </Paper>
              ))}
            </Stack>
          )}
        </Stack>
      );
    }

    return renderKV(payload);
  };

  return (
    <div className="p-6">
      <Title order={3} className="mb-2">
        Doanh thu hàng ngày theo tháng {/* [VI] */}
      </Title>

      <Group gap="md" align="center" className="mb-4">
        <MonthPickerInput
          value={monthStr as any}
          onChange={(v) => setMonthStr((v as any) ?? "")}
          maxDate={new Date()}
          valueFormat="YYYY-MM"
          placeholder="YYYY-MM"
          clearable
        />
      </Group>

      <Stack gap="xs" className="mb-3">
        <Group gap="sm">
          <Badge variant="light" radius="sm">
            Tháng: {payload?.month ?? monthParam} {/* [VI] */}
          </Badge>
          {typeof payload?.monthlyTarget === "number" && (
            <Badge color="grape" variant="light" radius="sm">
              Mục tiêu:{" "}
              <NumberFormatter
                value={payload.monthlyTarget}
                thousandSeparator
              />
            </Badge>
          )}
          {typeof payload?.totalToDate === "number" && (
            <Badge color="blue" variant="light" radius="sm">
              Tổng doanh thu thực tế Σ:{" "}
              <NumberFormatter value={payload.totalToDate} thousandSeparator />
            </Badge>
          )}
          {typeof payload?.expectedToDate === "number" && (
            <Badge color="red" variant="light" radius="sm">
              Doanh thu mục tiêu Σ:{" "}
              <NumberFormatter
                value={payload.expectedToDate}
                thousandSeparator
              />
            </Badge>
          )}
          {typeof payload?.diffPctToDate === "number" && (
            <Badge
              color={payload?.levelToDate === "CRITICAL" ? "red" : "yellow"}
              variant="light"
              radius="sm"
            >
              {/* [VI] "Δ% to date" → "Chênh lệch % đến hiện tại" (ngắn gọn, đúng nghĩa) */}
              Chênh lệch % đến hiện tại: {payload.diffPctToDate}% (
              {levelVi(payload?.levelToDate)})
            </Badge>
          )}
        </Group>
      </Stack>

      <Card
        shadow="sm"
        radius="lg"
        padding="lg"
        className="w-full h-[520px] mb-6"
      >
        {loading ? (
          <Group justify="center" align="center" className="h-full">
            <Loader />
          </Group>
        ) : error ? (
          <Group justify="center" align="center" className="h-full">
            <Text c="red">{error}</Text>
          </Group>
        ) : payload?.data?.length ? (
          <Chart type="bar" data={chartData} options={options} />
        ) : (
          <Group justify="center" align="center" className="h-full">
            <Text c="dimmed">Không có dữ liệu cho tháng đã chọn.</Text>
          </Group>
        )}
      </Card>

      <Title order={4} className="mb-2">
        Chỉ số (Metrics) {/* [VI] thêm chú thích */}
      </Title>
      <Card shadow="sm" radius="lg" padding="lg" className="w-full">
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-3">
            <FloatingLabelWrapper label="Từ ngày">
              {" "}
              {/* [VI] From */}
              <DateInput
                placeholder="YYYY-MM-DD"
                value={fltStart}
                onChange={(v) => setFltStart(v as Date | null)}
                valueFormat="YYYY-MM-DD"
                clearable
              />
            </FloatingLabelWrapper>
          </div>

          <div className="col-span-3">
            <FloatingLabelWrapper label="Đến ngày">
              {" "}
              {/* [VI] To */}
              <DateInput
                placeholder="YYYY-MM-DD"
                value={fltEnd}
                onChange={(v) => setFltEnd(v as Date | null)}
                valueFormat="YYYY-MM-DD"
                clearable
                minDate={fltStart || undefined}
              />
            </FloatingLabelWrapper>
          </div>

          <div className="col-span-3">
            <FloatingLabelWrapper label="Mức độ">
              {" "}
              {/* [VI] Level */}
              <Select
                placeholder="Tất cả" // [VI] All
                value={fltLevel}
                onChange={setFltLevel}
                data={[
                  { value: "ALL", label: "Tất cả" }, // [VI]
                  { value: "CRITICAL", label: "Nguy cấp" }, // [VI]
                  { value: "WARN", label: "Cảnh báo" }, // [VI]
                  { value: "OK", label: "Ổn định" }, // [VI]
                ]}
                clearable
              />
            </FloatingLabelWrapper>
          </div>

          <div className="col-span-3 flex gap-2 items-end">
            <Button
              variant="filled"
              color="blue"
              onClick={handleApplyFilters}
              className="flex-1"
            >
              Tìm kiếm {/* [VI] Search */}
            </Button>
            <Button
              variant="light"
              color="gray"
              onClick={handleResetFilters}
              className="flex-1"
            >
              Tải lại {/* [VI] Reset */}
            </Button>
          </div>
        </div>

        <CustomTable<MetricItem>
          data={metrics?.content ?? []}
          columns={columns as any}
          page={mtPage}
          pageSize={mtPageSize}
          totalItems={metrics?.totalElements ?? 0}
          onPageChange={(p) => setMtPage(p)}
          onPageSizeChange={(s) => {
            const size = s || 10;
            setMtPageSize(size);
            setMtPage(1);
          }}
          loading={metricsLoading}
          emptyText={metricsError ?? "Không có chỉ số"} // [VI]
          showActions={true}
          onView={handleViewMetric}
        />
      </Card>

      <Modal
        opened={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={
          <div>
            <h2 className="text-xl font-bold">Chi tiết chỉ số</h2> {/* [VI] */}
            <div className="mt-2 border-b border-gray-300" />
          </div>
        }
        size={800}
        centered
        radius="md"
        overlayProps={{ opacity: 0.2, blur: 2 }}
      >
        {detailLoading ? (
          <Group justify="center" py="md">
            <Loader />
          </Group>
        ) : !detail ? (
          <Text c="dimmed">Không có dữ liệu chi tiết.</Text>
        ) : (
          <Stack gap="xs">
            <Group gap="sm">
              <Badge variant="light" color="blue" tt="uppercase">
                {detail.metricCode}
              </Badge>
              <Badge
                variant="light"
                color={
                  detail.level === "CRITICAL"
                    ? "red"
                    : detail.level === "WARN"
                    ? "orange"
                    : detail.level === "OK"
                    ? "green"
                    : "green"
                }
                tt="uppercase"
              >
                {levelVi(detail.level)} {/* [VI] */}
              </Badge>
            </Group>

            <Divider my="xs" />

            <Group gap="xl" wrap="nowrap">
              <Stack gap={2} style={{ minWidth: 200 }}>
                <Text size="sm" c="dimmed">
                  Từ ngày {/* [VI] */}
                </Text>
                <Text>{dayjs(detail.periodStart).format("DD/MM/YYYY")}</Text>
              </Stack>
              <Stack gap={2} style={{ minWidth: 200 }}>
                <Text size="sm" c="dimmed">
                  Đến ngày {/* [VI] */}
                </Text>
                <Text>{dayjs(detail.periodEnd).format("DD/MM/YYYY")}</Text>
              </Stack>
            </Group>

            <Group gap="xl" wrap="nowrap" mt="xs">
              <Stack gap={2} style={{ minWidth: 200 }}>
                <Text size="sm" c="dimmed">
                  Thực tế {/* [VI] */}
                </Text>
                <Text fw={700}>
                  <NumberFormatter
                    value={detail.actualValue}
                    thousandSeparator
                    suffix=" VND"
                  />
                </Text>
              </Stack>
              <Stack gap={2} style={{ minWidth: 200 }}>
                <Text size="sm" c="dimmed">
                  Mục tiêu {/* [VI] */}
                </Text>
                <Text fw={700}>
                  <NumberFormatter
                    value={detail.targetValue}
                    thousandSeparator
                    suffix=" VND"
                  />
                </Text>
              </Stack>
            </Group>

            <Group gap="xl" wrap="nowrap" mt="xs">
              <Stack gap={2} style={{ minWidth: 200 }}>
                <Text size="sm" c="dimmed">
                  Chênh lệch % {/* [VI] */}
                </Text>
                <Text>{detail.diffPct}%</Text>
              </Stack>
              <Stack gap={2} style={{ minWidth: 200 }}>
                <Text size="sm" c="dimmed">
                  MoM % (so với tháng trước) {/* [VI] */}
                </Text>
                <Text>{detail.momPct}%</Text>
              </Stack>
            </Group>

            <Divider my="sm" />

            <Group justify="space-between" align="center">
              <Text fw={600}>Nội dung báo cáo</Text> {/* [VI] Report content */}
              {payloadText && (
                <CopyButton value={payloadText}>
                  {({ copied, copy }) => (
                    <Tooltip
                      label={copied ? "Đã sao chép" : "Sao chép JSON"}
                      withArrow
                    >
                      <ActionIcon variant="light" onClick={copy}>
                        {copied ? (
                          <IconCheck size={16} />
                        ) : (
                          <IconCopy size={16} />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              )}
            </Group>

            <ScrollArea h={260} type="auto">
              <Stack gap="sm">{renderPayloadContent(detail.payloadJson)}</Stack>
            </ScrollArea>
          </Stack>
        )}
      </Modal>
    </div>
  );
};
