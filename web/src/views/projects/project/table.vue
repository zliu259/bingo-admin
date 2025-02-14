<template>
  <n-space vertical>
    <n-button type="primary" @click="fetchAllProjects">展示所有项目</n-button>
    <n-data-table :columns="columns" :data="projectList" :bordered="true" :pagination="false" />
  </n-space>
</template>

<script setup>
import { ref, onMounted, h } from 'vue'
import { NDataTable, NButton, NSpace, NTag } from 'naive-ui'
import { useRouter } from 'vue-router'
import api from '@/api'
import { defineEmits } from 'vue'

// 项目列表数据
const projectList = ref([])

// 格式化时间戳为可读时间
const formatDate = (timestamp) => {
  const date = new Date(Number(timestamp))
  return date.toLocaleString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// 定义表格列
const columns = [
  {
    title: 'Status',
    key: 'status',
    render(row) {
      const statusMap = {
        '-1': { label: 'Error', type: 'warning' },
        0: { label: 'Pending', type: 'warning' },
        1: { label: 'Process', type: 'info' },
        2: { label: 'Working', type: 'info' },
        3: { label: 'Reviewing', type: 'info' },
        4: { label: 'Document', type: 'success' },
        5: { label: 'Delivering', type: 'success' },
        6: { label: 'Completed', type: 'success' },
      }
      const status = statusMap[row.status] || { label: 'unknown', type: 'default' }
      return h(NTag, { type: status.type }, { default: () => status.label })
    },
  },
  {
    title: 'Active',
    key: 'active',
    render(row) {
      return h(
        NTag,
        { type: row.active ? 'success' : 'default' },
        { default: () => (row.active ? 'Active' : 'Inactive') }
      )
    },
  },
  {
    title: 'Date',
    key: 'date',
    render(row) {
      return formatDate(row.date)
    },
  },
  {
    title: 'Due',
    key: 'due',
    render(row) {
      return formatDate(row.due)
    },
  },
  { title: 'Task', key: 'task' },
  { title: 'Current', key: 'current' },
  { title: 'Note', key: 'note' },
  {
    title: 'Details',
    key: 'details',
    render(row) {
      return h(
        NButton,
        {
          type: 'primary',
          onClick: () => emit('view-details', row.id),
        },
        'Details'
      )
    },
  },
]

// 获取被激活的项目列表
const fetchActivedProjects = async () => {
  try {
    const response = await api.getActivedProjectList()
    projectList.value = response.data
  } catch (error) {
    console.error('获取被激活的项目列表失败:', error)
  }
}

// 获取所有项目列表
const fetchAllProjects = async () => {
  try {
    const response = await api.getProjectList()
    projectList.value = response.data
  } catch (error) {
    console.error('获取所有项目列表失败:', error)
  }
}

// 查看项目详情
const router = useRouter()
const viewDetails = (id) => {
  router.push({ name: 'ProjectDetails', params: { id } })
}

// 组件挂载时获取被激活的项目列表
onMounted(() => {
  fetchActivedProjects()
})

// 定义 emits
const emit = defineEmits(['view-details'])
</script>
