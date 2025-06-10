import React, { useEffect, useState } from "react";
import { Select } from "@mantine/core"; // thêm Select
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import { EmployeeResponse } from "../../../types/Admin/Employee/EmployeeTypeResponse";
import { EmployeeRequest } from "../../../types/Admin/Employee/EmployeeTypeRequest";
import { Specialty, Level, Gender } from "../../../enums/Admin/EmployeeEnums";
import CreateEditStaffModal from "../../../components/admin/EmployeeService/CreateEditStaffModal";

const EmployeeServicePage = () => {
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] = useState<keyof EmployeeResponse | undefined>(
    "name"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [modalOpened, setModalOpened] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeRequest | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Thêm state cho filter
  const [filterName, setFilterName] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/employee`, {
        params: {
          page: page - 1,
          size: pageSize,
          sortBy: sortKey,
          sortDir: sortDirection,
          name: filterName || undefined,
          specialty: filterSpecialty || undefined,
          level: filterLevel || undefined,
        },
      });
      setEmployees(res.data.items || []);
      setTotalItems(res.data.total || 0);
    } catch (error) {
      console.error("Failed to fetch employees", error);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [
    page,
    pageSize,
    sortKey,
    sortDirection,
    filterName,
    filterSpecialty,
    filterLevel,
  ]);

  const handleAdd = () => {
    setSelectedEmployee(null);
    setEditingId(null);
    setModalOpened(true);
  };

  const convertResponseToRequest = (
    res: EmployeeResponse
  ): EmployeeRequest => ({
    name: res.name,
    email: res.email,
    phone: res.phone,
    gender: res.gender,
    dob: res.dob,
    level: res.level,
    specialty: res.specialty,
    accountId: res.accountId,
  });

  const handleView = async (row: EmployeeResponse) => {
    try {
      const res = await axiosInstance.get(`/employee/${row.id}`);
      setSelectedEmployee(convertResponseToRequest(res.data));
      setIsViewMode(true);
      setModalOpened(true);
    } catch {
      toast.error("Failed to fetch employee details");
    }
  };

  const handleEdit = async (row: EmployeeResponse) => {
    try {
      const res = await axiosInstance.get(`/employee/${row.id}`);
      setSelectedEmployee(convertResponseToRequest(res.data));
      setEditingId(row.id);
      setModalOpened(true);
    } catch {
      toast.error("Failed to fetch employee details");
    }
  };

  const handleDelete = async (row: EmployeeResponse) => {
    try {
      await axiosInstance.delete(`/employee/${row.id}`);
      toast.success("Deleted successfully");
      fetchEmployees();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSubmit = async (data: EmployeeRequest) => {
    try {
      if (editingId) {
        await axiosInstance.put(`/employee/${editingId}`, data);
        toast.success("Updated successfully");
      } else {
        await axiosInstance.post(`/employee`, data);
        toast.success("Created successfully");
      }
      fetchEmployees();
    } catch {
      toast.error("Error saving employee");
    } finally {
      setModalOpened(false);
      setEditingId(null);
    }
  };

  const columns = [
    createColumn<EmployeeResponse>({
      key: "name",
      label: "Họ tên",
      sortable: true,
    }),
    createColumn<EmployeeResponse>({ key: "email", label: "Email" }),
    createColumn<EmployeeResponse>({ key: "phone", label: "SĐT" }),
    createColumn<EmployeeResponse>({
      key: "specialty",
      label: "Chuyên môn",
      render: (row) => row.specialty,
    }),
    createColumn<EmployeeResponse>({
      key: "level",
      label: "Cấp bậc",
      render: (row) => row.level,
    }),
    createColumn<EmployeeResponse>({
      key: "gender",
      label: "Giới tính",
      render: (row) => row.gender,
    }),
    createColumn<EmployeeResponse>({ key: "dob", label: "Ngày sinh" }),
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Nhân viên</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          + Thêm nhân viên
        </button>
      </div>

      {/*  Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4 h-[40px]">
        <input
          type="text"
          placeholder="Tìm theo tên"
          className="border rounded px-3 py-2 text-sm w-full"
          value={filterName}
          onChange={(e) => {
            setPage(1);
            setFilterName(e.target.value);
          }}
        />

        <Select
          placeholder="Chọn chuyên môn"
          className="w-full"
          styles={{ input: { height: 45 } }}
          value={filterSpecialty}
          onChange={(val) => {
            setPage(1);
            setFilterSpecialty(val || "");
          }}
          data={Object.entries(Specialty).map(([value, label]) => ({
            value,
            label,
          }))}
        />

        <Select
          placeholder="Chọn cấp bậc"
          className="w-full"
          styles={{ input: { height: 45 } }}
          value={filterLevel}
          onChange={(val) => {
            setPage(1);
            setFilterLevel(val || "");
          }}
          data={Object.entries(Level).map(([value, label]) => ({
            value,
            label,
          }))}
        />
      </div>

      <CustomTable
        data={employees}
        columns={columns}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
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

      <CreateEditStaffModal
        isViewMode={isViewMode}
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setIsViewMode(false);
          setEditingId(null);
        }}
        initialData={selectedEmployee}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default EmployeeServicePage;
