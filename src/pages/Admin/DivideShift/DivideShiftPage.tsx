import { useEffect, useState } from "react";
import { Button, TextInput } from "@mantine/core";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { useDivideShift } from "../../../hooks/DivideShift/useDivideShift";
import {
  DivideShift,
  CreateDivideShiftRequest,
} from "../../../types/Admin/DivideShift/DivideShift";
import { CreateEditModalDivideShift } from "../../../components/admin/DivideShift/CreateEditModalDivideShift";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";

export const DivideShiftPage = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedShift, setSelectedShift] = useState<DivideShift | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchNameInput, setSearchNameInput] = useState("");
  const { setting } = useSettingAdminService();
  const {
    shifts,
    totalItems,
    loading,
    fetchAllShifts,
    fetchShiftById,
    deleteShiftById,
    handleSubmitShift,
  } = useDivideShift();
  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]); // Lấy phần tử đầu tiên
    }
  }, [setting]);
  useEffect(() => {
    fetchAllShifts({
      page: page - 1,
      size: pageSize,
      name: searchNameInput.trim(),
    });
  }, [page, pageSize]);

  const handleSubmit = async (formData: CreateDivideShiftRequest) => {
    const success = await handleSubmitShift(formData, selectedShift);
    if (success) {
      setModalOpened(false);
      setIsViewMode(false);
    }
  };

  const handleView = async (row: DivideShift) => {
    const data = await fetchShiftById(row.id);
    if (data) {
      setSelectedShift(data);
      setIsViewMode(true);
      setModalOpened(true);
    }
  };

  const handleEdit = async (row: DivideShift) => {
    const data = await fetchShiftById(row.id);
    if (data) {
      setSelectedShift(data);
      setIsViewMode(false);
      setModalOpened(true);
    }
  };

  const handleDelete = async (row: DivideShift) => {
    await deleteShiftById(row.id);
  };

  const handleSearch = () => {
    const keyword = searchNameInput.trim();
    setPage(1);
    fetchAllShifts({ name: keyword, page: 0, size: pageSize });
  };

  const handleReset = () => {
    setSearchNameInput("");
    setPage(1);
    fetchAllShifts({ page: 0, size: pageSize });
  };

  const columns = [
    createColumn<DivideShift>({ key: "name", label: "Tên ca" }),
    createColumn<DivideShift>({
      key: "startTime",
      label: "Bắt đầu",
      render: (row) => row.startTime.slice(0, 5),
    }),
    createColumn<DivideShift>({
      key: "endTime",
      label: "Kết thúc",
      render: (row) => row.endTime.slice(0, 5),
    }),
    createColumn<DivideShift>({ key: "description", label: "Ghi chú" }),
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Ca làm việc</h1>
        <Button
          onClick={() => {
            setSelectedShift(null);
            setIsViewMode(false);
            setModalOpened(true);
          }}
        >
          Tạo
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4 my-4">
        {/* Ca làm việc - 10/12 */}
        <div className="col-span-12 md:col-span-10">
          <FloatingLabelWrapper label="Ca làm việc">
            <TextInput
              placeholder="Nhập tên ca làm"
              value={searchNameInput}
              onChange={(event) =>
                setSearchNameInput(event.currentTarget.value)
              }
            />
          </FloatingLabelWrapper>
        </div>

        {/* Nút hành động - 2/12 */}
        <div className="col-span-12 md:col-span-2 flex items-end gap-2">
          <Button variant="light" color="gray" onClick={handleReset} fullWidth>
            Tải lại
          </Button>
          <Button
            variant="filled"
            color="blue"
            onClick={handleSearch}
            fullWidth
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <CustomTable
        data={shifts}
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
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showActions
      />

      <CreateEditModalDivideShift
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setIsViewMode(false);
        }}
        initialData={selectedShift}
        onSubmit={handleSubmit}
        isViewMode={isViewMode}
      />
    </>
  );
};

export default DivideShiftPage;
