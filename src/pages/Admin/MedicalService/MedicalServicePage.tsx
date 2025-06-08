import React, { useEffect, useState } from "react";
import { Select, Button } from "@mantine/core";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import useMedicalService from "../../../hooks/medical-service/useMedicalService";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import CreateEditModal from "../../../components/admin/MedicalService/CreateEditModal";
import {
  CreateMedicalServiceRequest,
  MedicalService,
} from "../../../types/MedicalService";

const MedicalServicePage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] = useState<keyof MedicalService | undefined>(
    "name"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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

  const [searchName, setSearchName] = useState<string>("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | undefined
  >(undefined);
  const [departments, setDepartments] = useState<
    { label: string; value: string }[]
  >([]);
  const [serviceNameOptions, setServiceNameOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    fetchAllMedicalServices(
      page - 1,
      pageSize,
      sortKey || "name",
      sortDirection,
      {
        name: searchName,
        departmentId: selectedDepartmentId,
      }
    );
  }, [
    page,
    pageSize,
    sortKey,
    sortDirection,
    searchName,
    selectedDepartmentId,
  ]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axiosInstance.get("/departments/all");
        const options = res.data.result.map((d: any) => ({
          label: d.name,
          value: d.id,
        }));
        setDepartments(options);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchServiceNames = async () => {
      try {
        const res = await axiosInstance.get("/medical-service", {
          params: { page: 0, size: 1000 },
        });
        const options = Array.from(
          new Set(res.data.result.content.map((s: any) => s.name))
        ).map((name) => ({
          label: name as string,
          value: name as string,
        }));

        setServiceNameOptions(options);
      } catch (error) {
        console.error("Failed to fetch service names:", error);
      }
    };

    fetchServiceNames();
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
          `/medical-service/${selectedService.id}`,
          formData
        );
        toast.success("Updated successfully");
      } else {
        await axiosInstance.post(`/medical-service`, formData);
        toast.success("Created successfully");
      }
      fetchAllMedicalServices(
        page - 1,
        pageSize,
        sortKey || "name",
        sortDirection,
        {
          name: searchName,
          departmentId: selectedDepartmentId,
        }
      );
    } catch (error) {
      console.error("Error saving medical service", error);
      toast.error("An error occurred");
    } finally {
      setModalOpened(false);
    }
  };

  const columns = [
    createColumn<MedicalService>({
      key: "name",
      label: "Tên Dịch Vụ",
      sortable: true,
    }),
    createColumn<MedicalService>({
      key: "description",
      label: "Mô tả",
      sortable: false,
    }),
    createColumn<MedicalService>({
      key: "department",
      label: "Tên phòng",
      sortable: false,
      render: (row) => row.department.name,
    }),
    createColumn<MedicalService>({
      key: "price",
      label: "Giá",
      sortable: true,
      render: (row) => `${row.price.toLocaleString()} VND`,
    }),
    createColumn<MedicalService>({
      key: "vat",
      label: "VAT (%)",
      sortable: true,
    }),
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Dịch Vụ Khám</h1>
        <Button onClick={handleAdd} color="blue">
          Tạo
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 my-4">
        <Select
          placeholder="Chọn tên dịch vụ"
          data={serviceNameOptions}
          value={searchName}
          onChange={(value) => {
            setSearchName(value || "");
            setPage(1);
          }}
          clearable
          searchable
          className="flex-1 min-w-[150px]"
        />

        <Select
          placeholder="Chọn phòng ban"
          data={departments}
          value={selectedDepartmentId}
          onChange={(value) => {
            setSelectedDepartmentId(value || undefined);
            setPage(1);
          }}
          clearable
          searchable
          className="flex-1 min-w-[150px]"
        />
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
        onSortChange={(key, direction) => {
          setSortKey(key);
          setSortDirection(direction);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
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
