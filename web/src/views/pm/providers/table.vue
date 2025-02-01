<template>
  <n-spin :show="loading">
    <n-data-table :columns="columns" :data="data" :pagination="pagination" />
  </n-spin>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, h } from 'vue'
import { useMessage, NButton, NPopconfirm, NSpin } from 'naive-ui'
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

const createColumns = (actions: { remove: (row: Provider) => void; edit: (row: Provider) => void }) => {
  return [
    { title: 'Name', key: 'name' },
    { title: 'ABN', key: 'abn' },
    { title: 'Address', key: 'address' },
    { title: 'Contact', key: 'contact' },
    { title: 'Bank', key: 'bank' },
    { title: 'BSB', key: 'bsb' },
    { title: 'Account', key: 'account' },
    { title: 'ID', key: 'id' },
    {
      title: 'Actions',
      key: 'actions',
      render(row: Provider) {
        return h('div', { style: 'display: flex; gap: 8px;' }, [
          h(
            NButton,
            {
              type: 'primary',
              quaternary: true,
              size: 'small',
              onClick: () => actions.edit(row)
            },
            { default: () => 'Edit' }
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => actions.remove(row),
              positiveText: 'Yes',
              negativeText: 'No'
            },
            {
              trigger: () =>
                h(
                  NButton,
                  {
                    type: 'error',
                    quaternary: true,
                    size: 'small'
                  },
                  { default: () => 'Delete' }
                ),
              default: () => 'Are you sure you want to delete this provider?'
            }
          )
        ])
      }
    }
  ]
}

export default defineComponent({
  setup(_, { emit }) {
    const message = useMessage()
    const data = ref<Provider[]>([])
    const loading = ref(false)
    const columns = createColumns({
      remove(row: Provider) {
        handleDelete(row)
      },
      edit(row: Provider) {
        emit('edit-provider', row)
      }
    })
    const pagination = ref(false)

    const fetchProviders = async () => {
      try {
        const response = await api.getProviderList()
        data.value = response.data
      } catch (error) {
        message.error('Error fetching provider list')
      }
    }

    const handleDelete = async (provider: Provider) => {
      loading.value = true
      try {
        await api.deleteProvider(provider.id)  // 使用id
        message.success('Provider deleted successfully')
        await fetchProviders()  // 等待获取新数据
      } catch (error) {
        message.error(error?.message || 'Error deleting provider')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchProviders()
    })

    return {
      data,
      columns,
      pagination,
      handleDelete,
      loading
    }
  }
})
</script>