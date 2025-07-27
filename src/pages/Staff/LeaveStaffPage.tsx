import { useEffect, useState } from "react";
import { Badge, Button, Group, Title, Loader, Text } from "@mantine/core";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { LeaveRequestStatusLabels } from "../../enums/Admin/LeaveRequestStatus";
import CustomTable from "../../components/common/CustomTable";
import { createColumn } from "../../components/utils/tableUtils";
import { LeaveRequestResponse } from "../../types/Admin/Leave/LeaveRequestResponse";
import axiosInstance from "../../services/axiosInstance";
import { useLeaveRequestsByStaff } from "../../hooks/leave/staff/useLeaveRequestsByStaff";
import useStaffs from "../../hooks/staffs-service/useStaffs";
import CreateEditLeaveModal, {
  CreateEditLeaveFormValues,
} from "../../components/staff/EditLeaveModal";
import { useCreateLeaveRequest } from "../../hooks/leave/staff/useCreateLeaveRequest";
import { useSettingAdminService } from "../../hooks/setting/useSettingAdminService";
import { useUserInfo } from "../../hooks/auth/useUserInfo";

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
  const { createLeaveRequest } = useCreateLeaveRequest();
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

    const dates: Date[] = [];
    let current = new Date(form.fromDate!);
    const end = new Date(form.toDate!);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const details = dates.map((d) => ({
      date: dayjs(d).format("YYYY-MM-DD"),
      shift: form.shift,
    }));

    try {
      if (editingLeave) {
        await axiosInstance.put(`/leave-request/${editingLeave.id}`, {
          staffId: selectedStaffId,
          reason: form.reason,
          details,
        });
        toast.success("Cập nhật đơn nghỉ phép thành công");
      } else {
        const created = await createLeaveRequest({
          staffId: selectedStaffId,
          reason: form.reason,
          details,
        });

        if (!created) return false;
      }

      setEditingLeave(null);
      fetchLeaves({}, page - 1, pageSize);
      return true;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          (editingLeave ? "Cập nhật thất bại" : "Tạo đơn nghỉ phép thất bại")
      );
      console.error("Lỗi gửi đơn nghỉ:", err);
      return false;
    }
  };

  const handleEdit = (leave: LeaveRequestResponse) => {
    setEditingLeave(leave);
    setModalOpened(true);
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
        const text = row.details
          .map((d) => `${dayjs(d.date).format("DD/MM/YYYY")} (${d.shift})`)
          .join(", ");
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
          <Button size="xs" variant="light" onClick={() => handleEdit(row)}>
            Sửa
          </Button>
        ) : (
          <span style={{ color: "#aaa" }}>Không thể sửa</span>
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
      />
    </>
  );
};

export default LeaveStaffPage;
