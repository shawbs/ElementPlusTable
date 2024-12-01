<template>
  <div class="p-2">
    <h1>通用列表</h1>
    <common-table :columns="columns" :options="options">
      <template #search-username="{ formSource, dataIndex }">
        <el-input
          v-model:value="formSource[dataIndex]"
          placeholder="item.placeholder"
        ></el-input>
      </template>
      <template #username="{ record }">nam1e{{ record.username }}</template>
    </common-table>
    <h1>通用表单</h1>
    <common-form
      ref="formRef"
      :columns="formColumns"
      :model="formData"
      @finish="submit"
    >
      <template #name="{ formSource, dataIndex }">
        <el-input
          v-model:value="formSource[dataIndex]"
          placeholder="item.placeholder123"
        ></el-input>
      </template>
    </common-form>

    <el-button @click="handleFormItem('email', 'hide')">
      隐藏email表单项
    </el-button>
    <el-button @click="handleFormItem('email', 'disabled')">
      禁用email表单项
    </el-button>
    <el-button @click="handleFormItem('email', 'readonly')">
      只读email表单项
    </el-button>
  </div>
</template>

<script setup lang="ts">
import userAPI from "@/api/user";
import { reactive, ref } from "vue";
import { CommonTable, CommonForm } from "@/components/CommonTable/index.ts";

const statusData = ref<any[]>([]);

setTimeout(() => {
  statusData.value = [
    { label: "禁用", value: 1 },
    { label: "正常", value: 2 },
    { label: "异常", value: 0 },
  ];
}, 3000);

const options = {
  id: "member",
  pk: "id",
  operationColumn: true,
  operationColumnWidth: 180,
  api: userAPI.listPage,
  add: {
    show: true,
    api: userAPI.add,
  },
  edit: {
    show: true,
    api: userAPI.edit,
  },
  delete: {
    show: true,
    api: userAPI.delete,
  },
  searchLabelWidth: "auto",
  searchLabelHide: true,
  needPagination: false,
  btnBoxInline: false,
  selectChange: (e:any) => {
    console.log(e);
  },
  formIsCol: true,
  dialogWidth: 800
};
const columns = reactive([
  {
    type: "index",
    dataIndex: "index",
    title: "NO",
  },
  {
    type: "selection",
    dataIndex: "index",
    title: "",
  },
  {
    title: "头像",
    formType: "upload",
    dataIndex: "avatar",
    align: "center",
    addDisplay: true,
    editDisplay: true,
    // fixed: true,
    width: 100,
    upload: {
      api: userAPI.uploadImage,
    },
    colspan: 24
  },
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
    defaultValue: "张三",
    allowClear: true,
    search: true,
    addDisplay: true,
    onChange: (a: any) => {
      console.log(a);
    },
  },
  {
    title: "用户名2",
    dataIndex: "username",
    formType: "input",
    align: "center",
    addDisplay: true,
    editDisplay: true,
  },
  {
    title: "部门",
    dataIndex: "deptId",
    formType: "input",
    align: "center",
    addDisplay: true,
    editDisplay: true,
  },
  {
    title: "性别",
    dataIndex: "sex",
    formType: "radio",
    align: "center",
    search: true,
    allowClear: true,
    addDisplay: true,
    editDisplay: true,
    defaultValue: 1,
    dict: {
      transition: true,
      data: [
        { label: "男", value: 1 },
        { label: "女", value: 2 },
      ],
    },
  },
  {
    title: "手机号",
    dataIndex: "phone",
    formType: "inputNumber",
    search: true,
    hide: false,
    addDisplay: true,
    editDisplay: true,
    required: true,
    sortable: true,
    extra: "extraextra extra",
    align: "center",
  },
  {
    title: "邮箱",
    dataIndex: "email",
    editDisplay: true,
    value: "123@123.com",
    rules: [
      { required: true, message: "请输入邮箱" },
      {
        validator: (rule: any, value: any, callback: any) => {
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
          if (!emailRegex.test(value)) {
            callback(new Error("格式错误!"));
          } else {
            callback();
          }
        },
        trigger: "blur",
      },
    ],
  },
  {
    title: "状态",
    dataIndex: "status",
    formType: "switch",
    align: "center",
    search: true,
    addDisplay: true,
    editDisplay: true,
    searchDefaultValue: 1,
    dict: {
      transition: true,
      data: statusData,
      tagColors: {
        1: "success",
        0: "error",
      },
    },
  },

  {
    title: "创建时间",
    dataIndex: "craeteTime",
    formType: "datePicker",
    width: 100,
    search: true,
    hide: true,
    bind: {
      showTime: true,
    },
  },
]);

const formRef = ref();
const formData = reactive({
  avatar:
    "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
  file: [
    "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
  ],
  name: "张三",
  phone: "123456789",
  email: "123@123.com",
  status: true,
  sex: 1,
  status2: [1],
  content: "<p>123</p>",
});

const formColumns = reactive([
  {
    title: "头像",
    formType: "upload",
    dataIndex: "avatar",
    align: "center",
    add: true,
    edit: true,
    width: 200,
    upload: {
      api: userAPI.uploadImage,
    },
  },
  {
    title: "图片",
    formType: "upload",
    dataIndex: "img",
    align: "center",
    width: 100,
    upload: {
      api: userAPI.uploadImage,
      type: "image",
      isSigle: false,
      maxCount: 3,
    },
    onChange: (a: any) => {
      console.log(a);
    },
  },
  {
    title: "文档",
    formType: "upload",
    dataIndex: "file",
    align: "center",
    width: 100,
    upload: {
      api: userAPI.uploadImage,
      type: "file",
      accept: ".doc,.docx,.pdf,.xls,.xlsx",
      isSigle: false,
      maxCount: 2,
    },
  },
  {
    title: "用户名",
    dataIndex: "nickname",
    align: "center",
    defaultValue: "张三",
    fixed: "left",
    search: true,
  },
  {
    title: "手机号",
    dataIndex: "phone",
    formType: "inputNumber",
    search: true,
    hide: false,
    required: true,
    sortable: true,
    width: "200px",
    extra: "extraextra extra",
  },
  {
    title: "邮箱",
    dataIndex: "email",
    edit: true,
    value: "123@123.com",
  },
  {
    title: "状态",
    dataIndex: "status",
    formType: "switch",
    width: 100,
    search: true,
    onChange: (a: any) => {
      console.log(a);
    },
  },
  {
    title: "checkbox",
    dataIndex: "status2",
    formType: "checkbox",
    width: 100,
    defaultValue: [1, 0],
    dict: {
      data: [
        { label: "男", value: 1 },
        { label: "女", value: 2 },
      ],
    },
  },
  {
    title: "性别",
    dataIndex: "sex",
    formType: "radio",
    width: 100,
    search: true,
    defaultValue: 1,
    dict: {
      data: [
        { label: "男", value: 1 },
        { label: "女", value: 0 },
      ],
    },
  },
  {
    title: "性别2",
    dataIndex: "sex2",
    formType: "select",
    width: 100,
    search: true,
    defaultValue: 1,
    dict: {
      data: [
        { label: "男", value: 1 },
        { label: "女", value: 0 },
      ],
    },
  },
  {
    title: "时间",
    dataIndex: "craeteTime",
    formType: "datePicker",
    width: 100,
    search: true,
    hide: false,
    bind: {
      showTime: true,
    },
  },
  {
    title: "时间范围",
    dataIndex: "craeteTime2",
    formType: "dateTimeRange",
    width: 100,
    search: true,
    hide: false,
    bind: {
      showTime: true,
    },
  },
  {
    title: "内容",
    formType: "editor",
    dataIndex: "content",
    align: "center",
    onChange: (a: any) => {
      console.log(a);
    },
  },
  {
    title: "内容2",
    formType: "editor",
    dataIndex: "content2",
    align: "center",
  },
]);

const submit = (e: any) => {
  console.log(e);

  // formRef.value.submitLoading = true;

  // setTimeout(() => {
  //     formRef.value.submitLoading = false;
  // },3000);
};

const handleFormItem = (
  dataIndex: string,
  key: "hide" | "disabled" | "readonly"
) => {
  formRef.value.setColumn(dataIndex, key, true);
};
</script>

<style scoped>
h1 {
  font-size: 24px;
  font-weight: 800;
}
</style>
