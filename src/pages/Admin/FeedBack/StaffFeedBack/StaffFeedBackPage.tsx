import { useEffect, useState } from "react";
import { Button } from "@mantine/core";
import { useStaffFeedbackStatistics } from "../../../../hooks/feedBack/StaffFeedBack/useStaffFeedbackStatistics";
import { useSettingAdminService } from "../../../../hooks/setting/useSettingAdminService";
import CustomTable from "../../../../components/common/CustomTable";
import { createColumn } from "../../../../components/utils/tableUtils";
import { useExportStaffFeedbacksExcel } from "../../../../hooks/feedBack/StaffFeedBack/useExportStaffFeedbacksExcel";
import useStaffFeedbackByStaff from "../../../../hooks/feedBack/StaffFeedBack/useStaffFeedbackByStaff";
import StaffFeedbackDetailModal from "../../../../components/admin/Feedback/StaffFeedbackDetailModal";

const StaffFeedbackPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { setting } = useSettingAdminService();

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);

  const {
    data,
    totalFeedbacks,
    averageSatisfaction,
    pageInfo,
    loading,
    error,
  } = useStaffFeedbackStatistics(page - 1, pageSize);

  const totalItems = pageInfo?.totalElements ?? 0;

  const { exportStaffFeedbacksExcel } = useExportStaffFeedbacksExcel();
  const handleExport = async () => {
    await exportStaffFeedbacksExcel({});
  };

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedStaffName, setSelectedStaffName] = useState<string>("");

  const { fetchByStaffId } = useStaffFeedbackByStaff();

  const openDetail = async (staffId: string, staffName: string) => {
    setSelectedStaffId(staffId);
    setSelectedStaffName(staffName);
    setDetailOpen(true);
    await fetchByStaffId(staffId);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedStaffId(null);
    setSelectedStaffName("");
  };
  const columns = [
    createColumn({ key: "staffCode", label: "Mã NV" }),
    createColumn({
      key: "fullName",
      label: "Họ và tên",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.fullName}</span>
        </div>
      ),
    }),
    createColumn({
      key: "phone",
      label: "Điện thoại",
      render: (row) => row.phone || "-",
    }),
    createColumn({
      key: "gender",
      label: "Giới tính",
      render: (row) =>
        row.gender === "MALE"
          ? "Nam"
          : row.gender === "FEMALE"
          ? "Nữ"
          : row.gender || "-",
    }),
    createColumn({
      key: "department",
      label: "Khoa/Phòng",
      render: (row) =>
        row.department ? (
          <div className="flex flex-col">
            <span className="font-medium">{row.department.name}</span>
            <span className="text-xs text-gray-500">
              Phòng: {row.department.roomNumber}
            </span>
          </div>
        ) : (
          <span className="text-gray-500">—</span>
        ),
    }),
    createColumn({
      key: "totalFeedbacks",
      label: "Số phản hồi",
      render: (row) => (
        <div style={{ textAlign: "center", paddingRight: 27 }}>
          {row.totalFeedbacks ?? 0}
        </div>
      ),
    }),
    createColumn({
      key: "averageSatisfaction",
      label: "Điểm HL TB",
      align: "center",
      render: (row) => (
        <div className="text-center">
          {typeof row.averageSatisfaction === "number"
            ? row.averageSatisfaction.toFixed(2)
            : "0.00"}
        </div>
      ),
    }),
    createColumn({
      key: "actions",
      label: "Thao tác",
      align: "center",
      render: (row: any) => (
        <Button
          size="xs"
          variant="light"
          onClick={() =>
            openDetail(row.id ?? row.staffId ?? "", row.fullName ?? "")
          }
        >
          Xem chi tiết
        </Button>
      ),
    }),
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold">Thống kê phản hồi nhân viên</h1>
        <Button
          leftSection={
            <img
              src="/images/icons8-excel-48.png"
              alt="Excel"
              className="w-6 h-6 object-contain"
            />
          }
          onClick={handleExport}
          variant="default"
          style={{
            backgroundColor: "#bbf7d0",
            color: "#15803d",
            border: "1px solid #15803d",
            fontWeight: 600,
          }}
          className="h-[36px] text-sm"
        >
          Xuất Excel
        </Button>
      </div>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 text-sm">
        <div className="bg-blue-50 border border-blue-200 rounded shadow p-4 text-blue-700">
          <div className="font-medium">Tổng nhân viên</div>
          <div className="text-xl font-bold">{totalItems}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded shadow p-4 text-green-700">
          <div className="font-medium">Tổng phản hồi</div>
          <div className="text-xl font-bold">{totalFeedbacks}</div>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded shadow p-4 text-indigo-700">
          <div className="font-medium">Điểm hài lòng TB (toàn viện)</div>
          <div className="text-xl font-bold">
            {typeof averageSatisfaction === "number"
              ? averageSatisfaction.toFixed(2)
              : "0.00"}
          </div>
        </div>
      </div>

      <CustomTable
        data={data}
        columns={columns}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        loading={loading}
        showActions={false}
      />
      <StaffFeedbackDetailModal
        opened={detailOpen}
        onClose={closeDetail}
        staffId={selectedStaffId || undefined}
        staffName={selectedStaffName}
      />

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </>
  );
};

export default StaffFeedbackPage;
