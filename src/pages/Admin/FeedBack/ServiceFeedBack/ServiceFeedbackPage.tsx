import { useEffect, useState } from "react";
import { Button } from "@mantine/core";
import { useSettingAdminService } from "../../../../hooks/setting/useSettingAdminService";
import { useServiceFeedbackStatistics } from "../../../../hooks/feedBack/ServiceFeedBack/useServiceFeedbackStatistics";
import { createColumn } from "../../../../components/utils/tableUtils";
import {
  DepartmentType,
  DepartmentTypeLabel,
} from "../../../../enums/Admin/DepartmentEnums";
import CustomTable from "../../../../components/common/CustomTable";
import { useExportMedicalServiceFeedbacksExcel } from "../../../../hooks/feedBack/ServiceFeedBack/useExportMedicalServiceFeedbacksExcel";
import useMedicalServiceFeedbackByService from "../../../../hooks/feedBack/ServiceFeedBack/useMedicalServiceFeedbackByService";
import ServiceFeedbackDetailModal from "../../../../components/admin/Feedback/ServiceFeedbackDetailModal";

const ServiceFeedbackPage = () => {
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
  } = useServiceFeedbackStatistics(page - 1, pageSize);

  const totalItems = pageInfo?.totalElements ?? 0;

  const { exportMedicalServiceFeedbacksExcel } =
    useExportMedicalServiceFeedbacksExcel();
  const handleExport = async () => {
    await exportMedicalServiceFeedbacksExcel({});
  };

  // Modal chi tiết (giống staff)
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [selectedServiceName, setSelectedServiceName] = useState<string>("");

  const { fetchByServiceId } = useMedicalServiceFeedbackByService();

  const openDetail = async (serviceId: string, serviceName: string) => {
    setSelectedServiceId(serviceId);
    setSelectedServiceName(serviceName);
    setDetailOpen(true);
    await fetchByServiceId(serviceId); // prefetch như trang staff
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedServiceId(null);
    setSelectedServiceName("");
  };

  const columns = [
    createColumn({ key: "serviceCode", label: "Mã dịch vụ" }),
    createColumn({
      key: "name",
      label: "Tên dịch vụ",
      render: (row: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    }),
    createColumn({
      key: "department",
      label: "Khoa/Phòng",
      render: (row: any) =>
        row.department ? (
          <div className="flex flex-col">
            <span className="font-medium">{row.department.name}</span>
            <span className="text-xs text-gray-500">
              Phòng {row.department.roomNumber} •{" "}
              {DepartmentTypeLabel[row.department.type as DepartmentType] ??
                row.department.type}
              {row.department.specialization
                ? ` • ${row.department.specialization.name}`
                : ""}
            </span>
          </div>
        ) : (
          <span className="text-gray-500">—</span>
        ),
    }),
    createColumn({
      key: "totalFeedbacks",
      label: "Số phản hồi",
      render: (row: any) => (
        <div style={{ textAlign: "center", paddingRight: 27 }}>
          {row.totalFeedbacks ?? 0}
        </div>
      ),
    }),
    createColumn({
      key: "averageSatisfaction",
      label: "Điểm HL TB",
      align: "right",
      render: (row: any) => (
        <div className="text-right">
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
            openDetail(row.id ?? row.serviceId ?? "", row.name ?? "")
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
        <h1 className="text-xl font-bold">Thống kê phản hồi dịch vụ</h1>
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
          <div className="font-medium">Tổng dịch vụ</div>
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

      <ServiceFeedbackDetailModal
        opened={detailOpen}
        onClose={closeDetail}
        serviceId={selectedServiceId || undefined}
        serviceName={selectedServiceName}
      />

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </>
  );
};

export default ServiceFeedbackPage;
