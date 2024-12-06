import type {
  optionsType,
  pageResponseType,
  formOptionsType,
  uploadType,
} from "./option";
import LANG from "../lang";

export const defaultOptForm = <formOptionsType>{
  submitText: LANG.words.submitText,
  resetText: LANG.words.resetText,
  labelWidth: "150px",
  layout: "horizontal",
  startDatePlaceholder: LANG.words.startDatePlaceholder,
  endDatePlaceholder: LANG.words.endDatePlaceholder,
  showResetBtn: true,
  showSubmitBtn: true,
  showFooter: true,
};

export const defaultColumnForm = {
  required: false,
  allowClear: true,
};

export const defaultOptTable = <optionsType>{
  pk: "id",
  pageSize: 10,
  operationColumn: false,
  operationColumnWidth: 180,
  operationColumnText: LANG.words.operationColumnText,
  operationColumnAlign: "center",
  operationColumnFixed: "right",
  labelWidth: "120px",
  api: (e: any): Promise<pageResponseType | undefined> =>
    Promise.resolve(undefined),
  editText: LANG.words.editText,
  addText: LANG.words.addText,
  deleteText: LANG.words.deleteText,
  deleteTip: LANG.tip.deleteTip,
  deleteSelectTip: LANG.tip.deleteSelectTip,
  exportText: LANG.words.exportText,
  exportTip: LANG.words.exportTip,
  submitText: LANG.words.submitText,
  cancelText: LANG.words.cancelText,
  resetText: LANG.words.resetText,
  searchText: LANG.words.searchText,
  okText: LANG.words.typeWarn,
  height: "calc(100vh - 400px)",
  searchLabelWidth: "100px", //搜索表单label宽度
  searchLabelHide: false, //搜索表单label是否隐藏
  searchLabelAlign: "right", //搜索表单label对齐方式
  searchColNumber: 4, //搜索表单每行显示的列数
  btnBoxInline: false,
  needPagination: true,
  pageListKey: "records",
  pageTotalKey: "total",
  autoRequest: true,
  dialogWidth: 600,
  formIsCol: false,
  modelType: "dialog",
  tableExpandAll: true,
  showTableTool: true,
  showSearch: true,
};

export const defaultOptUpload = <uploadType>{
  name: "file",
  multiple: false,
  type: "image",
  maxCount: 5,
  maxSize: 100,
  uploadBtnText: LANG.words.uploadBtnText,
  accept: ".png,.jpg,.jpeg",
  isSigle: true,
  limtWarn: LANG.tip.limtWarn,
  sizeWarn: LANG.tip.sizeWarn,
  typeWarn: LANG.tip.typeWarn,
};
