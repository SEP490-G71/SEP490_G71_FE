import { TemplateFileType } from "../../../enums/Admin/TemplateFileType";

export type TemplateFileRequest = {
  type: TemplateFileType;
  name: string;
  isDefault: boolean;
};
