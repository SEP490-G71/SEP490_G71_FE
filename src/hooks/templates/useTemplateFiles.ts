import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import {TemplateFileResponse } from "../../types/Admin/Templates/TemplateFileResponse";
import { TemplateFileRequest } from "../../types/Admin/Templates/TemplateFileRequest";

interface UploadPayload {
  file: File;
  info: TemplateFileRequest;
}

export const useTemplateFiles = () => {
  const [templates, setTemplates] = useState<TemplateFileResponse[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/template-files");
      const result = res.data.result;

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
      const res = await axiosInstance.get(`/template-files/${id}`);
      return res.data.result as TemplateFileResponse;
    } catch (error) {
      console.error("Lỗi khi lấy template theo ID:", error);
      toast.error("Không thể tải template");
      return null;
    }
  };

 const createTemplate = async ({ file, info }: UploadPayload) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("info", JSON.stringify({
      name: info.name,
      type: info.type,
      isDefault: info.isDefault, // ✅ đúng chuẩn
    }));

    await axiosInstance.post("/template-files", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Tạo mẫu thành công");
    await fetchTemplates();
  } catch (error) {
    console.error("Lỗi khi tạo mẫu:", error);
    toast.error("Tạo mẫu thất bại");
  }
};


  const updateTemplate = async (id: string, { file, info }: UploadPayload) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("info", JSON.stringify({
        name: info.name,
        type: info.type,
        isDefault: info.isDefault,
      }));

      await axiosInstance.put(`/template-files/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Cập nhật mẫu thành công");
      await fetchTemplates();
    } catch (error) {
      console.error("Lỗi khi cập nhật mẫu:", error);
       throw error;
    }
  };



  const deleteTemplate = async (id: string) => {
    try {
      await axiosInstance.delete(`/template-files/${id}`);
      toast.success("Xóa mẫu thành công");
      await fetchTemplates();
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
