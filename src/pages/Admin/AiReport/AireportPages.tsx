import { useEffect, useMemo, useState } from "react";
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
} from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import axiosInstance from "../../../services/axiosInstance";

import { Chart } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { IconCheck, IconCopy, IconCircleDot } from "@tabler/icons-react";
import CustomTable from "../../../components/common/CustomTable";
import { toast } from "react-toastify";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ChartTitle,
  ChartTooltip,
  Legend
);

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

  const fetchMetrics = async () => {
    setMetricsLoading(true);
    setMetricsError(null);
    try {
      const res = await axiosInstance.get(`/metrics`, {
        params: {
          page: mtPage - 1,
          size: mtPageSize,
          metricCode: "dailyRevenue",
        },
      });
      setMetrics(res.data?.result ?? null);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Không tải được metrics";

      setMetricsError(msg);
      toast.error(msg, { position: "top-right", autoClose: 3000 });
    } finally {
      setMetricsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [mtPage, mtPageSize]);

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
        "Không tải được chi tiết metric";

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
          label: "Revenue",
          data: days.map((d) => d.revenue ?? 0),
          backgroundColor: revenueBgColors,
          borderColor: revenueBorderColors,
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          type: "line",
          label: "Expected",
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
          text: `Daily Revenue – ${payload?.month ?? monthParam}`,
        },
        tooltip: {
          callbacks: {
            afterBody: (items: any[]) => {
              const idx = items?.[0]?.dataIndex ?? 0;
              const row = payload?.data?.[idx];
              if (!row) return "";
              const parts: string[] = [];
              if (typeof row.diffPct === "number")
                parts.push(`Diff %: ${row.diffPct}%`);
              if (row.level) parts.push(`Level: ${row.level}`);
              if (row.direction) parts.push(`Direction: ${row.direction}`);
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
          title: { display: true, text: "VND" },
        },
      },
    };
  }, [payload, monthParam]);

  const columns = [
    { key: "metricCode", label: "Metric", sortable: true },
    {
      key: "periodStart",
      label: "Start Date",
      render: (row: MetricItem) => dayjs(row.periodStart).format("DD/MM/YYYY"),
    },
    {
      key: "periodEnd",
      label: "End Date",
      render: (row: MetricItem) => dayjs(row.periodEnd).format("DD/MM/YYYY"),
    },
    {
      key: "level",
      label: "Level",
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
          {row.level}
        </Badge>
      ),
    },
    {
      key: "actualValue",
      label: "Actual",
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
      label: "Target",
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
      label: "Diff %",
      render: (row: MetricItem) => `${row.diffPct}%`,
    },
    {
      key: "momPct",
      label: "MoM %",
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

  const impactColor = (impact?: string) =>
    impact?.toLowerCase() === "high"
      ? "red"
      : impact?.toLowerCase() === "medium"
      ? "yellow"
      : impact?.toLowerCase() === "low"
      ? "green"
      : "gray";

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
                Tổng quan
              </Text>
              <Text>{summary}</Text>
            </Paper>
          )}

          {insights && insights.length > 0 && (
            <Paper p="sm" radius="md" withBorder>
              <Text fw={600} mb={6}>
                Điểm nổi bật
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
              <Text fw={600}>Chiến lược đề xuất</Text>
              {strategies.map((s: any, idx: number) => (
                <Paper key={idx} p="sm" radius="md" withBorder>
                  <Group justify="space-between" align="center" mb={6}>
                    <Text fw={600}>{s.title ?? `Strategy #${idx + 1}`}</Text>
                    {s.impact && (
                      <Badge color={impactColor(s.impact)} variant="light">
                        Impact: {String(s.impact)}
                      </Badge>
                    )}
                  </Group>
                  <Group gap="xl" mb={6}>
                    {"eta_days" in s && (
                      <Text size="sm" c="dimmed">
                        ETA:{" "}
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
        Daily Revenue by Month
      </Title>

      <Group gap="md" align="center" className="mb-4">
        <MonthPickerInput
          value={monthStr}
          onChange={(v) => setMonthStr(v ?? "")}
          maxDate={new Date()}
          valueFormat="YYYY-MM"
          placeholder="YYYY-MM"
          clearable
        />
      </Group>

      <Stack gap="xs" className="mb-3">
        <Group gap="sm">
          <Badge variant="light" radius="sm">
            Month: {payload?.month ?? monthParam}
          </Badge>
          {typeof payload?.monthlyTarget === "number" && (
            <Badge color="grape" variant="light" radius="sm">
              Target:{" "}
              <NumberFormatter
                value={payload.monthlyTarget}
                thousandSeparator
              />
            </Badge>
          )}
          {typeof payload?.totalToDate === "number" && (
            <Badge color="blue" variant="light" radius="sm">
              Actual Σ:{" "}
              <NumberFormatter value={payload.totalToDate} thousandSeparator />
            </Badge>
          )}
          {typeof payload?.expectedToDate === "number" && (
            <Badge color="red" variant="light" radius="sm">
              Expected Σ:{" "}
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
              Δ% to date: {payload.diffPctToDate}% (
              {payload?.levelToDate || "-"})
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
        Metrics
      </Title>
      <Card shadow="sm" radius="lg" padding="lg" className="w-full">
        <CustomTable<MetricItem>
          data={metrics?.content ?? []}
          columns={columns as any}
          page={mtPage}
          pageSize={mtPageSize}
          totalItems={metrics?.totalElements ?? 0}
          onPageChange={(p) => setMtPage(p)}
          onPageSizeChange={(s) => {
            setMtPageSize(s || 10);
            setMtPage(1);
          }}
          loading={metricsLoading}
          emptyText={metricsError ?? "Không có metrics"}
          showActions={true}
          onView={handleViewMetric}
        />
      </Card>

      {/* Modal chi tiết */}
      <Modal
        opened={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={
          <div>
            <h2 className="text-xl font-bold">Metric Detail</h2>
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
                {detail.level}
              </Badge>
            </Group>

            <Divider my="xs" />

            <Group gap="xl" wrap="nowrap">
              <Stack gap={2} style={{ minWidth: 200 }}>
                <Text size="sm" c="dimmed">
                  Start Date
                </Text>
                <Text>{dayjs(detail.periodStart).format("DD/MM/YYYY")}</Text>
              </Stack>
              <Stack gap={2} style={{ minWidth: 200 }}>
                <Text size="sm" c="dimmed">
                  End Date
                </Text>
                <Text>{dayjs(detail.periodEnd).format("DD/MM/YYYY")}</Text>
              </Stack>
            </Group>

            <Group gap="xl" wrap="nowrap" mt="xs">
              <Stack gap={2} style={{ minWidth: 200 }}>
                <Text size="sm" c="dimmed">
                  Actual
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
                  Target
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
                  Diff %
                </Text>
                <Text>{detail.diffPct}%</Text>
              </Stack>
              <Stack gap={2} style={{ minWidth: 200 }}>
                <Text size="sm" c="dimmed">
                  MoM %
                </Text>
                <Text>{detail.momPct}%</Text>
              </Stack>
            </Group>

            <Divider my="sm" />

            {/* Header + nút copy JSON gốc */}
            <Group justify="space-between" align="center">
              <Text fw={600}>Report content</Text>
              {payloadText && (
                <CopyButton value={payloadText}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? "Đã copy" : "Copy JSON"} withArrow>
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

            {/* NOTE: nội dung payload đã được format thân thiện */}
            <ScrollArea h={260} type="auto">
              <Stack gap="sm">{renderPayloadContent(detail.payloadJson)}</Stack>
            </ScrollArea>
          </Stack>
        )}
      </Modal>
    </div>
  );
};
