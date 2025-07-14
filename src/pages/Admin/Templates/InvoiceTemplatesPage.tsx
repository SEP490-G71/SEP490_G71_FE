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

const InvoiceTemplatesPage = () => {
  const { templates, loading, totalItems, fetchTemplates, deleteTemplate } =
    useTemplateFiles();
  const invoiceTemplates = templates.filter((t) => t.type === "INVOICE");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] = useState<keyof TemplateFileResponse>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [modalOpened, setModalOpened] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<TemplateFileResponse | null>(null);
  useEffect(() => {
    fetchTemplates();
  }, [page, pageSize, sortKey, sortDirection]);

  const handleEdit = (template: TemplateFileResponse) => {
    setEditingTemplate(template);
    setModalOpened(true);
  };

  const handleSubmitTemplate = (data: FormValues) => {
    console.log("Submit data:", data);
    // TODO: Gọi API tạo mới template ở đây
    setModalOpened(false);
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
        title="Quản lý mẫu hóa đơn | Admin Dashboard"
        description="Trang quản lý mẫu hóa đơn trong hệ thống"
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h1 className="text-xl font-bold">Mẫu hóa đơn</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => setModalOpened(true)}
        >
          + Thêm mẫu hóa đơn
        </button>
      </div>

      <CustomTable
        data={invoiceTemplates}
        columns={columns}
        loading={loading}
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
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <div className="mt-4 p-4 rounded bg-green-100 text-green-700 text-sm flex items-start gap-2">
        <span>⭐</span>
        <span>
          Sử dụng các đoạn mã dưới đây để xây dựng mẫu in hóa đơn (thông báo học
          phí) của riêng bạn. Hãy ấn vào mỗi mã để sao chép nhanh
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
                // description: editingTemplate.description,
                isDefault: editingTemplate.isDefault,
                file: null, // file cũ không cần truyền vào
              }
            : null
        }
      />
    </>
  );
};

export default InvoiceTemplatesPage;
