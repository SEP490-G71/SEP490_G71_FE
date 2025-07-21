import { useEffect, useState } from "react";
import { Button, Select } from "@mantine/core";
import { toast } from "react-toastify";
import PageMeta from "../../../components/common/PageMeta";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { DepartmentTypeLabel } from "../../../enums/Admin/DepartmentEnums";
import { DepartmentResponse } from "../../../types/Admin/Department/DepartmentTypeResponse";
import CreateEditDepartmentModal from "../../../components/admin/Department/CreateEditDepartmentModal";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import useDepartmentService from "../../../hooks/department-service/useDepartmentService";

function getEnumLabel(
  enumLabelMap: Record<string, string>,
  key: string
): string {
  return enumLabelMap[key] ?? key;
}

const DepartmentPage = () => {
  const {
    departments,
    totalItems,
    loading,
    fetchDepartments,
    fetchDepartmentById,
    handleDeleteDepartmentById,
  } = useDepartmentService();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [modalOpened, setModalOpened] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentResponse | null>(null);
  const [_, setEditingId] = useState<string | null>(null);

  const [inputName, setInputName] = useState("");
  const [filterName, setFilterName] = useState("");
  const [inputRoom, setInputRoom] = useState("");
  const [filterRoom, setFilterRoom] = useState("");
  const [inputType, setInputType] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("");

  const { setting } = useSettingAdminService();

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);

  useEffect(() => {
    fetchDepartments({
      page: page - 1,
      size: pageSize,
      name: filterName || undefined,
      type: filterType || undefined,
      roomNumber: filterRoom || undefined,
    });
  }, [page, pageSize, filterName, filterType, filterRoom]);

  const handleAdd = () => {
    setSelectedDepartment(null);
    setEditingId(null);
    setModalOpened(true);
  };

  const handleEdit = async (row: DepartmentResponse) => {
    const res = await fetchDepartmentById(row.id);
    if (res) {
      setSelectedDepartment(res);
      setEditingId(row.id);
      setModalOpened(true);
    } else {
      toast.error("Lỗi khi lấy thông tin phòng ban");
    }
  };

  const handleDelete = async (row: DepartmentResponse) => {
    await handleDeleteDepartmentById(row.id);
    fetchDepartments({
      page: page - 1,
      size: pageSize,
      name: filterName || undefined,
      type: filterType || undefined,
      roomNumber: filterRoom || undefined,
    });
  };

  const handleSearch = () => {
    setPage(1);
    setFilterName(inputName.trim());
    setFilterRoom(inputRoom.trim());
    setFilterType(inputType || "");
  };

  const handleReset = () => {
    setInputName("");
    setFilterName("");
    setInputRoom("");
    setFilterRoom("");
    setInputType(null);
    setFilterType("");
    setPage(1);
    fetchDepartments({ page: 0, size: pageSize });
  };

  const columns = [
    createColumn<DepartmentResponse>({ key: "name", label: "Tên phòng ban" }),
    createColumn<DepartmentResponse>({ key: "description", label: "Mô tả" }),
    createColumn<DepartmentResponse>({ key: "roomNumber", label: "Số phòng" }),
    createColumn<DepartmentResponse>({
      key: "type",
      label: "Loại phòng",
      render: (row) => getEnumLabel(DepartmentTypeLabel, row.type),
    }),
    createColumn<DepartmentResponse>({
      key: "Specialization",
      label: "Chuyên khoa",
      render: (row) => row.specialization?.name ?? "Không có",
    }),
  ];

  return (
    <>
      <PageMeta
        title="Quản lý phòng ban | Admin Dashboard"
        description="Trang quản lý phòng ban trong hệ thống"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Phòng ban</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          + Thêm phòng ban
        </button>
      </div>

      <div className="my-4 grid grid-cols-12 gap-4 items-end">
        {/* 3 ô input: chiếm 10 cột => mỗi cái ~ col-span-4 */}
        <div className="col-span-4">
          <FloatingLabelWrapper label="Chọn loại phòng">
            <Select
              key={inputType || "empty"}
              placeholder="Chọn loại phòng"
              className="w-full"
              styles={{ input: { height: 35 } }}
              value={inputType}
              onChange={setInputType}
              data={[
                { value: "", label: "Tất cả" },
                ...Object.entries(DepartmentTypeLabel).map(
                  ([value, label]) => ({
                    value,
                    label,
                  })
                ),
              ]}
              clearable
              searchable
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-3">
          <FloatingLabelWrapper label="Tìm theo tên">
            <input
              type="text"
              placeholder="Nhập tên"
              className="border rounded px-3 text-sm w-full h-[35px]"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-3">
          <FloatingLabelWrapper label="Tìm theo số phòng">
            <input
              type="text"
              placeholder="Nhập số phòng"
              className="border rounded px-3 text-sm w-full h-[35px]"
              value={inputRoom}
              onChange={(e) => setInputRoom(e.target.value)}
            />
          </FloatingLabelWrapper>
        </div>

        {/* Nút: chiếm 2 cột */}
        <div className="col-span-2 flex gap-2 justify-end">
          <Button
            variant="light"
            color="gray"
            onClick={handleReset}
            style={{ height: 35 }}
            fullWidth
          >
            Tải lại
          </Button>
          <Button
            variant="filled"
            color="blue"
            onClick={handleSearch}
            style={{ height: 35 }}
            fullWidth
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <CustomTable
        data={departments}
        columns={columns}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageSizeOptions={setting?.paginationSizeList
          ?.slice()
          ?.sort((a, b) => a - b)}
      />

      <CreateEditDepartmentModal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setSelectedDepartment(null);
          setEditingId(null);
        }}
        initialData={selectedDepartment}
        onSubmit={() =>
          fetchDepartments({
            page: page - 1,
            size: pageSize,
            name: filterName || undefined,
            type: filterType || undefined,
            roomNumber: filterRoom || undefined,
          })
        }
      />
    </>
  );
};

export default DepartmentPage;
