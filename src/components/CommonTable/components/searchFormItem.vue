<template>
  <!-- {{ options }} -->
  <el-form-item :name="item.dataIndex" :label="options.btnBoxInline && options.searchLabelHide ? '' : item.title">
    <template v-if="$slots[`search-${item.dataIndex}`]">
      <slot
        :name="`search-${item.dataIndex}`"
        :form-source="formData"
        :data-index="item.dataIndex"
      ></slot>
    </template>
    <template v-else>
      <el-input-number
        v-if="item.formType == 'inputNumber'"
        v-model="formData[item.dataIndex]"
        :placeholder="item.placeholder"
        v-bind="item.bind"
        :style="{'min-width': '150px'}"
      ></el-input-number>
      <el-select
        v-else-if="
          ['select', 'checkbox', 'radio', 'switch'].includes(item.formType)
        "
        v-model="formData[item.dataIndex]"
        :placeholder="item.placeholder"
        :clearable="item.allowClear"
        v-bind="item.bind"
        :style="{'min-width': '150px'}"
      >
        <el-option
          v-for="(ik, idx) in item.dict?.data || []"
          :key="item.dataIndex + idx"
          :value="ik.value"
          :label="ik.label"
        >
        </el-option>
      </el-select>

      <el-date-picker
        v-else-if="item.formType == 'datePicker'"
        v-model="formData[item.dataIndex]"
        type="date"
        :value-format="item.valueFormat || 'YYYY-MM-DD'"
        v-bind="item.bind"
        :clearable="item.allowClear"
        :placeholder="item.placeholder"
      ></el-date-picker>

      <el-time-picker
        v-else-if="item.formType == 'timePicker'"
        v-model="formData[item.dataIndex]"
        :value-format="item.valueFormat || 'HH:mm:ss'"
        v-bind="item.bind"
        :clearable="item.allowClear"
        :placeholder="item.placeholder"
      ></el-time-picker>

      <el-date-picker
        v-else-if="item.formType == 'dateTimeRange'"
        v-model="formData[item.dataIndex]"
        type="datetimerange"
        :value-format="item.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
        v-bind="item.bind"
        :clearable="item.allowClear"
        :start-placeholder="options.startDatePlaceholder"
        :end-placeholder="options.endDatePlaceholder"
      ></el-date-picker>

      <el-date-picker
        v-else-if="item.formType == 'dateRange'"
        v-model="formData[item.dataIndex]"
        type="daterange"
        :value-format="item.valueFormat || 'YYYY-MM-DD'"
        v-bind="item.bind"
        :clearable="item.allowClear"
        :start-placeholder="options.startDatePlaceholder"
        :end-placeholder="options.endDatePlaceholder"
      ></el-date-picker>

      <el-input
        v-else
        :clearable="item.allowClear"
        v-model="formData[item.dataIndex]"
        :placeholder="item.placeholder"
        v-bind="item.bind"
      ></el-input>
    </template>
  </el-form-item>
</template>

<script setup>
import { reactive } from "vue";
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

const formData = reactive({ ...data });
</script>
<style lang="less">
    .el-form--inline .el-form-item{
        margin-right: 15px;
    }
</style>
