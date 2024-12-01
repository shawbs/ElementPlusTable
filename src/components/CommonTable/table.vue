<template>
  <div class="ppa-table">
    <div class="ppa-list-search">
      <SearchForm
        ref="searchRef"
        :options="options"
        :columns="props.columns"
        @search="searchHandle"
        @reset="reset"
      />
    </div>
    <div class="ppa-list-header">
      <slot name="table-before" />
    </div>
    <div class="ppa-list-tool">
      <div>
        <el-space>
          <el-button
            v-if="options.add?.show"
            type="primary"
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
            @confirm="deleteHandle()"
          >
            <template #reference>
              <el-button
                v-if="options.delete?.show"
                :icon="Delete"
                type="danger"
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
                :icon="Download"
                type="primary"
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
          <el-button @click="searchHandle">
            <template #icon>
              <el-icon><RefreshRight /></el-icon>
            </template>
          </el-button>
        </el-space>
      </div>
    </div>
    <!-- {{ headerColumns }} -->
    <!-- {{ options.scroll }} -->
    <el-table
      ref="tableRef"
      :row-key="options.pk"
      :data="dataSource"
      :loading="loading"
      :height="options.height"
      border
      stripe
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <template
        v-for="(column, idx) in headerColumns"
        :key="idx + column.dataIndex"
      >
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
        >
          <template #default="{ row: record }">
            <slot
              v-if="$slots[column.dataIndex]"
              :name="column.dataIndex"
              :column="column"
              :record="record"
            />
            <div v-else>
              <template v-if="column.formType === 'upload'">
                <el-button @click="openLink(record[column.dataIndex])">
                  <template #icon>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-button>
              </template>
              <template
                v-else-if="column.dict?.data && column.dict?.transition"
              >
                <el-tag
                  v-for="item in column.dict?.data.filter(
                    (item: any) => item.value === record[column.dataIndex]
                  ) || []"
                  :key="item.value"
                  :color="
                    column.dict?.tagColors
                      ? column.dict?.tagColors[item.value]
                      : ''
                  "
                  :bordered="false"
                >
                  {{ item.label }}
                </el-tag>
              </template>
              <template v-else>
                {{ record[column.dataIndex] }}
              </template>
            </div>
          </template>
        </el-table-column>
      </template>

      <el-table-column
        v-if="options.operationColumn"
        :align="options.operationColumnAlign"
        :label="options.operationColumnText"
        :fixed="options.operationColumnFixed"
        :min-width="options.operationColumnWidth"
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
              type="primary"
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
                <el-button v-if="options.delete?.show" type="danger">
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
    <div class="ppa-table-pagination" v-if="options.needPagination">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper, sizes"
        :total="pagination.total"
        v-model:currentPage="pagination.current"
        v-model:pageSize="pagination.pageSize"
        @change="handleTableChange"
      />
    </div>

    <el-dialog
      v-model="open"
      :title="openType === 1 ? options.editText : options.addText"
      :width="options.dialogWidth"
      append-to-body
      @close="onClose"
    >
      <CommonForm
        v-if="open"
        ref="formRef"
        :columns="formColumns"
        :options="formOptions"
        :model="formData"
        @finish="submitHandle"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import CommonForm from "./form.vue";
import type { columnsType, optionsType, pageResponseType } from "./option";
import {
  Delete,
  Plus,
  Search,
  Download,
  RefreshRight,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import SearchForm from "./components/search.vue";
import { defaultOptTable } from "./state";

interface propsType {
  columns: columnsType[];
  options: optionsType;
}

const props = withDefaults(defineProps<propsType>(), {
  columns: () => [],
});

const defaultOptions = defaultOptTable;

const options = computed((): any => {
  return <optionsType>{
    ...defaultOptions,
    ...props.options,
  };
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

const searchForm = reactive<any>({});

const headerColumns = computed(() => {
  const arr = props.columns.filter((item) => !item.hide);
  return arr;
});

const getList = async () => {
  if (!options.value.api) return;
  const searchForm = searchRef.value?.searchForm || {};
  const params = {
    ...searchForm,
    page: pagination.current,
    pageSize: pagination.pageSize,
    ...sorter.value,
  };
  if (!options.value.needPagination) {
    delete params.page;
    delete params.pageSize;
  }

  options.value?.beforeRequest && (await options.value.beforeRequest(params));
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
  if (options.value.afterRequest) {
    dataSource.value = await options.value.afterRequest(res);
  }
};
const handleTableChange = (currentPage: number, pageSize: number) => {
  pagination.current = currentPage;
  pagination.pageSize = pageSize;
  getList();
};

const handleSortChange = (column: any, prop: string, order: any) => {
  sorter.value = { orderType: order, orderName: prop };
  searchHandle();
};

const handleSelectionChange = (selectedRows: any) => {
  ids.value = selectedRows.map((item: any) => item[options.value.pk || 'id']);
  options.value.selectChange && options.value.selectChange(selectedRows);
}

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

onMounted(() => {
  if (options.value.autoRequest) {
    searchHandle();
  }
});
const ids = ref([]);
const deleteHandle = (record?: any) => {
  let _ids = record ? [record.id] : ids.value;
  if (!_ids.length) {
    ElMessage.error("请选择要删除的数据");
    return;
  }
  options.value.delete?.api(_ids).then(() => {
    searchHandle();
  });
};

const exportHandle = () => {
  const params = {
    ...searchForm,
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
  }));
};

/**
 *
 * @param type 0:新增 1:编辑
 * @param record
 */
const openHandle = (type: number, record?: any) => {
  // debugger;
  formColumns.value = [getAddColumns, getEditColumns][type]()
  if (type === 1) {
    // console.log(record)
    Object.assign(formData, record);
  } else {
    Object.keys(formData).forEach((key) => {
      formData[key] = undefined;
    })
  }
  openType.value = type;
  open.value = true;
};

const submitHandle = (formData: any) => {
  if (!formRef.value) return;
  // console.log(formData)
  if (openType.value === 0) {
    formRef.value.submitLoading = true;
    options.value.add
      ?.api(formData)
      .then(() => {
        ElMessage.success("新增成功");
        setTimeout(onClose, 500);
        getList();
      })
      .finally(() => {
        formRef.value.submitLoading = false;
      });
  }
  if (openType.value === 1) {
    formRef.value.submitLoading = true;
    options.value.edit
      ?.api(formData.id, formData)
      .then(() => {
        ElMessage.success("编辑成功");
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

const searchRef = ref(null);
const tableRef = ref(null);

defineExpose({
  searchRef,
  tableRef,
  searchForm,
});
</script>

<style lang="less">
.ppa-table {
  .ppa-list-header {
    margin-bottom: 10px;
  }
  .ppa-list-tool {
    margin-bottom: 10px;
  }
  .ppa-list-tool {
    display: flex;
    justify-content: space-between;
  }
  .ppa-table-pagination {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
