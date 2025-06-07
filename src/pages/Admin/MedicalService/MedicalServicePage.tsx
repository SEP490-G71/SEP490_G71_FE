import React, { useEffect, useState } from "react";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import useMedicalService from "../../../hooks/medical-service/useMedicalService";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import CreateEditModal from "../../../components/admin/MedicalService/CreateEditModal";
import { MedicalService } from "../../../types/MedicalService";

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

  useEffect(() => {
    fetchAllMedicalServices(page - 1, pageSize); // page -1 vì BE của bạn page bắt đầu từ 0
  }, [page, pageSize]);

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

  const handleSubmit = async (data: {
    name: string;
    description: string;
    departmentName: string;
    price: number;
    vat: number;
  }) => {
    try {
      if (selectedService) {
        // Update
        await axiosInstance.put(`/medical-service/${selectedService.id}`, data);
        toast.success("Updated successfully");
      } else {
        // Create
        await axiosInstance.post(`/medical-service`, data);
        toast.success("Created successfully");
      }
      fetchAllMedicalServices(page - 1, pageSize); // reload table
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

  console.log("medicalServices", medicalServices);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Medical Services</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          + Add
        </button>
      </div>

      {/* Search bar */}
      <div className="flex flex-wrap gap-2 my-4">
        <input
          type="text"
          placeholder="Search by Name"
          className="border rounded px-3 py-2 text-sm flex-1 min-w-[150px]"
          onChange={(e) => console.log("Search 1:", e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Status"
          className="border rounded px-3 py-2 text-sm flex-1 min-w-[150px]"
          onChange={(e) => console.log("Search 2:", e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Project"
          className="border rounded px-3 py-2 text-sm flex-1 min-w-[150px]"
          onChange={(e) => console.log("Search 3:", e.target.value)}
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
        onView={(row) => handleView(row)}
        onEdit={(row) => handleEdit(row)}
        onDelete={(row) => handleDelete(row)}
      />

      {/* <AntdTable medicalServices={medicalServices} /> */}

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
