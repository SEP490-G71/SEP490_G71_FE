import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Modal,
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Loader,
  Grid,
} from "@mantine/core";
import axiosInstance from "../../services/axiosInstance";
import CustomTable from "../common/CustomTable";
import { Column } from "../../types/table";
import { FloatingLabelWrapper } from "../common/FloatingLabelWrapper";

type Department = {
  id: string;
  name: string;
  description?: string;
  roomNumber: string;
  type: string;
  specialization?: { id: string; name: string } | null;
};

interface Props {
  opened: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    toDepartmentId: string;
    reason: string;
  }) => Promise<void> | void;
}

const TransferRoomModal = ({ opened, onClose, onConfirm }: Props) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState<Department[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [selected, setSelected] = useState<Department | null>(null);
  const [reason, setReason] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const fetchDepartments = useCallback(
    async (params?: { page?: number; size?: number; name?: string }) => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/departments", {
          params: {
            page: (params?.page ?? page) - 1,
            size: params?.size ?? pageSize,
            name: params?.name ?? (search || undefined),
            type: "CONSULTATION",
          },
        });

        const result = res.data?.result;
        if (Array.isArray(result)) {
          setRows(result);
          setTotalItems(result.length);
        } else {
          const content: Department[] = result?.content ?? [];
          const total: number = result?.totalElements ?? content.length ?? 0;
          setRows(content);
          setTotalItems(total);
        }
      } catch (e) {
        setRows([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, search]
  );

  const columns = useMemo<Column<Department>[]>(() => {
    return [
      {
        key: "name",
        label: "Tên phòng",
        sortable: false,
        render: (d) => <span className="font-medium">{d.name}</span>,
      },
      {
        key: "roomNumber",
        label: "Số phòng",
        sortable: false,
        render: (d) => d.roomNumber,
      },
      {
        key: "specialization",
        label: "Chuyên khoa",
        sortable: false,
        render: (d) => d.specialization?.name ?? "---",
      },
    ];
  }, []);

  useEffect(() => {
    if (opened && hasSearched) {
      fetchDepartments({ page, size: pageSize, name: search });
    }
  }, [opened, page, pageSize, hasSearched, fetchDepartments]);

  const handleReload = () => {
    setHasSearched(true);
    setPage(1);
    fetchDepartments({ page: 1, size: pageSize, name: search });
  };

  const handleRowClick = (row: Department) => {
    setSelected(row);
  };

  const handleConfirm = async () => {
    if (!selected) return;
    await onConfirm({
      toDepartmentId: selected.id,
      reason: reason.trim() || "Chuyển phòng",
    });
  };

  useEffect(() => {
    if (!opened) {
      setSelected(null);
      setReason("");
      setSearch("");
      setPage(1);
      setHasSearched(false);
    }
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Chuyển phòng"
      size="80%"
      centered
      closeOnClickOutside={false}
      styles={{
        content: { transform: "translateY(-40px)", minHeight: 600 },
        body: { paddingTop: "1rem", paddingBottom: "1rem" },
      }}
    >
      <Stack gap="sm">
        <Grid align="end" gutter="sm">
          <Grid.Col span={{ base: 12, sm: 9 }}>
            <FloatingLabelWrapper label="Tìm kiếm phòng">
              <TextInput
                placeholder="Nhập tên phòng..."
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
              />
            </FloatingLabelWrapper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 3 }}>
            <Button
              onClick={handleReload}
              disabled={loading}
              className="w-full sm:w-[140px]"
            >
              {loading ? <Loader size="sm" /> : "Tìm kiếm"}
            </Button>
          </Grid.Col>
        </Grid>

        <CustomTable<Department>
          data={rows}
          columns={columns}
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
          loading={loading}
          showActions={false}
          onRowClick={handleRowClick}
          getRowStyle={(row) =>
            row.id === selected?.id
              ? { backgroundColor: "rgba(59,130,246,0.10)" }
              : {}
          }
          emptyText="Không có phòng phù hợp"
        />

        <FloatingLabelWrapper label="Phòng đích">
          <TextInput
            placeholder="Chưa chọn"
            value={selected ? `${selected.roomNumber} - ${selected.name}` : ""}
            readOnly
          />
        </FloatingLabelWrapper>

        <FloatingLabelWrapper label="Lý do chuyển">
          <Textarea
            placeholder="Nhập lý do..."
            autosize
            minRows={2}
            value={reason}
            onChange={(e) => setReason(e.currentTarget.value)}
          />
        </FloatingLabelWrapper>

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selected || !reason.trim()}
          >
            Xác nhận chuyển
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default TransferRoomModal;
