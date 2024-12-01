<template>
  <div class="ppa-form">
    <!-- {{ options }} -->
    <el-form
      ref="formRef"
      :model="formData"
      :label-position="options.labelPosition"
      :label-width="options.labelWidth"
      :inline="options.inline"
    >
      <el-row :gutter="20" v-if="options.isCol">
        <el-col :span="item?.colspan || 12" v-for="item in searchDataArr" :key="item.dataIndex">
          <formItem
            :options="options"
            :item="item"
            :data="formData"
            @change="changeHandle"
          />
        </el-col>
      </el-row>
      <template v-else v-for="item in searchDataArr" :key="item.dataIndex">
        <formItem
          :options="options"
          :item="item"
          :data="formData"
          @change="changeHandle"
        />
      </template>

      <div class="form-btns">
        <el-space>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="submitForm(formRef)"
          >
            {{ options.submitText }}
          </el-button>
          <el-button type="default" @click="reset">
            {{ options.resetText }}
          </el-button>
        </el-space>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { computed, reactive, ref } from "vue";
import type { formOptionsType, formColumnsType } from "./option";
import formItem from "./components/formItem.vue";
import { defaultOptForm } from "./state";

interface propsType {
  columns: formColumnsType[];
  options?: formOptionsType;
  model: Record<string, any>; //用于回显
}

const props = withDefaults(defineProps<propsType>(), {
  columns: () => [],
  model: Object.create({}),
  options: () => ({}),
});
const emits = defineEmits(["finish", "reset"]);

const defaultOptions = defaultOptForm;

const options = computed((): formOptionsType => {
  return <formOptionsType>{
    ...defaultOptions,
    ...props.options,
  };
});

// 初始化表单数据
const getDefaultValue = (columns: formColumnsType[]): Record<string, any> => {
  const data: Record<string, any> = {};
  columns.forEach((item) => {
    data[item.dataIndex] =
      props.model[item.dataIndex] || item.defaultValue || undefined;
  });
  return {...props.model, ...data};
};

const formData = reactive<any>(getDefaultValue(props.columns));

const formRef = ref();

// 把columns转成searchData
const columnToSearchData = (columns: formColumnsType[]): formColumnsType[] => {
  return columns
    .filter((item) => !item.hide)
    .map((item) => {
      const isInput = ["text", "inputNumber", "textarea", "password"].includes(
        item.formType || "text"
      );

      return {
        ...item,
        placeholder: isInput
          ? options.value.placeholderPrefixInput
          : options.value.placeholderPrefixSelect,
      };
    });
};

const searchDataArrSource = ref<formColumnsType[]>(
  columnToSearchData(props.columns)
);

const searchDataArr = computed((): formColumnsType[] => {
  return searchDataArrSource.value.filter((item) => !item.hide);
});

// 把column转成参数
const getFormData = () => {
  const params: Record<string, any> = {};
  searchDataArr.value.forEach((item) => {
    params[item.dataIndex] = formData[item.dataIndex];
  });
  return params;
};

const reset = () => {
  formRef.value.resetFields();
  searchDataArr.value.forEach((item) => {
    formData[item.dataIndex] = undefined;
  });
  emits("reset");
};

const submitLoading = ref(false);

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const params = { ...props.model, ...formData };
  // console.log(params)
  formEl.validate((valid) => {
    if (valid) {
      emits("finish", params);
    } else {
      console.log("error submit!");
    }
  });
};

// 修复表单项
const setColumn = (
  dataIndex: string,
  key: "hide" | "disabled" | "readonly",
  value: true
) => {
  searchDataArrSource.value.forEach((item) => {
    if (item.dataIndex === dataIndex) {
      item[key] = value;
    }
  });
};

const changeHandle = (dataIndex: string, newValue: any) => {
  // console.log(dataIndex, newValue)
  const column = searchDataArr.value.find(
    (item) => item.dataIndex == dataIndex
  );
  formData[dataIndex] = newValue;
  column?.onChange && column?.onChange(newValue);
};

defineExpose({
  getFormData,
  submitLoading,
  setColumn,
});
</script>

<style lang="less">
.ppa-form {
  .form-btns {
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>
