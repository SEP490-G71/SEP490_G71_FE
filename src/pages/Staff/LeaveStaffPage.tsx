import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Group,
  Title,
  Loader,
  Text,
  Modal,
} from "@mantine/core";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { LeaveRequestStatusLabels } from "../../enums/Admin/LeaveRequestStatus";
import CustomTable from "../../components/common/CustomTable";
import { createColumn } from "../../components/utils/tableUtils";
import { LeaveRequestResponse } from "../../types/Admin/Leave/LeaveRequestResponse";

import { useLeaveRequestsByStaff } from "../../hooks/leave/staff/useLeaveRequestsByStaff";
import useStaffs from "../../hooks/staffs-service/useStaffs";
import CreateEditLeaveModal, {
  CreateEditLeaveFormValues,
} from "../../components/staff/EditLeaveModal";
import { useSettingAdminService } from "../../hooks/setting/useSettingAdminService";
import { useUserInfo } from "../../hooks/auth/useUserInfo";
import useDivideShift from "../../hooks/DivideShift/useDivideShift";
import { useCreateLeaveRequestByTime } from "../../hooks/leave/staff/useCreateLeaveRequestByTime";
import { useDeleteLeaveRequest } from "../../hooks/leave/useDeleteLeaveRequest";

const LeaveStaffPage = () => {
  const { userInfo, loading: loadingUser } = useUserInfo();
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingLeave, setEditingLeave] = useState<LeaveRequestResponse | null>(
    null
  );
  const { setting } = useSettingAdminService();
  const { staffs, fetchStaffs } = useStaffs();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { createLeaveRequestByTime } = useCreateLeaveRequestByTime();
  const { deleteLeaveRequest } = useDeleteLeaveRequest();
  const { shifts, fetchAllShifts } = useDivideShift();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const {
    leaves: data,
    loadingList: loading,
    pagination,
    fetchLeaves,
  } = useLeaveRequestsByStaff(selectedStaffId || "");

  // Gán selectedStaffId khi userInfo đã có
  useEffect(() => {
    if (userInfo?.userId) {
      setSelectedStaffId(userInfo.userId);
    }
  }, [userInfo]);

  useEffect(() => {
    fetchStaffs();
  }, []);
  useEffect(() => {
    fetchAllShifts();
  }, []);
  useEffect(() => {
    if (selectedStaffId) {
      fetchLeaves({}, page - 1, pageSize);
    }
  }, [selectedStaffId, page, pageSize]);

  const handleSubmit = async (
    form: CreateEditLeaveFormValues
  ): Promise<boolean> => {
    if (!selectedStaffId) {
      toast.warning("Chưa chọn nhân viên");
      return false;
    }

    if (editingLeave) {
      toast.warning(
        "Không thể sửa đơn nghỉ theo thời gian trong phiên bản này"
      );
      return false;
    }

    try {
      const fromDateTime = dayjs(form.fromDate)
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
      const toDateTime = dayjs(form.toDate)
        .endOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");

      const success = await createLeaveRequestByTime({
        staffId: selectedStaffId,
        reason: form.reason,
        fromDateTime,
        toDateTime,
      });

      if (!success) return false;

      fetchLeaves({}, page - 1, pageSize);
      return true;
    } catch (err: any) {
      toast.error("Tạo đơn nghỉ phép thất bại");
      return false;
    }
  };

  const handleEdit = (leave: LeaveRequestResponse) => {
    setEditingLeave(leave);
    setModalOpened(true);
  };
  const handleDelete = (leaveId: string) => {
    setDeleteTargetId(leaveId);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    const success = await deleteLeaveRequest(deleteTargetId);
    if (success) {
      fetchLeaves({}, page - 1, pageSize);
    }
    setDeleteTargetId(null);
  };

  const columns = [
    createColumn<LeaveRequestResponse>({
      key: "reason",
      label: "Lý do",
      render: (row) =>
        row.status === "REJECTED" ? (
          <span style={{ textDecoration: "line-through", color: "#aaa" }}>
            {row.reason}
          </span>
        ) : (
          row.reason
        ),
    }),
    createColumn<LeaveRequestResponse>({
      key: "details",
      label: "Ngày nghỉ + Ca",
      render: (row) => {
        const dates = row.details.map((d) => d.date);
        const shiftIds = row.details.map((d) => d.shiftId);

        // Loại bỏ trùng lặp
        const uniqueDates = Array.from(new Set(dates)).sort();
        const uniqueShiftIds = Array.from(new Set(shiftIds));

        // Nếu là nghỉ liên tiếp và có đủ ca: hiển thị gọn
        const isContinuous =
          uniqueDates.length > 1 &&
          dayjs(uniqueDates[uniqueDates.length - 1]).diff(
            dayjs(uniqueDates[0]),
            "day"
          ) ===
            uniqueDates.length - 1 &&
          uniqueShiftIds.length >= 3;

        let text = "";

        if (isContinuous) {
          text = `Từ ${dayjs(uniqueDates[0]).format("DD/MM/YYYY")} đến ${dayjs(
            uniqueDates[uniqueDates.length - 1]
          ).format("DD/MM/YYYY")} (Cả ngày)`;
        } else {
          text = row.details
            .map((d) => {
              const shiftName =
                shifts.find((s) => s.id === d.shiftId)?.name || "Không rõ";
              return `${dayjs(d.date).format("DD/MM/YYYY")} (${shiftName})`;
            })
            .join(", ");
        }
        return row.status === "REJECTED" ? (
          <span style={{ textDecoration: "line-through", color: "#aaa" }}>
            {text}
          </span>
        ) : (
          text
        );
      },
    }),

    createColumn<LeaveRequestResponse>({
      key: "status",
      label: "Trạng thái",
      render: (row) => (
        <Badge
          color={
            row.status === "PENDING"
              ? "yellow"
              : row.status === "APPROVED"
              ? "blue"
              : "red"
          }
        >
          {LeaveRequestStatusLabels[row.status]}
        </Badge>
      ),
    }),
    createColumn<LeaveRequestResponse>({
      key: "actions",
      label: "Hành động",
      render: (row) =>
        row.status === "PENDING" ? (
          <Group gap="xs">
            <Button size="xs" variant="light" onClick={() => handleEdit(row)}>
              Sửa
            </Button>
            <Button
              size="xs"
              color="red"
              variant="outline"
              onClick={() => handleDelete(row.id)}
            >
              Xoá
            </Button>
          </Group>
        ) : (
          <span style={{ color: "#aaa" }}>Không thể sửa / xoá</span>
        ),
    }),
  ];

  if (loadingUser || !selectedStaffId) {
    return <Loader size="lg" mt="xl" />;
  }

  return (
    <>
      <Title order={3} mb="md">
        Danh sách đơn nghỉ phép nhân viên
      </Title>

      <Group mb="sm" justify="space-between" align="end">
        {/* Hiển thị tên nhân viên hiện tại (không cho chọn) */}
        <Text fw={500}>
          Nhân viên:{" "}
          {staffs.find((s) => s.id === selectedStaffId)?.fullName ||
            "Đang tải..."}
        </Text>

        <Button
          onClick={() => {
            setEditingLeave(null);
            setModalOpened(true);
          }}
          disabled={!selectedStaffId}
        >
          Tạo đơn nghỉ mới
        </Button>
      </Group>

      <CustomTable
        data={data}
        columns={columns}
        page={page}
        pageSize={pageSize}
        totalItems={pagination.totalElements}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        loading={loading}
        showActions={false}
        pageSizeOptions={setting?.paginationSizeList || [5, 10, 20, 50]}
      />

      <CreateEditLeaveModal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setEditingLeave(null);
        }}
        initialData={editingLeave}
        onSubmit={handleSubmit}
        canEdit={!editingLeave || editingLeave.status === "PENDING"}
        shifts={[]}
      />
      <Modal
        opened={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Xác nhận xoá đơn nghỉ phép"
        centered
      >
        <Text>Bạn có chắc chắn muốn xoá đơn nghỉ phép này không?</Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={() => setDeleteTargetId(null)}>
            Huỷ
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Xác nhận xoá
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default LeaveStaffPage;
