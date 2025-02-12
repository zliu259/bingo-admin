<template>
  <n-space vertical>
    <n-button type="primary" @click="fetchFiles">刷新文件列表</n-button>
    <n-data-table :columns="columns" :data="fileList" :bordered="true" :pagination="false" />
  </n-space>
</template>

<script setup>
import { ref } from 'vue'
import { NDataTable, NButton, NSpace } from 'naive-ui'

// 文件列表数据
const fileList = ref([])

// 定义表格列
const columns = [
  {
    title: 'File',
    key: 'name',
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

// 获取文件列表
const fetchFiles = async () => {
  try {
    const response = await fetch('https://10fa00d94392.bingocommunications.com.au/1b78ea79c35e') // 替换为你的API地址
    const data = await response.json()
    fileList.value = data.files
  } catch (error) {
    console.error('获取文件列表失败:', error)
  }
}
</script>
