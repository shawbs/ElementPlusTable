<template>
  <!-- {{ item.formType }} -->
  <el-form-item
    :prop="item.dataIndex"
    :label="item.title"
    :rules="rules"
    :required="item.required"
  >
      <template v-if="$slots[`${item.dataIndex}`]">
        <slot
          :name="`${item.dataIndex}`"
          :form-source="formData"
          :datel-index="item.dataIndex"
        ></slot>
      </template>
      <template v-else>
        <el-input-number
          v-if="item.formType == 'inputNumber'"
          v-model="formData[item.dataIndex]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          :readonly="item.readonly"
          :style="{width: item.width, flex:'none'}"
          v-bind="item.bind"
          @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
        ></el-input-number>
        <el-select
          v-else-if="item.formType == 'select'"
          v-model="formData[item.dataIndex]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          :readonly="item.readonly"
          :style="{width: item.width, flex:'none'}"
          v-bind="item.bind"
          :clearable="item.allowClear"
          @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
        >
          <el-option
            v-for="(ik, idx) in item.dict?.data || []"
            :key="item.dataIndex + idx"
            :value="ik.value"
            :label="ik.label"
          >
          </el-option>
        </el-select>

        <el-checkbox-group
          v-else-if="item.formType == 'checkbox'"
          v-model="formData[item.dataIndex]"
          :disabled="item.disabled"
          :readonly="item.readonly"
          @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
          >
          <el-checkbox :value="ik.value" v-for="ik in item.dict?.data || []">{{ik.label}}</el-checkbox>
        </el-checkbox-group>

        <el-radio-group
          v-else-if="item.formType == 'radio'"
          v-model="formData[item.dataIndex]"
          :disabled="item.disabled"
          @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
        >
          <el-radio :value="ik.value" v-for="ik in item.dict?.data || []">{{ik.label}}</el-radio>
        </el-radio-group>

        <el-date-picker
          v-else-if="item.formType == 'datePicker'"
          v-model="formData[item.dataIndex]"
          type="date"
          :value-format="item.valueFormat || `YYYY-MM-DD`"
          v-bind="item.bind"
          :placeholder="item.placeholder"
          :style="{width: item.width, flex:'none'}"
          :clearable="item.allowClear"
          @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
        ></el-date-picker>

        <el-time-picker
          v-else-if="item.formType == 'timePicker'"
          v-model="formData[item.dataIndex]"
          :value-format="item.valueFormat || 'HH:mm:ss'"
          v-bind="item.bind"
          :placeholder="item.placeholder"
          :style="{width: item.width, flex:'none'}"
          :clearable="item.allowClear"
          @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
        ></el-time-picker>

        <el-date-picker
          v-else-if="item.formType == 'dateTimeRange'"
          v-model="formData[item.dataIndex]"
          type="datetimerange"
          :value-format="item.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
          v-bind="item.bind"
          :start-placeholder="options.startDatePlaceholder"
          :end-placeholder="options.endDatePlaceholder"
          :style="{width: item.width, flex:'none'}"
          :clearable="item.allowClear"
          @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
        ></el-date-picker>

        <el-date-picker
          v-else-if="item.formType == 'dateRange'"
          v-model="formData[item.dataIndex]"
          type="daterange"
          :value-format="item.valueFormat || 'YYYY-MM-DD' "
          v-bind="item.bind"
          :start-placeholder="options.startDatePlaceholder"
          :end-placeholder="options.endDatePlaceholder"
          :style="{width: item.width, flex:'none'}"
          :clearable="item.allowClear"
          @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
        ></el-date-picker>

        <el-switch
          v-else-if="item.formType == 'switch'"
          v-model="formData[item.dataIndex]"
          @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
        />

        <common-upload
          v-else-if="item.formType == 'upload'"
          v-bind="item.upload"
          v-model="formData[item.dataIndex]"
          @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
        ></common-upload>

        <common-editor
          v-else-if="item.formType == 'editor'"
          v-model="formData[item.dataIndex]"
          @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
        />

        <el-input
          v-else
          v-model="formData[item.dataIndex]"
          :disabled="item.disabled"
          :readonly="item.readonly"
          :placeholder="item.placeholder"
          v-bind="item.bind"
          :style="{width: item.width, flex:'none'}"
          :clearable="item.allowClear"
          @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
        ></el-input>

        <div v-if="item.extra" style="width: 100%;">{{ item.extra }}</div>
      </template>
  </el-form-item>
</template>

<script setup lang="ts">
import CommonUpload from './upload.vue'
import CommonEditor from './editor.vue'
import { reactive,computed } from 'vue'
const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  },
  item: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: () => ({})
  },
})
const { item, data, options } = props

const emits = defineEmits(['change'])

const formData = reactive({...data})
const rules = item.rules || []
if(item.required){
  rules.unshift({ required: true, message: item.title + "不能为空", trigger: 'blur' })
}

const changeHandle = (key:string, value:any) => {
  // console.log(formData,key,value)
  emits('change', key, value)
}
</script>
