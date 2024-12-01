import type {  optionsType, pageResponseType, formOptionsType,  uploadType } from "./option";
export const defaultOptForm = <formOptionsType>{
    submitText: "确定",
    resetText: "重置",
    labelWidth: "150px",
    layout: "horizontal",
    placeholderPrefixInput: "请输入",
    placeholderPrefixSelect: "请选择",
    startDatePlaceholder: "开始日期",
    endDatePlaceholder: "结束日期",
}

export const defaultOptTable = <optionsType>{
    pk: "id",
    pageSize: 10,
    operationColumn: false,
    operationColumnWidth: 300,
    operationColumnText: "操作",
    operationColumnAlign: "center",
    operationColumnFixed: "right",
    labelWidth: "120px",
    api: (e: any): Promise<pageResponseType | undefined> =>
        Promise.resolve(undefined),
    editText: "编辑",
    addText: "新增",
    deleteText: "删除",
    deleteTip: "确定要删除此条记录吗？",
    deleteSelectTip: "确定要删除选中记录吗？",
    exportText: "导出",
    exportTip: "确定要导出查询到的记录吗？",
    submitText: "提交",
    cancelText: "取消",
    resetText: "重置",
    searchText: "搜索",
    okText: "确定",
    placeholderPrefixInput: "请输入",
    placeholderPrefixSelect: "请选择",
    height: "300px",
    searchLabelWidth: "100px", //搜索表单label宽度
    searchLabelHide: false, //搜索表单label是否隐藏
    searchLabelAlign: "right", //搜索表单label对齐方式
    searchColNumber: 4, //搜索表单每行显示的列数
    btnBoxInline: false,
    needPagination: true,
    pageListKey: "list",
    pageTotalKey: "total",
    autoRequest: true,
    dict: {
        translation: true,
        data: [],
    },
    dialogWidth: 600,
    formIsCol: false,
}

export const defaultOptUpload = <uploadType>{
    name: "file",
    multiple: false,
    type: "image",
    maxCount: 5,
    maxSize: 100,
    uploadBtnText: "上传文件",
    accept: ".png,.jpg,.jpeg",
    isSigle: true,
    limtWarn: '最多只能上传5个！',
    sizeWarn: '文件大小不能超过100M！',
    typeWarn: '文件格式必须是.png,.jpg,.jpeg！'
}