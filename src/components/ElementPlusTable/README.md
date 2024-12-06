### ElementPlus 通用列表和表单，列表包含增、删、改、查、导出、分页等功能，表单通过配置项就可以实现大部分的提交，极大提升开发效率。

> 库依赖 vue3 + elementPlus



## 通用列表 CommonTable


#### 1. 介绍

通用列表组件，用于展示列表搜索，分页、新增、编辑、删除、导出。 依赖 vue3 + element plus

#### 2. 引入

```javascript
import { CommonTable } from "@/components/ElementPlusTable/index.ts";
```

#### 3. 属性

| 属性名 | 类型   | 默认值 | 说明             |
| -------- | ------- | ------ | ---------------- |
| options | Object | ------ | 列表配置项 |
| columns | Object[] | ------ | 表格栏配置项数组 |

#### 4. defineExpose
| 属性名 | 类型   | 默认值 | 说明             |
| -------- | ------- | ------ | ---------------- |
| tableRef | Object | ------ | eltable实例 |
| searchRef | Object[] | ------ | 搜索表单实例 |

#### 5. searchRef
| 属性名 | 类型   | 默认值 | 说明             |
| -------- | ------- | ------ | ---------------- |
| searchForm | Object | ------ | 表单值 |
| setColumn | (dataIndex,key,value):void | ------ | 设置表单项属性 |

#### 6. 具名插槽
- search-{dataIndex} 搜索表单项插槽
- form-{dataIndex} 新增编辑表单项插槽
- {dataIndex} 表格列插槽


#### options配置项

```ts
interface optionsType {
    pk: string; // 表格row-id 对应eltable的row-key, 默认为id
    pageSize?: number; //表格分页pagesize
    needPagination?: boolean; // 是否需要分页
    pageListKey?: string; // 分页数据key
    pageTotalKey?: string; // 分页数据总数key
    operationColumn?: boolean; // 是否需要操作列
    operationColumnWidth?: number; // 操作列宽度
    operationColumnText?: string; // 操作列文字
    operationColumnAlign?: string; // 操作列对齐方式
    operationColumnFixed?: boolean | string; // 操作列是否固定
    api: (e: any) => Promise<any>; // 列表请求方法
    beforeRequest?: (e: any) => void; // 请求前的回调
    afterRequest?: (e: any) => any[]; // 请求后的回调
    add?: { show: boolean; api: (e: any) => Promise<any> }; // 新增配置 show是否显示按钮 api新增方法
    edit?: { show: boolean; api: (e: any) => Promise<any> }; // 编辑配置 show是否显示按钮 api编辑方法
    delete?: { show: boolean; api: (e: any) => Promise<any> }; // 删除配置 show是否显示按钮 api删除方法
    export?: { show: boolean; api: (e: any) => Promise<any> }; // 导出配置 show是否显示按钮 api导出方法
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
    height?: string | number; // 表格高度
    btnBoxInline?: boolean; // 搜索表单是否同行显示（满了会自动换行），另一种方式是搜索表单栅格布局
    selectChange?: (...e: any) => void; // 表格选中项变化时的回调
    sortChange?: (e: any) => void; // 表格排序变化时的回调
    autoRequest?: boolean; // 是否自动请求
    dialogWidth: string | number; // 新增编辑弹窗宽度
    formIsCol: boolean; //新增编辑表单是否为列布局
    treeProps: {
        hasChildren?: string;
        children?: string;
        checkStrictly?: boolean;
    }; //树形结构配置
}
```

#### columns配置项

```ts
interface columnsType {
    type?: string; // 列类型 index: 索引列 selection: 选择列
    dataIndex: string; // 字段名
    title: string; // 列标题
    search?: boolean; // 是否需要搜索
    hide?: boolean; // 表格列表是否隐藏
    sortable?: string; // 是否需要排序
    formType?: inputFormType; // 表单控件类型, 'checkbox', 'radio', 'switch'这类控件在搜索表单里面展示为select
    extra?: string; // 新增和编辑时表单的额外提示
    align?: "left" | "center" | "right"; // 表格列对齐方式
    width?: number | string; // 表格列宽度
    fixed?: boolean | string; // 表格列是否固定
    dict?: {
        translation: boolean; // 是否对表格列字典值进行翻译为label
        tagColors: {
        [key: string]: string;
        }; // 列表tag的颜色，key为字典值，value为颜色
        data: { label: string; value: string }[]; // 字典数据，用于select checkbox radio
    };
    required?: boolean; //新增编辑是否必填
    bind?: any; // 表单控件绑定antd属性
    defaultValue?: any; // 新增编辑时的默认值
    searchDefaultValue?: any; // 搜索时的默认值
    placeholder?: string; // 表单控件占位符
    allowClear?: boolean; // 表单控件是否可以清除
    addDisabled?: boolean; // 新增编辑时是否禁用
    editDisabled?: boolean; // 新增编辑时是否禁用
    addReadonly?: boolean; // 新增编辑时是否禁用
    editReadonly?: boolean; // 新增编辑时是否禁用
    addDisplay?: boolean; // 表单新增是否显示
    editDisplay?: boolean; // 表单编辑是否显示
    onChange?: (e: any) => void; // 新增编辑时的值发生变化时的回调
    upload: uploadType; // 上传配置
    colspan: number; // 表单项占几列
    tree?: {
        data: any[]; //树形数组
        prop: { children: string; label: string }; //树组件的取值key，默认 children和name
        pk: string; //v-model的取值ky, 默认id
    };
}
```


### 通用表单 commonForm

#### 1. 介绍

通用表单组件，用于展示表单数据和提交表单。

#### 2. 引入

```javascript
import { CommonForm } from "@/components/ElementPlusTable/index.ts";
```

#### 3. 属性

| 属性名 | 类型   | 默认值 | 说明             |
| -------- | ------- | ------ | ---------------- |
| options | Object | ------ | 列表配置项 |
| columns | Object[] | ------ | 表格栏配置项数组，同antd table组件的 |
| model | Object | ------ | 表单数据 |

#### 4. 事件
| 事件名 | 参数 | 说明             |
| -------- | ------- | ---------------- |
| finish | e:any | 提交表单成功时触发 |
| reset | e:any | 重置表单时触发 |

#### 5. defineExpose
| 属性名 | 类型   | 默认值 | 说明             |
| -------- | ------- | ------ | ---------------- |
| getFormData | ():void | ------ | 获取表单数据 |
| setColumn | (dataIndex,key,value):void | ------ | 设置表单项属性 |

#### 6. 具名插槽
- form-{dataIndex} 表单项插槽

#### options配置项

```ts
interface formOptionsType {
    submitText?: string; //提交按钮文字
    resetText?: string; // 重置按钮文字
    labelWidth?: string; // label宽度
    labelPosition?: "left" | "right" | "top"; // label位置
    startDatePlaceholder?: string; // 开始时间占位符
    endDatePlaceholder?: string; // 结束时间占位符
    inline?: boolean; // 表单是否行内显示
    isCol?: boolean; // 表单是否栅格显示，可配置columns的colspan来控制大小
}
```

#### columns属性
```ts
interface formColumnsType {
    dataIndex: string; // 字段名
    title: string; // 字符laebl名称
    formType?: inputFormType; // 表单控件类型
    extra?: string; //表单额外提示
    align?: "left" | "center" | "right"; // 表单label对齐方式
    rules?: any[]; //表单项验证规则
    bind?: any; // 表单控件的props
    dict?: {
        data: { label: string; value: string }[]; // 字典数据，用于select checkbox radio
    };
    required?: boolean; //表单项是否必填
    upload: uploadType; // 上传配置
    defaultValue?: any; // 表单默认值
    placeholder?: string; // 表单项组件占位符
    allowClear?: boolean; // 表单项组件是否可以清除
    hide?: boolean; // 表单项是否隐藏
    disabled?: boolean; // 表单项是否禁用
    readonly?: boolean; // 表单项是否只读
    onChange?: (e: any) => void; // 值发生变化时的回调
    colspan: number; // 表单项占几列
    tree?: {
        data: any[]; //树形数组
        prop: { children: string; label: string }; //树组件的取值key，默认 children和name
        pk: string; //v-model的取值ky, 默认id
    };
}
```

### inputFormType
```ts
type inputFormType = 
| "text"
| "textarea"
| "inputNumber"
| "password"
| "date"
| "select"
| "datePicker"
| "timePicker"
| "dateTimeRange"
| "dateRange"
| "upload"
| "switch"
| "checkbox"
| "editor"
| "radio"
| "numberRange"
| "treeSelect";
```

### uploadType
```ts
interface uploadType {
    api: (e: any) => Promise<any>; //上传方法
    name?: string; // 文件的name 默认为file
    multiple?: boolean; // 仅用于选择上传文件时
    accept?: string; // 上传文件类型
    maxCount?: number; // 限制上传数量
    maxSize?: number; // 单位为M
    uploadBtnText?: string; // 上传按钮文字
    modeValue?: string | string[]; // string 单文件上传，新的图片会覆盖旧的图片，string[]多文件上传，会显示列表，显示方式同type控制
    type?: "image" | "file"; // 上传文件类型
    isSigle?: boolean; // 是否单文件上传  比如头像
    limtWarn?: string; // 上传限制提示
    sizeWarn?: string; //文件大小限制提示
    typeWarn?: string; // 文件类型限制提示
}
```

### 查看所有配置的默认值
src/components/ElementPlusTable/state.ts

### 示例文件 
src/views/test.vue