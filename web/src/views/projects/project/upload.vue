<template>
  <n-space vertical>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M16.175 13H4v-2h12.175l-5.6-5.6L12 4l8 8l-8 8l-1.425-1.4z"
              />
            </svg>
          </n-icon>
        </div>
        <n-text style="font-size: 16px">Click or drag file to this area to upload</n-text>
        <n-p depth="3" style="margin: 8px 0 0 0"
          >Chinese to English Digital Stamp in PNG format</n-p
        >
      </n-upload-dragger>
    </n-upload>
  </n-space>
</template>

<script setup>
import { ref } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const customPath = ref(`project/${props.id}/`) // Custom upload path

// Extra form data to be submitted with the file
const extraData = ref({})

function beforeUpload(file) {
  // Set the file name to the original file name
  extraData.value = {
    filename: file.name,
    path: customPath.value,
  }
  console.log('Preparing to upload:', file)
  return true
}

function handleSuccess(response, file) {
  console.log('Upload successful:', response, file)
}

function handleError(error, file) {
  console.error('Upload failed:', error, file)
}
</script>
