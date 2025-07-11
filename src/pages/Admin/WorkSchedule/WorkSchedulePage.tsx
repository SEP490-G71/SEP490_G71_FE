import { useEffect, useState } from "react";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { useWorkSchedule } from "../../../hooks/workSchedule/useWorkSchedule";
import {
  WorkSchedule,
  WorkScheduleDetail,
} from "../../../types/Admin/WorkSchedule/WorkSchedule";
import WorkScheduleListModal from "../../../components/admin/WorkSchedule/WorkScheduleListModal";
import WorkScheduleFormModal from "../../../components/admin/WorkSchedule/WorkScheduleFormModal";
import { Button } from "@mantine/core";

export const WorkSchedulePage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    workSchedules,
    loading,
    totalItems,
    fetchWorkSchedules,
    fetchWorkScheduleDetailByStaffId,
    updateWorkSchedule,
    deleteWorkScheduleByStaff,
    createWorkSchedule,
  } = useWorkSchedule();

  const [detailModalOpened, setDetailModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);

  const [workScheduleDetails, setWorkScheduleDetails] = useState<
    WorkScheduleDetail[]
  >([]);
  const [selectedSchedule, setSelectedSchedule] = useState<WorkSchedule | null>(
    null
  );

  useEffect(() => {
    fetchWorkSchedules(page - 1, pageSize);
  }, [page, pageSize]);

  const handleView = async (row: WorkSchedule) => {
    const details = await fetchWorkScheduleDetailByStaffId(row.staffId);

    if (Array.isArray(details)) {
      setWorkScheduleDetails(details);
    } else {
      setWorkScheduleDetails([]);
    }

    setSelectedSchedule(row);
    setDetailModalOpened(true);
  };

  const handleEdit = async (row: WorkSchedule) => {
    setSelectedSchedule(row);
    setEditModalOpened(true);
  };

  const handleDelete = async (row: WorkSchedule) => {
    await deleteWorkScheduleByStaff(row.staffId);
    fetchWorkSchedules(page - 1, pageSize);
  };

  const handleSubmit = async (formData: any) => {
    if (selectedSchedule) {
      await updateWorkSchedule(formData);
    } else {
      await createWorkSchedule(formData);
    }

    setEditModalOpened(false);
    setSelectedSchedule(null);
    fetchWorkSchedules(page - 1, pageSize);
  };

  const columns = [
    createColumn<WorkSchedule>({ key: "staffName", label: "Họ và tên" }),
    createColumn<WorkSchedule>({
      key: "shifts",
      label: "Ca trực",
      render: (row) => {
        const map = {
          MORNING: "Ca sáng",
          AFTERNOON: "Ca chiều",
          NIGHT: "Ca tối",
          FULL_DAY: "Cả ngày",
        };

        return row.shifts.map((s) => map[s] || s).join(", ");
      },
    }),

    createColumn<WorkSchedule>({
      key: "daysOfWeek",
      label: "Ngày",
      render: (row) => {
        const map = {
          MONDAY: "T2",
          TUESDAY: "T3",
          WEDNESDAY: "T4",
          THURSDAY: "T5",
          FRIDAY: "T6",
          SATURDAY: "T7",
          SUNDAY: "CN",
        };
        return row.daysOfWeek
          .map((d) => map[d as keyof typeof map] || d)
          .join(", ");
      },
    }),
    createColumn<WorkSchedule>({
      key: "startDate",
      label: "Từ ngày",
      render: (row) => new Date(row.startDate).toLocaleDateString(),
    }),
    createColumn<WorkSchedule>({
      key: "endDate",
      label: "Đến ngày",
      render: (row) => new Date(row.endDate).toLocaleDateString(),
    }),
    createColumn<WorkSchedule>({
      key: "note",
      label: "Ghi chú",
      render: (row) => row.note,
    }),
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Lịch Làm Việc</h1>
        <Button
          onClick={() => {
            setSelectedSchedule(null);
            setEditModalOpened(true);
          }}
        >
          Tạo
        </Button>
      </div>

      <CustomTable
        data={workSchedules}
        columns={columns}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        showActions={true}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <WorkScheduleListModal
        opened={detailModalOpened}
        onClose={() => setDetailModalOpened(false)}
        schedules={workScheduleDetails}
        staffName={selectedSchedule?.staffName}
        onReloadDetail={async () => {
          if (selectedSchedule) {
            const details = await fetchWorkScheduleDetailByStaffId(
              selectedSchedule.staffId
            );
            setWorkScheduleDetails(details);
          }
        }}
        onReloadList={() => {
          fetchWorkSchedules(page - 1, pageSize);
        }}
        startDate={selectedSchedule?.startDate}
        endDate={selectedSchedule?.endDate}
      />

      <WorkScheduleFormModal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        initialData={selectedSchedule}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default WorkSchedulePage;
