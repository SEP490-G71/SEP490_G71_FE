import { useEffect, useState } from "react";
import CustomTable from "../../../components/common/CustomTable";
import { createColumn } from "../../../components/utils/tableUtils";
import PageMeta from "../../../components/common/PageMeta";
import useTemplateFiles from "../../../hooks/templates/useTemplateFiles";
import { TemplateFileResponse } from "../../../types/Admin/Templates/TemplateFileResponse";
import TemplateVariablesTable from "../../../components/admin/Template/TemplateVariablesTable";
import CreateEditTemplateModal, {
  FormValues,
} from "../../../components/admin/Template/CreateEditTemplateModal";
import { TemplateFileType } from "../../../enums/Admin/TemplateFileType";
import { toast } from "react-toastify";

const MedicalTemplatesPage = () => {
  const {
    templates,
    loading,
    fetchTemplates,
    deleteTemplate,
    createTemplate,
    updateTemplate,
  } = useTemplateFiles();

  const medicalTemplates = templates.filter((t) => t.type === "MEDICAL_RECORD");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] = useState<keyof TemplateFileResponse>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [modalOpened, setModalOpened] = useState(false);
  const paginatedTemplates = medicalTemplates.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const [editingTemplate, setEditingTemplate] =
    useState<TemplateFileResponse | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, [page, pageSize, sortKey, sortDirection]);

  const handleEdit = (template: TemplateFileResponse) => {
    setEditingTemplate(template);
    setModalOpened(true);
  };

  const handleSubmitTemplate = async (form: FormValues) => {
    const info = {
      name: form.name,
      isDefault: form.isDefault,
      type: TemplateFileType.MEDICAL_RECORD,
    };

    if (!form.file && !editingTemplate) {
      toast.error(" Vui lòng chọn file để tạo mới");
      return;
    }

    try {
      if (editingTemplate) {
        if (!form.file) {
          toast.error(" Vui lòng chọn file mới để cập nhật");
          return;
        }

        await updateTemplate(editingTemplate.id, { file: form.file, info });
      } else {
        await createTemplate({ file: form.file!, info });
      }

      setModalOpened(false);
      setEditingTemplate(null);
    } catch (error: any) {
      const code = error?.response?.data?.code;
      if (code === 2104) {
        toast.error(" Không thể tắt mẫu mặc định cuối cùng.");
        throw new Error("CANNOT_DISABLE_LAST_DEFAULT_TEMPLATE");
      } else if (code === 2106) {
        toast.error("Đã tồn tại mẫu mặc định. Vui lòng tắt mẫu đó trước.");
        throw new Error("DUPLICATE_DEFAULT_TEMPLATE");
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật.");
        throw new Error("GENERIC_UPDATE_ERROR");
      }
    }
  };

  const handleDelete = async (row: TemplateFileResponse) => {
    await deleteTemplate(row.id);
  };

  const columns = [
    createColumn<TemplateFileResponse>({
      key: "id",
      label: "Mã",
      render: (row) => (
        <a
          href={row.previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 hover:underline"
        >
          {row.id}
        </a>
      ),
    }),
    createColumn<TemplateFileResponse>({ key: "name", label: "Tên" }),
    createColumn<TemplateFileResponse>({
      key: "isDefault",
      label: "Mặc định",
      render: (row) => (
        <div>
          {row.isDefault ? (
            <span className="text-green-600 font-bold ml-5">✓</span>
          ) : (
            <span className="text-red-500 font-bold ml-5">x</span>
          )}
        </div>
      ),
    }),
  ];

  return (
    <>
      <PageMeta
        title="Quản lý mẫu y tế | Admin Dashboard"
        description="Trang quản lý mẫu y tế trong hệ thống"
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h1 className="text-xl font-bold">Mẫu y tế</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => setModalOpened(true)}
        >
          + Thêm mẫu y tế
        </button>
      </div>

      <CustomTable
        data={paginatedTemplates}
        columns={columns}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalItems={medicalTemplates.length}
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
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div className="mt-4 p-4 rounded bg-green-100 text-green-700 text-sm flex items-start gap-2">
        <span>⭐</span>
        <span>
          Sử dụng các đoạn mã dưới đây để xây dựng mẫu in y tế của riêng bạn.
          Hãy ấn vào mỗi mã để sao chép nhanh
        </span>
      </div>

      <TemplateVariablesTable />

      <CreateEditTemplateModal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setEditingTemplate(null);
        }}
        onSubmit={handleSubmitTemplate}
        initialData={
          editingTemplate
            ? {
                name: editingTemplate.name,
                isDefault: editingTemplate.isDefault,
                file: null,
              }
            : null
        }
      />
    </>
  );
};

export default MedicalTemplatesPage;
