<template>
  <n-spin :show="loading">
    <n-data-table :columns="columns" :data="data" :pagination="pagination" />
  </n-spin>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useMessage, NSpin } from 'naive-ui'
import api from '@/api'

interface Provider {
  id: string  // 改用id而不是provider_id
  name: string
  abn: string
  address: string
  contact: string
  bank: string
  bsb: string
  account: string
}

const createColumns = () => {
  return [
    { title: 'Name', key: 'name' },
    { title: 'ABN', key: 'abn' },
    { title: 'Address', key: 'address' },
    { title: 'Contact', key: 'contact' },
    { title: 'Bank', key: 'bank' },
    { title: 'BSB', key: 'bsb' },
    { title: 'Account', key: 'account' },
    { title: 'ID', key: 'id' }
  ]
}

export default defineComponent({
  setup() {
    const message = useMessage()
    const data = ref<Provider[]>([])
    const loading = ref(false)
    const columns = createColumns()
    const pagination = ref(false)

    const fetchProviders = async () => {
      try {
        const response = await api.getProviderList()
        data.value = response.data
      } catch (error) {
        message.error('Error fetching provider list')
      }
    }

    onMounted(() => {
      fetchProviders()
    })

    return {
      data,
      columns,
      pagination,
      loading
    }
  }
})
</script>