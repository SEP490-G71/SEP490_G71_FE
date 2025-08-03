import { useEffect, useState } from "react";
import { Select, Button, TextInput } from "@mantine/core";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import useMedicalService from "../../../hooks/medical-service/useMedicalService";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import CreateEditModal from "../../../components/admin/MedicalService/CreateEditModal";
import {
  CreateMedicalServiceRequest,
  Department,
  MedicalService,
} from "../../../types/Admin/MedicalService/MedicalService";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import PageMeta from "../../../components/common/PageMeta";

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

  const [isViewMode, setIsViewMode] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedService, setSelectedService] = useState<MedicalService | null>(
    null
  );

  const [searchNameInput, setSearchNameInput] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | undefined
  >(undefined);

  const [departmentFilterInput, setDepartmentFilterInput] = useState<
    string | undefined
  >(undefined);

  const [departments, setDepartments] = useState<
    { label: string; value: string }[]
  >([]);

  const [, setServiceNameOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const { setting } = useSettingAdminService();

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);

  useEffect(() => {
    fetchAllMedicalServices(page - 1, pageSize);
  }, [page, pageSize, searchName, selectedDepartmentId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentsRes = await axiosInstance.get("/departments/all");
        const departmentsOptions = departmentsRes.data.result.map(
          (d: Department) => ({
            label: d.name,
            value: d.id,
          })
        );
        setDepartments(departmentsOptions);

        const servicesRes = await axiosInstance.get("/medical-services", {
          params: { page: 0, size: 1000 },
        });
        const serviceNameOptions = Array.from(
          new Set(
            (servicesRes.data.result.content as MedicalService[]).map(
              (s) => s.name
            )
          )
        ).map((name) => ({
          label: name,
          value: name,
        }));
        setServiceNameOptions(serviceNameOptions);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

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
    } else {
      toast.error("Failed to fetch service details");
    }
  };

  const handleEdit = async (row: MedicalService) => {
    const data = await fetchMedicalServiceById(row.id);
    if (data) {
      setSelectedService(data);
      setModalOpened(true);
    } else {
      toast.error("Failed to fetch service details");
    }
  };

  const handleDelete = async (row: MedicalService) => {
    await handleDeleteMedicalServiceById(row.id);
  };

  const handleSubmit = async (formData: CreateMedicalServiceRequest) => {
    try {
      if (selectedService) {
        await axiosInstance.put(
          `/medical-services/${selectedService.id}`,
          formData
        );
        toast.success("Updated successfully");
      } else {
        await axiosInstance.post(`/medical-services`, formData);
        toast.success("Created successfully");
      }
      fetchAllMedicalServices(page - 1, pageSize);
    } catch (error) {
      console.error("Error saving medical service", error);
      toast.error("An error occurred");
    } finally {
      setModalOpened(false);
    }
  };

  const handleSearch = () => {
    setSearchName(searchNameInput.trim());
    setSelectedDepartmentId(departmentFilterInput);
    setPage(1);
  };

  const handleReset = () => {
    setSearchNameInput("");
    setSearchName("");
    setDepartmentFilterInput(undefined);
    setSelectedDepartmentId(undefined);
    setPage(1);
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
    // createColumn<MedicalService>({
    //   key: "description",
    //   label: "Mô tả",
    //   render: (row) => {
    //     const desc = row.description || "";
    //     const short = desc.length > 40 ? desc.slice(0, 40) + "..." : desc;
    //     return <span title={desc}>{short}</span>;
    //   },
    // }),
    createColumn<MedicalService>({
      key: "department",
      label: "Tên phòng",
      render: (row) => row.department.name,
      align: "left",
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
              data={departments}
              value={departmentFilterInput}
              onChange={(value) => {
                setDepartmentFilterInput(value || undefined);
              }}
              clearable
              searchable
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
