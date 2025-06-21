import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import CustomTable from "../../../components/common/CustomTable";
import { CreatePatientModal } from "../../../components/admin/Patient-Management/CreatePatientModal";
import { createColumn } from "../../../components/utils/tableUtils";
import {
  Patient,
  CreateUpdatePatientRequest,
} from "../../../types/Admin/Patient-Management/PatientManagement";
import { usePatientManagement } from "../../../hooks/Patient-Management/usePatientManagement";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export const PatientManagementPage = () => {
  const {
    patients,
    loading,
    fetchAllPatients,
    fetchPatientById,
    deletePatientById,
  } = usePatientManagement();

  const [modalOpened, setModalOpened] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchAllPatients(page - 1, pageSize).then((total) => {
      setTotalItems(total);
    });
  }, [page, pageSize]);

  const handleAdd = () => {
    setSelectedPatient(null);
    setModalOpened(true);
  };

  const handleView = async (row: Patient) => {
    const patient = await fetchPatientById(row.id);
    if (patient) {
      setSelectedPatient(patient);
      setIsViewMode(true);
      setModalOpened(true);
    }
  };

  const handleEdit = async (row: Patient) => {
    const patient = await fetchPatientById(row.id);
    if (patient) {
      setSelectedPatient(patient);
      setIsViewMode(false);
      setModalOpened(true);
    }
  };

  const handleDelete = async (row: Patient) => {
    await deletePatientById(row.id);
  };

  const handleSubmit = async (data: CreateUpdatePatientRequest) => {
    try {
      if (selectedPatient) {
        await axiosInstance.put(`/patients/${selectedPatient.id}`, data);
        toast.success("Cập nhật thành công");
      } else {
        await axiosInstance.post("/patients", data);
        toast.success("Tạo thành công");
      }
      fetchAllPatients();
    } catch (error) {
      toast.error("Lỗi khi lưu thông tin bệnh nhân");
    }
  };

  const columns = [
    createColumn<Patient>({
      key: undefined as any,
      label: "Họ và tên",
      render: (row) =>
        `${row.lastName ?? ""} ${row.middleName ?? ""} ${
          row.firstName ?? ""
        }`.trim(),
    }),
    createColumn<Patient>({
      key: "gender",
      label: "Giới tính",
      render: (row) => (row.gender === "MALE" ? "Nam" : "Nữ"),
    }),
    createColumn<Patient>({
      key: "dob",
      label: "Ngày sinh",
      render: (row) => dayjs(row.dob).format("DD/MM/YYYY"),
    }),
    createColumn<Patient>({ key: "phone", label: "SĐT" }),
    createColumn<Patient>({ key: "email", label: "Email" }),
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Quản lý bệnh nhân</h1>
        <Button onClick={handleAdd}>Tạo bệnh nhân</Button>
      </div>

      <CustomTable
        data={patients}
        columns={columns}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreatePatientModal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setIsViewMode(false);
        }}
        initialData={selectedPatient}
        onSubmit={handleSubmit}
        isViewMode={isViewMode}
      />
    </>
  );
};
