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
        <div style="font-size: 16px">
          <n-icon size="48" :depth="3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 36 36">
              <path
                fill="#DE2910"
                d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4z"
              />
              <path
                fill="#FFDE02"
                d="m11.136 8.977l.736.356l.589-.566l-.111.81l.72.386l-.804.144l-.144.804l-.386-.72l-.81.111l.566-.589zm4.665 2.941l-.356.735l.566.59l-.809-.112l-.386.721l-.144-.805l-.805-.144l.721-.386l-.112-.809l.59.566zm-.957 3.779l.268.772l.817.017l-.651.493l.237.783l-.671-.467l-.671.467l.236-.783l-.651-.493l.817-.017zm-3.708 3.28l.736.356l.589-.566l-.111.81l.72.386l-.804.144l-.144.804l-.386-.72l-.81.111l.566-.589zM7 10.951l.929 2.671l2.826.058l-2.253 1.708l.819 2.706L7 16.479l-2.321 1.615l.819-2.706l-2.253-1.708l2.826-.058z"
              />
            </svg>
          </n-icon>
          <n-icon size="48" :depth="3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M16.175 13H4v-2h12.175l-5.6-5.6L12 4l8 8l-8 8l-1.425-1.4z"
              />
            </svg>
          </n-icon>
          <n-icon size="48" :depth="3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 36 36">
              <path
                fill="#00247D"
                d="M32 5H4c-.205 0-.407.015-.604.045l-.004 1.754l-2.73-.004A3.984 3.984 0 0 0 0 9v18a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4z"
              />
              <path
                d="M9 26.023l-1.222 1.129l.121-1.66l-1.645-.251l1.373-.94l-.829-1.443l1.591.488L9 21.797l.612 1.549l1.591-.488l-.83 1.443l1.374.94l-1.645.251l.121 1.66zM27.95 9.562l-.799.738l.079-1.086l-1.077-.164l.899-.615l-.542-.944l1.04.319l.4-1.013l.401 1.013l1.041-.319l-.543.944l.898.615l-1.076.164l.079 1.086zm-4 6l-.799.739l.079-1.086l-1.077-.164l.899-.616l-.542-.944l1.04.319l.4-1.013l.401 1.013l1.041-.319l-.543.944l.898.616l-1.076.164l.079 1.086zm9-2l-.799.739l.079-1.086l-1.077-.164l.899-.616l-.542-.944l1.04.319l.4-1.013l.401 1.013l1.041-.319l-.543.944l.898.616l-1.076.164l.079 1.086zm-5 14l-.799.739l.079-1.086l-1.077-.164l.899-.616l-.542-.944l1.04.319l.4-1.013l.401 1.013l1.041-.319l-.543.944l.898.616l-1.076.164l.079 1.086zM31 16l.294.596l.657.095l-.475.463l.112.655L31 17.5l-.588.309l.112-.655l-.475-.463l.657-.095z"
                fill="#FFF"
              />
              <path
                fill="#00247D"
                d="M19 18V5H4c-.32 0-.604.045-.604.045l-.004 1.754l-2.73-.004S.62 6.854.535 7A3.988 3.988 0 0 0 0 9v9h19z"
              />
              <path
                fill="#EEE"
                d="M19 5h-2.331L12 8.269V5H7v2.569L3.396 5.045a3.942 3.942 0 0 0-1.672.665L6.426 9H4.69L.967 6.391a4.15 4.15 0 0 0-.305.404L3.813 9H0v5h3.885L0 16.766V18h3.332L7 15.432V18h5v-3.269L16.668 18H19v-2.029L16.185 14H19V9h-2.814L19 7.029V5z"
              />
              <path fill="#CF1B2B" d="M11 5H8v5H0v3h8v5h3v-5h8v-3h-8z" />
              <path
                fill="#CF1B2B"
                d="M19 5h-1.461L12 8.879V9h1.571L19 5.198zm-17.276.71a4.052 4.052 0 0 0-.757.681L4.69 9h1.735L1.724 5.71zM6.437 14L.734 18h1.727L7 14.822V14zM19 17.802v-1.22L15.313 14H13.57z"
              />
            </svg>
          </n-icon>
        </div>

        <n-text style="font-size: 16px"> Click or drag file to this area to upload </n-text>

        <n-p depth="3" style="margin: 8px 0 0 0">
          Chinese to English Digital Stamp in PNG format
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
    required: true,
  },
})

const customFilename = ref(`${props.alias}toEn.png`) // 自定义文件名
const customPath = ref(`Accreditation/${props.alias}/`) // 自定义上传路径

// 额外的表单数据，会和文件一起提交
const extraData = computed(() => {
  return {
    filename: customFilename.value,
    path: customPath.value,
  }
})

function beforeUpload(file) {
  // 可在此处增加文件大小、类型等校验
  console.log('准备上传:', file)
  return true
}

function handleSuccess(response, file) {
  console.log('上传成功:', response, file)
}

function handleError(error, file) {
  console.error('上传失败:', error, file)
}

// 监听 alias 的变化，并更新 customFilename 的默认值
watch(
  () => props.alias,
  (newAlias) => {
    customFilename.value = newAlias
  }
)
</script>
