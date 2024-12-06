<template>
  <div class="custom-elementplus-form">
    <!-- {{ formData }} -->
    <el-form
      @submit.native.prevent
      ref="formRef"
      :model="formData"
      :label-position="options.labelPosition"
      :label-width="options.labelWidth"
      :inline="options.inline"
    >
      <div><slot name="formBefore" /></div>
      <el-row :gutter="20" v-if="options.isCol">
        <el-col
          :span="item?.colspan || 12"
          v-for="item in searchDataArr"
          :key="item.dataIndex"
        >
          <formItem
            :options="options"
            :item="item"
            :data="formData"
            @change="changeHandle"
          >
            <template
              v-if="$slots[`form-${item.dataIndex}`]"
              #[`form-${item.dataIndex}`]
            >
              <slot
                :name="`form-${item.dataIndex}`"
                :form-source="formData"
                :data-index="item.dataIndex"
              ></slot>
            </template>
          </formItem>
        </el-col>
      </el-row>
      <template v-else v-for="item in searchDataArr" :key="item.dataIndex">
        <formItem
          :options="options"
          :item="item"
          :data="formData"
          @change="changeHandle"
        >
          <template
            v-if="$slots[`form-${item.dataIndex}`]"
            #[`form-${item.dataIndex}`]
          >
            <slot
              :name="`form-${item.dataIndex}`"
              :form-source="formData"
              :data-index="item.dataIndex"
            ></slot>
          </template>
        </formItem>
      </template>

      <div><slot name="formAfter" /></div>

      <div class="form-btns" v-if="options.showFooter">
        <el-space>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="submitForm()"
            v-if="options.showSubmitBtn"
            v-auth="options.submit?.auth || []"
          >
            {{ options.submitText }}
          </el-button>
          <el-button type="default" @click="reset" v-if="options.showResetBtn">
            {{ options.resetText }}
          </el-button>
        </el-space>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, useSlots } from "vue";
import type { formOptionsType, formColumnsType } from "./js/type";
import formItem from "./components/formItem.vue";
import { defaultOptForm, defaultColumnForm } from "./js/option";

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

const options = computed((): formOptionsType => {
  return <formOptionsType>{
    ...defaultOptForm,
    ...props.options,
  };
});

// 初始化表单数据
const getDefaultValue = (columns: formColumnsType[]): Record<string, any> => {
  const data: Record<string, any> = {};
  columns.forEach((item) => {
    // debugger;
    let defaultValue =
      props.model[item.dataIndex] ??
      item.defaultValue?.value ??
      item.defaultValue;
    if (item.formType === "numberRange" && !defaultValue) {
      defaultValue = [];
    }
    data[item.dataIndex] = defaultValue;
  });
  return { ...props.model, ...data };
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
        ...defaultColumnForm,
        placeholder: item.placeholder || item.title,
        ...item,
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

const submitForm = () => {
  if (!formRef.value) return;
  const params = { ...props.model, ...formData };
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      emits("finish", params);
    } else {
      console.log("error submit!");
    }
  });
};

// 修改表单项
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
  formData[dataIndex] = newValue;
  const column = searchDataArr.value.find(
    (item) => item.dataIndex == dataIndex
  );
  column?.onChange && column?.onChange(newValue, formData);
};

defineExpose({
  getFormData,
  setColumn,
  submit: submitForm,
});
</script>

<style lang="scss">
.custom-elementplus-form {
  .form-btns {
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>
