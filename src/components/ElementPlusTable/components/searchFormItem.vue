<template>
  <!-- {{ options }} -->
  <el-form-item
    :name="item.dataIndex"
    :label="options.btnBoxInline && options.searchLabelHide ? '' : item.title"
  >
    <template v-if="$slots[`search-${item.dataIndex}`]">
      <slot :name="`search-${item.dataIndex}`"></slot>
    </template>
    <template v-else>
      <el-input-number
        v-if="item.formType == 'inputNumber'"
        v-model="formData[item.dataIndex]"
        :placeholder="item.placeholder"
        :style="{ 'min-width': '150px' }"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      ></el-input-number>
      <el-select
        v-else-if="
          ['select', 'checkbox', 'radio', 'switch'].includes(item.formType)
        "
        v-model="formData[item.dataIndex]"
        :placeholder="item.placeholder"
        :clearable="item.allowClear"
        :style="{ 'min-width': '150px' }"
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

      <el-date-picker
        v-else-if="item.formType == 'datePicker'"
        v-model="formData[item.dataIndex]"
        type="date"
        :value-format="item.valueFormat || 'YYYY-MM-DD'"
        :clearable="item.allowClear"
        :placeholder="item.placeholder"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      ></el-date-picker>

      <el-time-picker
        v-else-if="item.formType == 'timePicker'"
        v-model="formData[item.dataIndex]"
        :value-format="item.valueFormat || 'HH:mm:ss'"
        :clearable="item.allowClear"
        :placeholder="item.placeholder"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      ></el-time-picker>

      <el-date-picker
        v-else-if="item.formType == 'dateTimeRange'"
        v-model="formData[item.dataIndex]"
        type="datetimerange"
        :value-format="item.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
        :clearable="item.allowClear"
        :start-placeholder="options.startDatePlaceholder"
        :end-placeholder="options.endDatePlaceholder"
        :style="{ width: '350px' }"
        :shortcuts="rangeShortcuts"
        :default-time="defaultTime"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      ></el-date-picker>

      <el-date-picker
        v-else-if="item.formType == 'dateRange'"
        v-model="formData[item.dataIndex]"
        type="daterange"
        :value-format="item.valueFormat || 'YYYY-MM-DD'"
        :clearable="item.allowClear"
        :start-placeholder="options.startDatePlaceholder"
        :end-placeholder="options.endDatePlaceholder"
        :style="{ width: '300px' }"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      ></el-date-picker>

      <number-range
        v-else-if="item.formType == 'numberRange'"
        width="150px"
        v-model="formData[item.dataIndex]"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      />

      <el-input
        v-else
        :clearable="item.allowClear"
        v-model="formData[item.dataIndex]"
        :placeholder="item.placeholder"
        v-bind="item.bind"
        @update:modelValue="changeHandle"
      ></el-input>
    </template>
  </el-form-item>
</template>

<script setup lang="ts">
import numberRange from "./numberRange.vue";
import { onMounted, reactive, useSlots, watch } from "vue";
import { rangeShortcuts } from "../js/util";

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
//   (newVal) => {
//     emits("change", item.dataIndex, newVal[item.dataIndex]);
//   },
//   { deep: true }
// );
</script>
<style lang="scss">
.custom-elementplus-search {
  .el-form--inline .el-form-item {
    margin-right: 15px;
  }
}
</style>
