<template>
  <el-form
    ref="searchRef"
    :model="searchForm"
    :inline="options.btnBoxInline"
    :label-width="options.searchLabelWidth"
  >
    <div class="search-from-container" v-if="!options.btnBoxInline">
      <el-row :gutter="24" >
        <el-col
          v-for="item in searchDataArr"
          :key="item.dataIndex"
          :span="Math.floor(24 / options.searchColNumber)"
        >
          <formItem :options="options" :item="item" :data="searchForm" />
        </el-col>
        <el-col
          :span="
            options.btnBoxInline ? Math.floor(24 / options.searchColNumber) : 24
          "
        >
          <div :class="options.btnBoxInline ? '' : 'text-center'">
            <el-space>
              <el-button type="primary" @click="search" :icon="Search">
                {{ options.searchText }}
              </el-button>
              <el-button type="default" @click="reset" :icon="Refresh">
                {{ options.resetText }}
              </el-button>
            </el-space>
          </div>
        </el-col>
      </el-row>

      
    </div>
    <div v-else>
      <formItem
        v-for="item in searchDataArr"
        :key="item.dataIndex"
        :options="options"
        :item="item"
        :data="searchForm"
      />
      <el-form-item>
        <el-button type="primary" @click="search" :icon="Search">
          {{ options.searchText }}
        </el-button>
        <el-button type="default" @click="reset" :icon="Refresh">
          {{ options.resetText }}
        </el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive,  watch } from "vue";
import { Search, Refresh } from "@element-plus/icons-vue";
import formItem from "./searchFormItem.vue";

const { options, columns } = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
  columns: {
    type: Array,
    default: () => [],
  },
});

const searchForm = reactive<any>({});
const emits = defineEmits(["search", "reset"]);

// 把columns转成searchData
const columnToSearchData = (columns: columnsType[]): columnsType[] => {
  return columns
    .filter((item) => item.search)
    .map((item) => {
      const isInput = [
        "text",
        "inputNumber",
        "textarea",
        "password",
        "email",
      ].includes(item.formType || "text");
      searchForm[item.dataIndex] = item.searchDefaultValue || undefined;
      return {
        ...item,
        placeholder: isInput
          ? options.placeholderPrefixInput
          : options.placeholderPrefixSelect,
      };
    });
};

const searchDataArr = ref(columnToSearchData(columns));

const reset = () => {
  searchDataArr.value.forEach((item: any) => {
    searchForm[item.dataIndex] = undefined;
  });
  emits("reset");
};

const search = () => {
  emits("search", searchForm);
};

defineExpose({
  searchForm,
});
</script>

<style lang="less">
.search-from-container {
  margin: 0 15px;
  .text-center {
    text-align: center;
  }
}
</style>
