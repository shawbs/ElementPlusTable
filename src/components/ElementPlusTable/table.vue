<template>
  <div class="custom-elementplus-table">
    <div class="custom-elementplus-list-search" v-if="options.showSearch">
      <SearchForm
        ref="searchRef"
        :options="options"
        :columns="props.columns"
        @search="searchHandle"
        @reset="reset"
      >
        <template
          v-for="slotname in searchSlots"
          #[slotname]="{ formSource, dataIndex }"
        >
          <slot
            :name="slotname"
            :form-source="formSource"
            :data-index="dataIndex"
          ></slot>
        </template>
      </SearchForm>
    </div>
    <div class="custom-elementplus-list-header" v-if="$slots['table-before']">
      <slot name="table-before" />
    </div>
    <div class="custom-elementplus-list-tool">
      <div>
        <el-space>
          <el-button
            v-if="options.add?.show"
            v-auth="options.add?.auth || []"
            type="success"
            @click="openHandle(0)"
          >
            <template #icon>
              <el-icon><Plus /></el-icon>
            </template>
            {{ options.addText }}
          </el-button>
          <el-popconfirm
            :title="options.deleteSelectTip"
            :confirm-button-text="options.okText"
            :cancel-button-text="options.cancelText"
            @confirm="deleteHandleAll()"
          >
            <template #reference>
              <el-button
                v-if="options.deleteAll?.show"
                v-auth="options.deleteAll?.auth || []"
                :icon="Delete"
                type="danger"
                :disabled="!ids.length"
              >
                {{ options.deleteText }}
              </el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm
            :title="options.exportTip"
            :ok-text="options.okText"
            :cancel-text="options.cancelText"
            @confirm="exportHandle()"
          >
            <template #reference>
              <el-button
                v-if="options.export?.show"
                v-auth="options.export?.auth || []"
                :icon="Download"
                type="primary"
                plain
                :disabled="!ids.length"
              >
                {{ options.exportText }}
              </el-button>
            </template>
          </el-popconfirm>

          <slot name="table-tool-left" />
        </el-space>
      </div>
      <div>
        <el-space>
          <slot name="table-tool-right" />
          <el-button @click="searchHandle" v-if="options.showTableTool">
            <template #icon>
              <el-icon><RefreshRight /></el-icon>
            </template>
          </el-button>
        </el-space>
      </div>
    </div>
    <!-- {{ tableColumns }} -->
    <!-- {{ options.scroll }} -->
    <el-table
      ref="tableRef"
      :row-key="options.pk"
      :data="dataSource"
      v-loading="loading"
      :height="options.height"
      :tree-props="options.treeProps"
      border
      stripe
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      default-expand-all
    >
      <template v-for="(column, idx) in tableColumns" :key="idx + 'tablerow'">
        <el-table-column
          v-if="column.type"
          :type="column.type"
          :label="column.title"
          :align="column.align || 'center'"
          width="55"
        ></el-table-column>
        <el-table-column
          v-else
          :label="column.title"
          :sortable="column.sortable"
          :align="column.align || 'center'"
          :prop="column.dataIndex"
          show-overflow-tooltip
          :fixed="column.fixed"
          :width="column.width"
        >
          <template #default="{ row: record }">
            <slot
              v-if="$slots[column.dataIndex]"
              :name="column.dataIndex"
              :column="column"
              :record="record"
            />
            <template v-else>
              <template v-if="column.formType === 'upload'">
                <el-button @click="openLink(record[column.dataIndex])">
                  <template #icon>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-button>
              </template>
              <template
                v-else-if="column.dict?.data && column.dict?.translation"
              >
                <el-tag
                  v-for="item in column.dict?.data.filter(
                    (item: any) =>
                      item[dictValueKey(column)] === record[column.dataIndex]
                  ) || []"
                  :key="item[dictValueKey(column)]"
                  :color="
                    column.dict?.tagColors
                      ? column.dict?.tagColors[item[dictValueKey(column)]]
                      : ''
                  "
                  :style="{
                    color:
                      column.dict?.tagColors &&
                      column.dict?.tagColors[item[dictValueKey(column)]]
                        ? '#fff'
                        : undefined,
                  }"
                  :bordered="false"
                >
                  {{ item[dictLabelKey(column)] }}
                </el-tag>
              </template>
              <template v-else>
                {{ record[column.dataIndex] }}
              </template>
            </template>
          </template>
        </el-table-column>
      </template>

      <el-table-column
        v-if="options.operationColumn"
        :align="options.operationColumnAlign"
        :label="options.operationColumnText"
        :fixed="options.operationColumnFixed"
        :width="options.operationColumnWidth"
      >
        <template #default="{ row }">
          <el-space class="operation" align="center">
            <slot
              v-if="$slots['operationBeforeExtend']"
              name="operationBeforeExtend"
              :record="row"
            />
            <el-button
              v-if="options.edit?.show"
              v-auth="options.edit?.auth || []"
              type="primary"
              text
              @click="openHandle(1, row)"
            >
              {{ options.editText }}
            </el-button>
            <el-popconfirm
              :title="options.deleteTip"
              :ok-text="options.okText"
              :cancel-text="options.cancelText"
              @confirm="deleteHandle(row)"
            >
              <template #reference>
                <el-button
                  v-if="options.delete?.show"
                  v-auth="options.delete?.auth || []"
                  type="danger"
                  text
                >
                  {{ options.deleteText }}
                </el-button>
              </template>
            </el-popconfirm>
            <slot
              v-if="$slots['operationAfterExtend']"
              name="operationAfterExtend"
              :record="row"
            />
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <slot name="table-after" />
    </div>
    <div
      class="custom-elementplus-table-pagination"
      v-if="options.needPagination"
    >
      <el-pagination
        background
        layout="total, prev, pager, next, jumper, sizes"
        :total="pagination.total"
        v-model:currentPage="pagination.current"
        v-model:pageSize="pagination.pageSize"
        @change="handleTableChange"
      />
    </div>

    <component
      :is="modelComponent"
      v-model="open"
      :title="openType === 1 ? options.editText : options.addText"
      :width="options.dialogWidth"
      :size="options.modelType == 'drawer' ? options.dialogWidth : undefined"
      append-to-body
      draggable
      @close="onClose"
    >
      <CommonForm
        v-if="open"
        ref="formRef"
        :columns="formColumns"
        :options="formOptions"
        :model="formData"
        @finish="submitHandle"
      >
        <template
          v-for="slotname in formSlots"
          #[slotname]="{ formSource, dataIndex }"
        >
          <slot
            :name="slotname"
            :form-source="formSource"
            :data-index="dataIndex"
          ></slot>
        </template>
      </CommonForm>
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, useSlots } from "vue";
import CommonForm from "./form.vue";
import type { columnsType, optionsType, pageResponseType } from "./js/type";
import {
  Delete,
  Plus,
  Search,
  Download,
  RefreshRight,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import SearchForm from "./components/search.vue";
import { defaultOptTable } from "./js/option";
import { ElDialog, ElDrawer } from "element-plus";
import LANG from "./lang";

interface propsType {
  columns: columnsType[];
  options: optionsType;
}

const props = withDefaults(defineProps<propsType>(), {
  columns: () => [],
});

const dictLabelKey = (column: columnsType) => {
  return column.dict?.prop?.label ?? "label";
};

const dictValueKey = (column: columnsType) => {
  return column.dict?.prop?.value ?? "value";
};

const defaultOptions = defaultOptTable;

const options = computed((): any => {
  return <optionsType>{
    ...defaultOptions,
    ...props.options,
  };
});

const modelComponent = computed(() => {
  return options.value.modelType === "dialog" ? ElDialog : ElDrawer;
});

const sorter = ref({});
const dataSource = ref<any[]>([]);
const loading = ref(true);

const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: options.value.pageSize,
});

const formRef = ref();

const open = ref(false);
const openType = ref(1);
const formData = reactive<any>({});
const formColumns = ref<any[]>([]);

const searchRef = ref<any>();

const tableColumnsSource = ref<columnsType[]>([...props.columns]);

const tableColumns = computed(() => {
  const arr = tableColumnsSource.value.filter((item) => !item.hide);
  return arr;
});

const getList = async (e?: any) => {
  if (!options.value.api) return;
  const data = searchRef.value?.searchForm || {};
  // debugger
  const params = {
    ...data,
    current: pagination.current,
    size: pagination.pageSize,
    ...sorter.value,
  };
  if (!options.value.needPagination) {
    delete params.page;
    delete params.pageSize;
  }

  options.value?.beforeRequest && (await options.value.beforeRequest(params));
  loading.value = true;
  const res = await options.value
    .api(params)
    .then((res: pageResponseType | any) => {
      if (!res) return;
      dataSource.value = options.value.needPagination
        ? res[options.value.pageListKey] || []
        : res;
      if (options.value.needPagination) {
        pagination.total = res[options.value.pageTotalKey] || 0;
      } else {
        pagination.total = 0;
      }
    })
    .finally(() => {
      loading.value = false;
    });
  options.value.afterRequest && (await options.value.afterRequest(res));
};
const handleTableChange = (currentPage: number, pageSize: number) => {
  pagination.current = currentPage;
  pagination.pageSize = pageSize;
  getList();
};

const handleSortChange = (column: any, prop: string, order: any) => {
  sorter.value = { orderType: order, orderName: prop };
  searchHandle();
  options.value.sortChange && options.value.sortChange(column, prop, order);
};

const handleSelectionChange = (selectedRows: any) => {
  ids.value = selectedRows.map((item: any) => item[options.value.pk || "id"]);
  options.value.selectChange && options.value.selectChange(selectedRows);
};

const openLink = (url: string, target: string = "_blank") => {
  window.open(url, target);
};

const searchHandle = () => {
  pagination.current = 1;
  getList();
};

const reset = () => {
  pagination.current = 1;
  pagination.total = 0;
  getList();
};

const ids = ref([]);
const deleteHandle = (record?: any) => {
  let _ids = record ? [record[options.value.pk || "id"]] : ids.value;
  if (!_ids.length) {
    ElMessage.error(LANG.tip.selectTip);
    return;
  }
  options.value.delete?.api(_ids).then(() => {
    searchHandle();
  });
};

const deleteHandleAll = (record?: any) => {
  let _ids = record ? [record.id] : ids.value;
  if (!_ids.length) {
    ElMessage.error(LANG.tip.selectTip);
    return;
  }
  options.value.deleteAll?.api(_ids).then(() => {
    searchHandle();
  });
};

const exportHandle = () => {
  const data = searchRef.value?.searchForm || {};
  const params = {
    ...data,
  };
  options.value.export?.api(params);
};

const formOptions = computed(() => {
  return {
    submitText: options.value.submitText,
    resetText: options.value.resetText,
    labelWidth: options.value.labelWidth,
    isCol: options.value.formIsCol,
  };
});

const getAddColumns = () => {
  // debugger;
  return props.columns.map((item) => ({
    ...item,
    hide: !item.addDisplay,
    disabled: item.addDisabled,
    readonly: item.addReadonly,
  }));
};

const getEditColumns = () => {
  return props.columns.map((item) => ({
    ...item,
    hide: !item.editDisplay,
    disabled: item.editDisabled,
    readonly: item.editReadonly,
    required: item.editRequired ?? item.required,
  }));
};

/**
 *
 * @param type 0:新增 1:编辑
 * @param data
 */
const openHandle = (type: number, data?: any) => {
  // debugger;
  formColumns.value = [getAddColumns, getEditColumns][type]();
  if (type === 1) {
    Object.assign(formData, data);
  } else {
    Object.keys(formData).forEach((key) => {
      formData[key] = undefined;
    });
    // 如果新增的时候需求填写一些默认值，比如新增子部门时 填写上级部门
    Object.assign(formData, data);
  }
  openType.value = type;
  open.value = true;
  options.value.openHandle && options.value.openHandle(type);
};

const submitHandle = async (formData: any) => {
  if (!formRef.value) return;
  if (openType.value === 0) {
    // debugger;
    options.value.beforeAdd && (await options.value.beforeAdd(formData));
    formRef.value.submitLoading = true;
    options.value.add
      ?.api(formData)
      .then(() => {
        ElMessage.success(LANG.tip.success);
        setTimeout(onClose, 500);
        getList();
      })
      .finally(() => {
        formRef.value.submitLoading = false;
      });
  }
  if (openType.value === 1) {
    options.value.beforeAdd && (await options.value.beforeEdit(formData));
    formRef.value.submitLoading = true;
    options.value.edit
      ?.api({ ...formData })
      .then(() => {
        ElMessage.success(LANG.tip.success);
        setTimeout(onClose, 500);
        getList();
      })
      .finally(() => {
        formRef.value.submitLoading = false;
      });
  }
};
const onClose = () => {
  open.value = false;
};

const tableRef = ref(null);
const slots = useSlots();
const searchSlots = computed<string[]>(() => {
  return Object.keys(slots).filter((item) => item.startsWith("search-"));
});
const formSlots = computed<string[]>(() => {
  return Object.keys(slots).filter((item) => item.startsWith("form-"));
});

// 修改列表项
const setColumn = (dataIndex: string, key: "hide", value: true) => {
  tableColumnsSource.value.forEach((item) => {
    if (item.dataIndex === dataIndex) {
      item[key] = value;
    }
  });
};

onMounted(() => {
  if (options.value.autoRequest) {
    searchHandle();
  }
});

defineExpose({
  searchRef,
  tableRef,
  setColumn,
  search: searchHandle,
  openHandle,
});
</script>

<style lang="scss">
.custom-elementplus-table {
  .custom-elementplus-list-search {
    margin-bottom: 10px;
  }
  .custom-elementplus-list-header {
    margin-bottom: 10px;
  }
  .custom-elementplus-list-tool {
    margin-bottom: 10px;
  }
  .custom-elementplus-list-tool {
    display: flex;
    justify-content: space-between;
  }
  .custom-elementplus-table-pagination {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
