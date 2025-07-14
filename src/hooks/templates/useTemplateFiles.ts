import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { TemplateFileResponse } from "../../types/Admin/Templates/TemplateFileResponse";

export const useTemplateFiles = () => {
  const [templates, setTemplates] = useState<TemplateFileResponse[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/template-file");
      const result = res.data.result;

      // Kiểm tra nếu result.content là mảng hợp lệ
      if (Array.isArray(result?.content)) {
        setTemplates(result.content);
        setTotalItems(result.totalElements || result.content.length);
      } else {
        setTemplates([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách template:", error);
      toast.error("Không thể tải danh sách template");
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplateById = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/template-file/${id}`);
      return res.data.result as TemplateFileResponse;
    } catch (error) {
      console.error("Lỗi khi lấy template theo ID:", error);
      toast.error("Không thể tải template");
      return null;
    }
  };

  const createTemplate = async (newTemplate: Omit<TemplateFileResponse, "id">) => {
    try {
      await axiosInstance.post("/template-file", newTemplate);
      toast.success("Tạo mẫu thành công");
      fetchTemplates();
    } catch (error) {
      console.error("Lỗi khi tạo mẫu:", error);
      toast.error("Tạo mẫu thất bại");
    }
  };

  const updateTemplate = async (id: string, updated: Partial<TemplateFileResponse>) => {
    try {
      await axiosInstance.put(`/template-file/${id}`, updated);
      toast.success("Cập nhật mẫu thành công");
      fetchTemplates();
    } catch (error) {
      console.error("Lỗi khi cập nhật mẫu:", error);
      toast.error("Cập nhật mẫu thất bại");
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await axiosInstance.delete(`/template-file/${id}`);
      toast.success("Xóa mẫu thành công");
      fetchTemplates();
    } catch (error) {
      console.error("Lỗi khi xoá mẫu:", error);
      toast.error("Xóa mẫu thất bại");
    }
  };

  return {
    templates,
    totalItems,
    loading,
    fetchTemplates,
    fetchTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};

export default useTemplateFiles;
