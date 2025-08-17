import { useEffect, useMemo, useState } from "react";
import { Select, Button, TextInput } from "@mantine/core";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import useMedicalService from "../../../hooks/medical-service/useMedicalService";
import CreateEditModal from "../../../components/admin/MedicalService/CreateEditModal";
import {
  CreateMedicalServiceRequest,
  MedicalService,
} from "../../../types/Admin/MedicalService/MedicalService";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import PageMeta from "../../../components/common/PageMeta";
import { useMedicalServiceUpdate } from "../../../hooks/medical-service/useMedicalServiceUpdate";
import useDepartmentService from "../../../hooks/department-service/useDepartmentService";

const MedicalServicePage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const {
    medicalServices,
    totalItems,
    loading,
    fetchAllMedicalServices,
    fetchMedicalServiceById,
    handleDeleteMedicalServiceById,
  } = useMedicalService();

  const {
    departments,
    loading: deptLoading,
    fetchAllDepartments,
  } = useDepartmentService();

  const [isViewMode, setIsViewMode] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedService, setSelectedService] = useState<MedicalService | null>(
    null
  );

  const [searchNameInput, setSearchNameInput] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(null);
  const [departmentFilterInput, setDepartmentFilterInput] = useState<
    string | null
  >(null);
  const [deptSearch, setDeptSearch] = useState("");

  const { setting } = useSettingAdminService();

  const { updateMedicalService } = useMedicalServiceUpdate();

  const departmentOptions = useMemo(
    () => departments.map((d) => ({ label: d.name, value: d.id })),
    [departments]
  );

  const refetchWithFilters = () =>
    fetchAllMedicalServices(page - 1, pageSize, "name", "asc", {
      name: searchName || undefined,
      departmentId: selectedDepartmentId || undefined,
    });

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);

  useEffect(() => {
    fetchAllDepartments();
  }, []);

  useEffect(() => {
    refetchWithFilters();
  }, [page, pageSize, searchName, selectedDepartmentId]);

  const handleAdd = () => {
    setSelectedService(null);
    setModalOpened(true);
  };

  const handleView = async (row: MedicalService) => {
    const data = await fetchMedicalServiceById(row.id);
    if (data) {
      setSelectedService(data);
      setIsViewMode(true);
      setModalOpened(true);
    }
  };

  const handleEdit = async (row: MedicalService) => {
    const data = await fetchMedicalServiceById(row.id);
    if (data) {
      setSelectedService(data);
      setModalOpened(true);
    }
  };

  const handleDelete = async (row: MedicalService) => {
    const ok = await handleDeleteMedicalServiceById(row.id);
    if (ok) refetchWithFilters();
  };

  const handleSubmit = async (formData: CreateMedicalServiceRequest) => {
    const success = await updateMedicalService(formData, selectedService?.id);
    if (success) {
      refetchWithFilters();
    }
    return success;
  };

  const handleSearch = () => {
    setSearchName(searchNameInput.trim());
    setSelectedDepartmentId(departmentFilterInput);
    setPage(1);
  };

  const handleReset = () => {
    const nextPage = 1;
    const nextName = "";
    const nextDept: string | null = null;

    setSearchNameInput(nextName);
    setDepartmentFilterInput(nextDept);
    setDeptSearch("");

    setSearchName(nextName);
    setSelectedDepartmentId(nextDept);
    setPage(nextPage);

    fetchAllMedicalServices(nextPage - 1, pageSize, "name", "asc", {
      name: undefined,
      departmentId: undefined,
    });
  };

  const columns = [
    createColumn<MedicalService>({
      key: "serviceCode",
      label: "Mã Dịch Vụ",
      align: "left",
    }),
    createColumn<MedicalService>({
      key: "name",
      label: "Tên Dịch Vụ",
      align: "left",
    }),
    createColumn<MedicalService>({
      key: "department",
      label: "Tên phòng",
      align: "left",
      render: (row) =>
        row.department ? (
          <div className="flex flex-col">
            <span className="font-medium">{row.department.name}</span>
            {row.department.roomNumber ? (
              <span className="text-xs text-gray-500">
                Phòng {row.department.roomNumber}
              </span>
            ) : null}
          </div>
        ) : (
          <span className="text-gray-500">—</span>
        ),
    }),
    createColumn<MedicalService>({
      key: "defaultService",
      label: "Mặc định",
      sortable: false,
      render: (row) =>
        row.defaultService ? (
          <span className="text-green-600 font-medium">Có</span>
        ) : (
          <span className="text-red-600 font-medium">Không</span>
        ),
      align: "center",
    }),
    createColumn<MedicalService>({
      key: "price",
      label: "Giá",
      render: (row) => `${row.price.toLocaleString()} VND`,
    }),
    createColumn<MedicalService>({
      key: "vat",
      label: "VAT (%)",
      render: (row) => `${row.vat}%`,
    }),
  ];

  return (
    <>
      <PageMeta title="Quản lý dịch vụ" description="Quản lý dịch vụ" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h1 className="text-xl font-bold">Dịch Vụ Khám</h1>
        <Button onClick={handleAdd} color="blue">
          Tạo
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-12 md:col-span-5">
          <FloatingLabelWrapper label="Chọn phòng ban">
            <Select
              placeholder="Chọn phòng ban"
              data={departmentOptions}
              value={departmentFilterInput}
              onChange={(value) => setDepartmentFilterInput(value)}
              clearable
              searchable
              searchValue={deptSearch}
              onSearchChange={setDeptSearch}
              disabled={deptLoading}
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 md:col-span-5">
          <FloatingLabelWrapper label="Nhập tên dịch vụ">
            <TextInput
              placeholder="Nhập tên dịch vụ"
              value={searchNameInput}
              onChange={(event) =>
                setSearchNameInput(event.currentTarget.value)
              }
            />
          </FloatingLabelWrapper>
        </div>

        <div className="col-span-12 md:col-span-2 flex items-end gap-2">
          <Button
            variant="light"
            color="gray"
            onClick={handleReset}
            fullWidth
            disabled={loading || deptLoading}
          >
            Tải lại
          </Button>
          <Button
            variant="filled"
            color="blue"
            onClick={handleSearch}
            fullWidth
            disabled={loading || deptLoading}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <CustomTable
        data={medicalServices}
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
      />

      <CreateEditModal
        isViewMode={isViewMode}
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setIsViewMode(false);
        }}
        initialData={selectedService}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default MedicalServicePage;
