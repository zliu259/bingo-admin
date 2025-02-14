<template>
  <n-space vertical>
    <n-flex>
      <n-button type="primary" @click="fetchFiles">Refresh List</n-button>
      <n-button type="primary" @click="showUploadDialog">Upload</n-button>
    </n-flex>
    <n-data-table :columns="columns" :data="fileList" :bordered="true" :pagination="false" />

    <n-dialog-provider>
      <Upload :id="props.id" />
    </n-dialog-provider>
  </n-space>
</template>

<script setup>
import { ref } from 'vue'
import { defineProps } from 'vue'
import { NDataTable, NButton, NSpace } from 'naive-ui'
import Upload from './upload.vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const fileList = ref([])

const columns = [
  {
    title: 'File',
    key: 'name',
  },
  {
    title: 'Last Modified',
    key: 'lastModified',
  },
  {
    title: 'Operation',
    key: 'url',
    render(row) {
      return h(
        'a',
        {
          href: row.url,
          target: '_blank',
          download: row.name,
          style: 'color: #18a058; text-decoration: none; font-weight: bold;',
        },
        'Download'
      )
    },
  },
]

const fetchFiles = async () => {
  try {
    const response = await fetch(
      `https://10fa00d94392.bingocommunications.com.au/1b78ea79c35e?prefix=project/${props.id}/`
    ) // 替换为你的API地址
    const data = await response.json()
    fileList.value = data.files
  } catch (error) {
    console.error('获取文件列表失败:', error)
  }
}

const isUploadDialogVisible = ref(false)

const showUploadDialog = () => {
  isUploadDialogVisible.value = true
}


</script>
