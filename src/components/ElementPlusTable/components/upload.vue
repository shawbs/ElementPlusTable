<template>
  <div class="custom-elementplus-upload">
    <!-- {{ fileList }} -->
    <!-- {{ props }} -->
    <template v-if="isSigle">
      <el-upload
        v-bind="props"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :list-type="listType"
        :show-file-list="showUploadList"
        @preview="handlePreview"
      >
        <template #trigger>
          <div v-if="props.type == 'image'" class="upload-img-btn">
            <div v-if="fileList[0]">
              <el-icon v-if="uploadLoading" class="is-loading img-loading">
                <Loading />
              </el-icon>
              <img :src="fileList[0].url" alt="avatar" />
            </div>
            <div v-else>
              <el-icon v-if="uploadLoading" class="is-loading">
                <Loading />
              </el-icon>
              <el-icon v-else><Plus /></el-icon>
            </div>
          </div>
          <el-button v-else :icon="Upload" :loading="uploadLoading">
            {{ props.uploadBtnText }}
          </el-button>
        </template>
      </el-upload>
    </template>
    <template v-else>
      <el-upload
        v-model:file-list="fileList"
        :before-upload="beforeUpload"
        :list-type="listType"
        :show-file-list="showUploadList"
        @preview="handlePreview"
        @remove="handleRemove"
      >
        <template #trigger>
          <div v-if="props.type == 'image'" class="upload-img-btn">
            <el-icon v-if="uploadLoading" class="is-loading">
              <Loading />
            </el-icon>
            <el-icon v-else><Plus /></el-icon>
          </div>
          <el-button v-else :icon="Upload" :loading="uploadLoading">
            {{ props.uploadBtnText }}
          </el-button>
        </template>
      </el-upload>
    </template>

    <el-dialog
      v-model="previewVisible"
      :title="previewTitle"
      :footer="null"
      @cancel="handleCancel"
      fullscreen
    >
      <img alt="example" style="width: 100%" :src="previewImage" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { uploadType } from "../js/type";
import { ElMessage } from "element-plus";
import { Loading, Upload, Plus } from "@element-plus/icons-vue";
import { defaultOptUpload } from "../js/option";
const props = withDefaults(defineProps<uploadType>(), defaultOptUpload);

const modeValue = defineModel<string[] | string>({ default: "" });

const emit = defineEmits(["change"]);

const showUploadList = computed(() => {
  return !props.isSigle;
});

const listType = computed(() => {
  if (props.type === "image") {
    if (props.isSigle) {
      return "picture";
    } else {
      return "picture-card";
    }
  } else {
    return "text";
  }
});

type fileType = {
  uid: string;
  name: string;
  status: string;
  url: string;
};
const fileList = ref<fileType[]>([]);

const initValue = () => {
  // console.log("initValue", props.isSigle, modeValue.value);
  if (props.isSigle) {
    if (modeValue.value && typeof modeValue.value === "string") {
      fileList.value = [
        {
          uid: modeValue.value,
          name: modeValue.value,
          status: "done",
          url: modeValue.value,
        },
      ];
    } else {
      fileList.value = [];
    }
  } else {
    if (Array.isArray(modeValue.value)) {
      fileList.value = modeValue.value.map((item, index) => {
        return {
          uid: index + item,
          name: item,
          status: "done",
          url: item,
        };
      });
    } else {
      fileList.value = [];
    }
  }
};

initValue();

const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");
const uploadLoading = ref(false);

const beforeUpload = async (file: any) => {
  // debugger;
  const isLtSize = file.size / 1024 / 1024 < props.maxSize;
  const type = file.name.split(".").pop();
  if (!isLtSize) {
    ElMessage.error(props.sizeWarn + props.maxSize + "MB");
    return false;
  }
  if (props.accept && !props.accept.includes(type)) {
    ElMessage.error(props.typeWarn + props.accept);
    return false;
  }
  if (
    !props.isSigle &&
    props.maxCount &&
    fileList.value.length >= props.maxCount
  ) {
    ElMessage.error(props.limtWarn + props.maxCount);
    return false;
  }

  await handleUpload(file);

  return false;
};

const handleRemove = (file: any) => {
  // console.log("remove", file);
  setTimeout(() => {
    modeValue.value = props.isSigle
      ? ""
      : fileList.value.map((item) => item.url);

    emit("change", modeValue.value);
  }, 0);
};

const handleUpload = async (file: any) => {
  uploadLoading.value = true;
  const params = Object.create({});
  params[props.name] = file;
  params.type = file.type;
  await props
    .api(params)
    .then((data) => {
      if (props.isSigle) {
        fileList.value = [
          {
            uid: file.uid,
            name: file.name,
            status: "done",
            url: data.path,
          },
        ];
        modeValue.value = data.path;
      } else {
        const item = {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: data.path,
        };
        fileList.value.push(item);
        modeValue.value = fileList.value.map((item) => item.url);
      }
      emit("change", modeValue.value);
    })
    .finally(() => {
      uploadLoading.value = false;
    });
};

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const handlePreview = async (file: any) => {
  // console.log('preview',file);
  if (props.type !== "image") return;
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value =
    file.name || file.url.substring(file.url.lastIndexOf("/") + 1);
};

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = "";
};
</script>

<style lang="scss">
.custom-elementplus-upload {
  --upload-size: 120px;
  .el-upload--picture-card {
    --el-upload-picture-card-size: var(--upload-size);
  }
  .el-upload-list--picture-card {
    --el-upload-list-picture-card-size: var(--upload-size);
  }
  .el-upload {
    .el-upload--picture-card {
      --el-upload-picture-card-size: var(--upload-size);
    }
    .el-upload-list--picture-card {
      --el-upload-list-picture-card-size: var(--upload-size);
    }
    .upload-select {
      width: var(--upload-size);
      height: var(--upload-size);
      margin-inline-end: 8px;
      margin-bottom: 8px;
      // text-align: center;
      // vertical-align: top;
      background-color: rgba(0, 0, 0, 0.02);
      border: 1px dashed #d9d9d9;
      border-radius: 8px;
      cursor: pointer;
      transition: border-color 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .upload-img-btn {
      position: relative;
      > div {
        width: 100%;
        height: 100%;
      }
      .img-loading {
        position: absolute;
        top: 45%;
        left: 45%;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        vertical-align: bottom;
      }
    }
    &.el-upload--picture {
      width: var(--upload-size);
      height: var(--upload-size);
      border: 1px dashed #d9d9d9;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.02);
    }
  }
}
</style>
