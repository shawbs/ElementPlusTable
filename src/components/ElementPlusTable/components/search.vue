<template>
  <!-- {{ options }} -->
  <el-form
    ref="searchRef"
    :model="searchForm"
    :inline="options.btnBoxInline"
    :label-width="options.searchLabelWidth"
    class="custom-elementplus-search"
    @submit.native.prevent="search"
  >
    <div class="search-from-container" v-if="!options.btnBoxInline">
      <el-row :gutter="24">
        <el-col
          v-for="item in searchDataArr"
          :key="item.dataIndex"
          :md="Math.floor(24 / options.searchColNumber)"
          :sm="8"
          :xs="24"
        >
          <formItem
            :options="options"
            :item="item"
            :data="searchForm"
            @change="changeHandle"
          >
            <template
              #[`search-${item.dataIndex}`]
              v-if="$slots[`search-${item.dataIndex}`]"
            >
              <slot
                :name="`search-${item.dataIndex}`"
                :form-source="searchForm"
                :data-index="item.dataIndex"
              />
            </template>
          </formItem>
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
        @change="changeHandle"
      >
        <template
          #[`search-${item.dataIndex}`]
          v-if="$slots[`search-${item.dataIndex}`]"
        >
          <slot
            :name="`search-${item.dataIndex}`"
            :form-source="searchForm"
            :data-index="item.dataIndex"
          />
        </template>
      </formItem>
      <el-form-item>
        <el-button type="primary" :icon="Search" native-type="submit">
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
import { ref, reactive, watch, onMounted, useSlots, computed } from "vue";
import { Search, Refresh } from "@element-plus/icons-vue";
import formItem from "./searchFormItem.vue";
import { columnsType, formColumnsType } from "../js/type";
import { defaultOptForm } from "../js/option";

const props = defineProps<{
  options: formOptionsType;
  columns: formColumnsType;
}>();

const defaultOptions = defaultOptForm;

const options = computed((): formOptionsType => {
  return <formOptionsType>{
    ...defaultOptions,
    ...props.options,
  };
});

const emits = defineEmits(["search", "reset"]);
const searchForm = reactive<any>({});
const columnToSearchData = (columns: columnsType[]): columnsType[] => {
  return props.columns
    .filter((item) => item.search)
    .map((item) => {
      const isInput = [
        "text",
        "inputNumber",
        "textarea",
        "password",
        "email",
      ].includes(item.formType || "text");
      let defaultValue =
        item.searchDefaultValue?.value ?? item.searchDefaultValue;
      if (item.formType === "numberRange" && !defaultValue) {
        defaultValue = [];
      }
      searchForm[item.dataIndex] = defaultValue;
      return {
        ...item,
        placeholder: item.placeholder || item.title,
      };
    });
};

const searchDataArrSource = ref(columnToSearchData(props.columns as any));
// const searchDataArrSource = ref<formColumnsType[]>(
//   columnToSearchData(props.columns)
// );

const searchDataArr = computed((): columnsType[] => {
  return searchDataArrSource.value.filter((item) => !item.searchHide);
});

// 修改表单项
const setColumn = (dataIndex: string, key: "searchHide", value: true) => {
  searchDataArrSource.value.forEach((item) => {
    if (item.dataIndex === dataIndex) {
      item[key] = value;
    }
  });
};

const changeHandle = (dataIndex: string, newValue: any) => {
  // console.log(dataIndex, newValue);
  searchForm[dataIndex] = newValue;
  const column = searchDataArr.value.find(
    (item) => item.dataIndex == dataIndex
  );
  column?.onSearchChange && column?.onSearchChange(newValue, searchForm);
};

const reset = () => {
  searchDataArr.value.forEach((item: any) => {
    searchForm[item.dataIndex] = undefined;
  });
  emits("reset");
};

const search = () => {
  console.log(searchForm);
  emits("search", searchForm);
};

defineExpose({
  searchForm,
  setColumn,
});
</script>

<style lang="scss">
.custom-elementplus-list-search {
  .el-form--inline .el-form-item {
    margin-right: 15px;
    .el-input {
      width: 180px;
    }
  }
  .text-center {
    text-align: center;
  }
}
</style>
