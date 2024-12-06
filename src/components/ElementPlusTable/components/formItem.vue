<template>
  <el-form-item
    :prop="item.dataIndex"
    :label="item.title"
    :rules="rules"
    :required="item.required"
  >
    <template v-if="$slots[`form-${item.dataIndex}`]">
      <slot :name="`form-${item.dataIndex}`"></slot>
    </template>
    <template v-else>
      <el-input-number
        v-if="item.formType == 'inputNumber'"
        v-model="formData[item.dataIndex]"
        :placeholder="item.placeholder"
        :disabled="item.disabled"
        :readonly="item.readonly"
        :style="{ width: item.width, flex: 'none' }"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      ></el-input-number>
      <el-select
        v-else-if="item.formType == 'select'"
        v-model="formData[item.dataIndex]"
        :placeholder="item.placeholder"
        :disabled="item.disabled"
        :readonly="item.readonly"
        :style="{ width: item.width, flex: 'none' }"
        :clearable="item.allowClear"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      >
        <el-option
          v-for="(ik, idx) in item.dict?.data || []"
          :key="item.dataIndex + idx"
          :value="ik[dictValueKey(item)]"
          :label="ik[dictLabelKey(item)]"
        ></el-option>
      </el-select>

      <el-tree-select
        v-else-if="item.formType == 'treeSelect'"
        v-model="formData[item.dataIndex]"
        :placeholder="item.placeholder"
        :data="item.tree?.data || []"
        :node-key="item.tree?.pk || 'id'"
        :props="
          item.tree?.prop || {
            children: 'children',
            label: 'name',
          }
        "
        filterable
        check-strictly
        :render-after-expand="false"
        :clearable="item.allowClear"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      />

      <el-checkbox-group
        v-else-if="item.formType == 'checkbox'"
        v-model="formData[item.dataIndex]"
        :disabled="item.disabled"
        :readonly="item.readonly"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      >
        <el-checkbox :value="ik.value" v-for="ik in item.dict?.data || []">
          {{ ik.label }}
        </el-checkbox>
      </el-checkbox-group>

      <el-radio-group
        v-else-if="item.formType == 'radio'"
        v-model="formData[item.dataIndex]"
        :disabled="item.disabled"
        @update:modelValue="changeHandle"
      >
        <el-radio :value="ik.value" v-for="ik in item.dict?.data || []">
          {{ ik.label }}
        </el-radio>
      </el-radio-group>

      <el-date-picker
        v-else-if="item.formType == 'datePicker'"
        v-model="formData[item.dataIndex]"
        type="date"
        :value-format="item.valueFormat || `YYYY-MM-DD`"
        :placeholder="item.placeholder"
        :style="{ width: item.width, flex: 'none' }"
        :clearable="item.allowClear"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      ></el-date-picker>

      <el-time-picker
        v-else-if="item.formType == 'timePicker'"
        v-model="formData[item.dataIndex]"
        :value-format="item.valueFormat || 'HH:mm:ss'"
        :placeholder="item.placeholder"
        :style="{ width: item.width, flex: 'none' }"
        :clearable="item.allowClear"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      ></el-time-picker>

      <el-date-picker
        v-else-if="item.formType == 'dateTimeRange'"
        v-model="formData[item.dataIndex]"
        type="datetimerange"
        :value-format="item.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
        :start-placeholder="options.startDatePlaceholder"
        :end-placeholder="options.endDatePlaceholder"
        :style="{ width: item.width, flex: 'none' }"
        :clearable="item.allowClear"
        :default-time="defaultTime"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      ></el-date-picker>

      <el-date-picker
        v-else-if="item.formType == 'dateRange'"
        v-model="formData[item.dataIndex]"
        type="daterange"
        :value-format="item.valueFormat || 'YYYY-MM-DD'"
        :start-placeholder="options.startDatePlaceholder"
        :end-placeholder="options.endDatePlaceholder"
        :style="{ width: item.width, flex: 'none' }"
        :clearable="item.allowClear"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      ></el-date-picker>

      <el-switch
        v-else-if="item.formType == 'switch'"
        v-model="formData[item.dataIndex]"
        @update:modelValue="changeHandle"
      />

      <common-upload
        v-else-if="item.formType == 'upload'"
        v-bind="item.upload"
        v-model="formData[item.dataIndex]"
        @update:modelValue="changeHandle"
      ></common-upload>

      <common-editor
        v-else-if="item.formType == 'editor'"
        v-model="formData[item.dataIndex]"
        @update:modelValue="changeHandle"
      />

      <number-range
        v-else-if="item.formType == 'numberRange'"
        v-bind="item.bind"
        v-model="formData[item.dataIndex]"
        @update:modelValue="changeHandle"
      />

      <el-input
        v-else-if="item.formType == 'textarea'"
        v-model="formData[item.dataIndex]"
        type="textarea"
        :disabled="item.disabled"
        :readonly="item.readonly"
        :placeholder="item.placeholder"
        :style="{ width: item.width, flex: 'none' }"
        :clearable="item.allowClear"
        :rows="3"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      ></el-input>

      <el-cascader
        v-else-if="item.formType == 'cascader'"
        v-model="formData[item.dataIndex]"
        :disabled="item.disabled"
        :placeholder="item.placeholder"
        :clearable="item.allowClear"
        :style="{ width: item.width, flex: 'none' }"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      />

      <el-slider
        v-else-if="item.formType == 'slider'"
        v-model="formData[item.dataIndex]"
        :disabled="item.disabled"
        :style="{ width: item.width, flex: 'none' }"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      />

      <el-input
        v-else
        v-model="formData[item.dataIndex]"
        :disabled="item.disabled"
        :readonly="item.readonly"
        :placeholder="item.placeholder"
        :style="{ width: item.width, flex: 'none' }"
        :clearable="item.allowClear"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      ></el-input>

      <div v-if="item.extra" style="width: 100%">{{ item.extra }}</div>
    </template>
  </el-form-item>
</template>

<script setup lang="ts">
import CommonUpload from "./upload.vue";
import CommonEditor from "./editor.vue";
import numberRange from "./numberRange.vue";
import { reactive, computed, watch, useSlots, onMounted } from "vue";
import LANG from "../lang";

const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
  item: {
    type: Object,
    default: () => ({}),
  },
  data: {
    type: Object,
    default: () => ({}),
  },
});
const { item, data, options } = props;

const emits = defineEmits(["change"]);

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];

const formData = reactive({ ...data });
const rules = item.rules || [];
if (item.required) {
  rules.unshift({
    required: true,
    message: item.title + LANG.tip.requiredSuffix,
    trigger: "blur",
  });
}

const dictLabelKey = (column: columnsType) => {
  return column.dict?.prop?.label ?? "label";
};

const dictValueKey = (column: columnsType) => {
  return column.dict?.prop?.value ?? "value";
};

watch(
  () => props.data,
  (e) => {
    for (let key in formData) {
      formData[key] = e[key];
    }
  },
  { deep: true }
);

const changeHandle = (newVal) => {
  // console.log(item.dataIndex, newVal);
  emits("change", item.dataIndex, newVal);
};

// watch(
//   formData,
//   (newVal, oldVal) => {
//     console.log(newVal[[item.dataIndex]], oldVal[item.dataIndex]);
//     emits("change", item.dataIndex, newVal[item.dataIndex]);
//   },
//   { deep: true }
// );
</script>
