import { useEffect, useState } from "react";
import { Button, Select, TextInput } from "@mantine/core";
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
import useUnassignedStaffs from "../../../hooks/department-Staffs/useUnassignedStaffs";

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
  const [isViewMode, setIsViewMode] = useState(false);
  const [, setEditingId] = useState<string | null>(null);

  const [inputName, setInputName] = useState("");
  const [filterName, setFilterName] = useState("");
  const [inputRoom, setInputRoom] = useState("");
  const [filterRoom, setFilterRoom] = useState("");
  const [inputType, setInputType] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("");

  const { setting } = useSettingAdminService();
  const { fetchUnassignedStaffs } = useUnassignedStaffs();
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
    setIsViewMode(false);
    setEditingId(null);
    setModalOpened(true);
  };
  const handleView = async (row: DepartmentResponse) => {
    const res = await fetchDepartmentById(row.id);
    if (res) {
      setSelectedDepartment(res);
      setIsViewMode(true);
      setModalOpened(true);
    } else {
      toast.error("Không thể xem chi tiết phòng ban");
    }
  };
  const handleEdit = async (row: DepartmentResponse) => {
    const res = await fetchDepartmentById(row.id);
    if (res) {
      setSelectedDepartment(res);
      setEditingId(row.id);
      setIsViewMode(false);
      setModalOpened(true);

      // 👇 Gọi lấy nhân viên chưa gán với type tương ứng
      fetchUnassignedStaffs(res.type);
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
    createColumn<DepartmentResponse>({
      key: "description",
      label: "Mô tả",
      render: (row) => {
        const desc = row.description || "";
        const short = desc.length > 40 ? desc.slice(0, 40) + "..." : desc;

        return <span title={desc}>{short}</span>;
      },
    }),
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2  mb-4">
        <h1 className="text-xl font-bold">Phòng ban</h1>
        <Button color="blue" onClick={handleAdd}>
          Tạo
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-4">
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
            <TextInput
              type="text"
              placeholder="Nhập tên"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-3">
          <FloatingLabelWrapper label="Tìm theo số phòng">
            <TextInput
              type="text"
              placeholder="Nhập số phòng"
              value={inputRoom}
              onChange={(e) => setInputRoom(e.target.value)}
            />
          </FloatingLabelWrapper>
        </div>

        {/* Nút: chiếm 2 cột */}
        <div className="col-span-2  gap-2 flex items-end">
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
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateEditDepartmentModal
        opened={modalOpened}
        isViewMode={isViewMode}
        onClose={() => {
          setModalOpened(false);
          setSelectedDepartment(null);
          setEditingId(null);
          setIsViewMode(false);
        }}
        initialData={selectedDepartment}
        departmentType={selectedDepartment?.type}
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
