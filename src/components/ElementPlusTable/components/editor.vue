<template>
  <div class="editor-wrapper">
    <!-- 工具栏 -->
    <Toolbar
      :id="toolid"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
    />
    <!-- 编辑器 -->
    <Editor
      :id="id"
      v-model="modelValue"
      :default-config="editorConfig"
      :mode="mode"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { shallowRef, ref, onBeforeUnmount } from "vue";
import LANG from "../lang";

// API 引用
import userAPI from "@/api/user";

const props = defineProps({
  modelValue: {
    type: [String],
    default: "",
  },
  excludeKeys: {
    type: Array,
    default: [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const toolid = new Date().getTime() + Math.random() * 100;
const id = new Date().getTime() + Math.random() * 100;

const modelValue = defineModel();

const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef
const mode = ref("simple"); // 编辑器模式
const toolbarConfig = ref({
  excludeKeys: props.excludeKeys,
}); // 工具条配置
// 编辑器配置
const editorConfig = ref({
  placeholder: LANG.tip.inputTip,
  MENU_CONF: {
    uploadImage: {
      // 自定义图片上传
      async customUpload(file: any, insertFn: any) {
        userAPI.uploadImage(file).then((data: any) => {
          insertFn(data.url);
        });
      },
    },
  },
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

function handleChange(editor: any) {
  modelValue.value = editor.getHtml();
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss">
.w-e-full-screen-container {
  z-index: 99 !important;
  .w-e-text-container {
    height: 100% !important;
  }
}
.editor-wrapper {
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 24px;
  .w-e-toolbar {
    border-bottom: 1px solid #ccc;
  }
  .w-e-text-container {
    height: 300px;
  }
}
</style>
