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
import { TemplateFileRequest } from "../../../types/Admin/Templates/TemplateFileRequest";
import { TemplateFileType } from "../../../enums/Admin/TemplateFileType";
import { toast } from "react-toastify";
import { useSettingAdminService } from "../../../hooks/setting/useSettingAdminService";
import { Button } from "@mantine/core";

const InvoiceTemplatesPage = () => {
  const {
    templates,
    loading,
    fetchTemplates,
    deleteTemplate,
    createTemplate,
    updateTemplate,
  } = useTemplateFiles();
  const invoiceTemplates = templates.filter((t) => t.type === "INVOICE");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] = useState<keyof TemplateFileResponse>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [modalOpened, setModalOpened] = useState(false);
  const { setting } = useSettingAdminService();
  const paginatedTemplates = invoiceTemplates.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  useEffect(() => {
    if (setting?.paginationSizeList?.length) {
      setPageSize(setting.paginationSizeList[0]);
    }
  }, [setting]);
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
    const isEditMode = !!editingTemplate;

    const info: TemplateFileRequest = {
      name: form.name,
      isDefault: form.isDefault,
      type: TemplateFileType.INVOICE,
    };

    // ⛔ Không được tắt mẫu mặc định cuối cùng
    if (isEditMode && editingTemplate?.isDefault && !form.isDefault) {
      const hasOtherDefault = invoiceTemplates.some(
        (t) => t.isDefault && t.id !== editingTemplate.id
      );

      if (!hasOtherDefault) {
        toast.error("❗ Không thể tắt mẫu mặc định cuối cùng.");
        return;
      }
    }

    // 🧠 Nếu bật mẫu mới là mặc định => đồng thời cập nhật mẫu cũ về false
    const updates: Promise<any>[] = [];

    if (isEditMode && form.isDefault) {
      const currentDefault = invoiceTemplates.find(
        (t) => t.isDefault && t.id !== editingTemplate?.id
      );

      if (currentDefault) {
        updates.push(
          updateTemplate(currentDefault.id, {
            file: new File([], "dummy.pdf"),
            info: {
              name: currentDefault.name,
              type: TemplateFileType.INVOICE,
              isDefault: false,
            },
          })
        );
      }
    }

    if (!form.file && !editingTemplate) {
      toast.error("❗ Vui lòng chọn file.");
      return;
    }

    // 🔄 Update mẫu hiện tại
    if (isEditMode && form.file) {
      updates.push(
        updateTemplate(editingTemplate.id, { file: form.file, info })
      );
    } else if (!isEditMode && form.file) {
      info.isDefault = false; // khi tạo mới mặc định là false
      updates.push(createTemplate({ file: form.file, info }));
    }

    try {
      const results = await Promise.allSettled(updates);

      const hasFailure = results.some((res) => res.status === "rejected");

      if (hasFailure) {
        toast.error("❗ Có lỗi xảy ra khi cập nhật mẫu.");
      } else {
        toast.success("✅ Cập nhật thành công");
        setModalOpened(false);
        setEditingTemplate(null);
      }
    } catch (err) {
      toast.error("❗ Gặp lỗi không xác định.");
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
        title="Quản lý mẫu hóa đơn | Admin Dashboard"
        description="Trang quản lý mẫu hóa đơn trong hệ thống"
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h1 className="text-xl font-bold">Mẫu hóa đơn</h1>
        <Button onClick={() => setModalOpened(true)}>Tạo</Button>
      </div>

      <CustomTable
        data={paginatedTemplates}
        columns={columns}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalItems={invoiceTemplates.length}
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
                isDefault: editingTemplate.isDefault,
                file: null,
              }
            : null
        }
      />
    </>
  );
};

export default InvoiceTemplatesPage;
