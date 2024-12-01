
export type inputFormType =
  | 'text'
  | 'textarea'
  | 'inputNumber'
  | 'password'
  | 'date'
  | 'select'
  | 'datePicker'
  | 'timePicker'
  | 'dateTimeRange'
  | 'dateRange'
  | 'upload'
  | 'switch'
  | 'checkbox'
  | 'editor'
  | 'radio';

// 上传配置
export interface uploadType {
  api: (e: any) => Promise<any>;
  name?: string;
  multiple?: boolean; // 仅用于选择上传文件时
  accept?: string;
  maxCount?: number; // 限制上传数量
  maxSize?: number; // 单位为M
  uploadBtnText?: string;
  modeValue?: string | string[]; // string 单文件上传，新的图片会覆盖旧的图片，string[]多文件上传，会显示列表，显示方式同type控制
  type?: 'image' | 'file'; // 上传文件类型
  isSigle?: boolean; // 是否单文件上传  比如头像
  limtWarn?: string; // 上传限制提示
  sizeWarn?: string; //文件大小限制提示
  typeWarn?: string; // 文件类型限制提示
}

// 表单配置
export interface formOptionsType {
  id?: string;
  submitText?: string;
  resetText?: string;
  labelWidth?: string;
  labelPosition?: 'left' | 'right' | 'top';
  placeholderPrefixInput?: string;
  placeholderPrefixSelect?: string;
  startDatePlaceholder?: string,
  endDatePlaceholder?: string,
  inline?: boolean;
  isCol?: boolean;
}

// 表单项配置
export interface formColumnsType {
  dataIndex: string;
  title: string;
  formType?: inputFormType;
  extra?: string;
  align?: 'left' | 'center' | 'right';
  rules?: any[];
  bind?: any;
  dict?: {
    data: { label: string; value: string }[]; // 字典数据，用于select checkbox radio
  };
  required?: boolean;
  upload: uploadType; // 上传配置
  defaultValue?: any; // 表单默认值
  placeholder?: string;
  allowClear?: boolean;
  hide?: boolean; // 表单项是否隐藏
  disabled?: boolean; // 表单项是否禁用
  readonly?: boolean; // 表单项是否只读
  onChange?: (e: any) => void; // 值发生变化时的回调
  colspan: number; // 表单项占几列
}

// 列表配置
export interface optionsType {
  pk: string;
  pageSize?: number;
  needPagination?: boolean;
  pageListKey?: string;
  pageTotalKey?: string;
  operationColumn?: boolean;
  operationColumnWidth?: number;
  operationColumnText?: string;
  operationColumnAlign?: string;
  operationColumnFixed?: boolean | string;
  api: (e: any) => Promise<any>;
  beforeRequest?: (e: any) => void;
  afterRequest?: (e: any) => any[];
  add?: { show: boolean; api: (e: any) => Promise<any> };
  edit?: { show: boolean; api: (e: any) => Promise<any> };
  delete?: { show: boolean; api: (e: any) => Promise<any> };
  export?: { show: boolean; api: (e: any) => Promise<any> };
  searchLabelWidth?: string; // 搜索表单label宽度
  searchLabelAlign?: string; // 搜索表单label对齐方式
  searchLabelHide?: boolean; // 搜索表单label是否隐藏
  searchColNumber?: number; // 搜索表单每行显示的列数
  labelWidth?: string; // 新增编辑表单label宽度
  editText?: string; // 编辑按钮文字
  addText?: string; // 新增按钮文字
  deleteText?: string; // 删除按钮文字
  deleteTip?: string; // 删除提示
  deleteSelectTip?: string; // 删除提示
  exportText?: string; // 导出按钮文字
  exportTip?: string; // 导出提示
  submitText?: string; // 新增编辑提交按钮文字
  cancelText?: string; // 新增编辑取消按钮文字
  resetText?: string; // 搜索重置按钮文字
  searchText?: string; // 搜索按钮文字
  okText?: string; // tip确认时的文字
  placeholderPrefixInput?: string; // 搜索表单input的placeholder前缀
  placeholderPrefixSelect?: string; // 搜索表单select的placeholder前缀
  height?: string | number; // 表格高度
  btnBoxInline?: boolean; // 搜索表彰是否同行显示（满了会自动换行），另一种方式是搜索表单栅格布局
  selectChange?: (...e: any) => void;
  sortChange?: (e: any) => void;
  autoRequest?:boolean; // 是否自动请求
  dialogWidth: string | number; // 新增编辑弹窗宽度
  formIsCol: boolean; //新增编辑表单是否为列布局
}

// 列表项配置
export interface columnsType {
  type?: string;
  dataIndex: string;
  title: string;
  search?: boolean;
  hide?: boolean; // 表格列表是否隐藏
  sortable?:string;

  formType?: inputFormType;
  extra?: string;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  fixed?: boolean | string; // 列是否固定
  dict?: {
    translation: boolean; // 是否对表格列值进行翻译
    tagColors: {
      [key: string]: string;
    }; // 列表tag的颜色，key为字典值，value为颜色
    data: { label: string; value: string }[]; // 字典数据，用于select checkbox radio
  };
  required?: boolean;
  bind?: any; // 表单控件绑定antd属性
  defaultValue?: any; // 新增编辑时的默认值
  searchDefaultValue?: any; // 搜索时的默认值
  placeholder?: string;
  allowClear?: boolean;
  addDisabled?: boolean; // 新增编辑时是否禁用
  editDisabled?: boolean; // 新增编辑时是否禁用
  addReadonly?: boolean; // 新增编辑时是否禁用
  editReadonly?: boolean; // 新增编辑时是否禁用
  addDisplay?: boolean; // 表单新增是否显示
  editDisplay?: boolean; // 表单编辑是否显示
  onChange?: (e: any) => void; // 新增编辑时的值发生变化时的回调
  upload: uploadType; // 上传配置
  colspan: number; // 表单项占几列
}

export interface pageResponseType {
  items: any[];
  pageInfo: {
    total: number;
    totalPage: number;
    currentPage: number;
  };
}
