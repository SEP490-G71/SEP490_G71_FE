import { TemplateFileType } from "../../../enums/Admin/TemplateFileType";

export type TemplateFileResponse = {
  id: string;
  name: string;
  type: TemplateFileType;
  fileUrl: string;
  previewUrl: string;
  isDefault: boolean;
};