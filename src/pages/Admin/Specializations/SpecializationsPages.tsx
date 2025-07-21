// File: SpecializationsPages.tsx

import { useEffect, useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import { CreateEditModalSpecializations } from "../../../components/admin/Specializations/CreateEditModalSpecializations";
import { useSpecializations } from "../../../hooks/Specializations/useSpecializations";
import {
  CreateSpecializationRequest,
  Specialization,
} from "../../../types/Admin/Specializations/Specializations";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";

export const SpecializationsPages = () => {
  const [searchName, setSearchName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [modalOpened, setModalOpened] = useState(false);
  const [selected, setSelected] = useState<Specialization | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const {
    specializations,
    fetchAllSpecializations,
    fetchSpecializationById,
    deleteSpecialization,
    submitSpecialization,
    loading,
    totalItems,
  } = useSpecializations();

  const { setting } = useSettingAdminService();

  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);

  useEffect(() => {
    fetchAllSpecializations({
      name: searchName,
      page: page - 1,
      size: pageSize,
    });
  }, [searchName, page, pageSize]);

  const handleSearch = () => {
    setSearchName(searchInput.trim());
    setPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setSearchName("");
    setPage(1);
  };

  const handleAdd = () => {
    setSelected(null);
    setModalOpened(true);
  };

  const handleEdit = async (row: Specialization) => {
    const data = await fetchSpecializationById(row.id);
    if (data) {
      setSelected(data);
      setIsViewMode(false);
      setModalOpened(true);
    }
  };

  const handleView = async (row: Specialization) => {
    const data = await fetchSpecializationById(row.id);
    if (data) {
      setSelected(data);
      setIsViewMode(true);
      setModalOpened(true);
    }
  };

  const handleDelete = async (row: Specialization) => {
    await deleteSpecialization(row.id);
    fetchAllSpecializations({
      name: searchName,
      page: page - 1,
      size: pageSize,
    });
  };

  const handleSubmit = async (form: CreateSpecializationRequest) => {
    const success = await submitSpecialization(form, selected, {
      name: searchName,
      page: page - 1,
      size: pageSize,
    });

    return success;
  };

  const columns = [
    createColumn<Specialization>({ key: "name", label: "Tên chuyên khoa" }),
    createColumn<Specialization>({ key: "description", label: "Mô tả" }),
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h1 className="text-xl font-bold">Chuyên khoa</h1>
        <Button color="blue" onClick={handleAdd}>
          Tạo
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-12 md:col-span-10">
          <FloatingLabelWrapper label="Tên chuyên khoa">
            <TextInput
              value={searchInput}
              onChange={(e) => setSearchInput(e.currentTarget.value)}
              placeholder="Nhập tên chuyên khoa"
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
        data={specializations}
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
        showActions
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateEditModalSpecializations
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setIsViewMode(false);
        }}
        initialData={selected}
        onSubmit={handleSubmit}
        isViewMode={isViewMode}
        onSuccess={() => setSelected(null)}
      />
    </>
  );
};
