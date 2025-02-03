<template>
  <n-space vertical>
    <!-- 自定义文件名输入框 -->
    <!-- n-input v-model:value="customFilename" :placeholder="`${alias}`" /-->
    <!-- 上传路径输入框 -->
    <!--n-input v-model:value="customPath" placeholder="输入上传路径，如 folder/subfolder (可选)" /-->

    <!-- 上传组件 -->
    <n-upload
      action="https://upload.liuzihao1997.workers.dev/upload"  
      name="file"  
      :data="extraData"
      accept="*/*"  
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
    >
    <n-upload-dragger>
      <n-text style="font-size: 16px">
        Click or drag file to this area to upload
      </n-text>
      <n-p depth="3" style="margin: 8px 0 0 0">
        Please upload  Digital Stamp in PNG format
      </n-p>
    </n-upload-dragger>
    </n-upload>
  </n-space>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  alias: {
    type: String,
    required: true
  }
})

const customFilename = ref(`${props.alias}.png`);  // 自定义文件名
const customPath = ref(`Accreditation/${props.alias}/`);  // 自定义上传路径

// 额外的表单数据，会和文件一起提交
const extraData = computed(() => {
  return {
    filename: customFilename.value,
    path: customPath.value
  }
});

function beforeUpload(file) {
  // 可在此处增加文件大小、类型等校验
  console.log("准备上传:", file);
  return true;
}

function handleSuccess(response, file) {
  console.log("上传成功:", response, file);
}

function handleError(error, file) {
  console.error("上传失败:", error, file);
}

// 监听 alias 的变化，并更新 customFilename 的默认值
watch(() => props.alias, (newAlias) => {
  customFilename.value = newAlias;
})
</script>