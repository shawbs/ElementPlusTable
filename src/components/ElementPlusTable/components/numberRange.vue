<template>
    <el-space>
      <el-input-number
        v-model="date[0]"
        step-strictly
        :placeholder="minplaceholder"
        v-bind="$attrs"
        :style="{width:width}"
        @change="changeHandle"
      />
      {{ props.str }}
      <el-input-number
        v-model="date[1]"
        step-strictly
        :placeholder="maxplaceholder"
        v-bind="$attrs"
        :style="{width:width}"
        @change="changeHandle"
      />
      <!-- {{ date }} -->
    </el-space>
  </template>
  
  <script setup lang="ts">
import { reactive } from 'vue';

  const props = defineProps({
    minplaceholder: String,
    maxplaceholder: String,
    width: String,
    str: {
      type: String,
      default: "-",
    },
  });
  const date = defineModel<any[]>({ default: [] });
  const emits = defineEmits(['change'])

  const changeHandle = () => {
    if (date.value && date.value[0] > date.value[1]) {
      [date.value[0], date.value[1]] = [date.value[1], date.value[0]];
    }
    emits('change', reactive(date.value) )
  };
  </script>
  
  <style></style>
  