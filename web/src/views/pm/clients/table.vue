<template>
  <n-spin :show="loading">
    <n-data-table :columns="columns" :data="data" :pagination="pagination" />
  </n-spin>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, h } from 'vue'
import { useMessage, NButton, NPopconfirm, NSpin } from 'naive-ui'
import api from '@/api'

interface Client {
  client_id: string
  name: string
  abn: string
  contact: string
  method: string
  details: string
  note: string
}

const createColumns = (actions: { remove: (row: Client) => void; edit: (row: Client) => void }) => {
  return [
    { title: 'Name', key: 'name' },
    { title: 'ABN', key: 'abn' },
    { title: 'Contact', key: 'contact' },
    { title: 'Method', key: 'method' },
    { title: 'Details', key: 'details' },
    { title: 'Note', key: 'note' },
    { title: 'Client ID', key: 'client_id' },
    {
      title: 'Actions',
      key: 'actions',
      render(row: Client) {
        return h('div', [
          h(
            NButton,
            {
              type: 'primary',
              quaternary: true,
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
                    quaternary: true
                  },
                  { default: () => 'Delete' }
                ),
              default: () => 'Are you sure you want to delete this client?'
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
    const data = ref<Client[]>([])
    const loading = ref(false)
    const columns = createColumns({
      remove(row: Client) {
        handleDelete(row)
      },
      edit(row: Client) {
        emit('edit-client', row)
      }
    })
    const pagination = ref(false)

    const fetchClients = async () => {
      try {
        const response = await api.getClientList()
        data.value = response.data
      } catch (error) {
        message.error('Error fetching client list')
      }
    }

    const handleDelete = async (client: Client) => {
      loading.value = true
      try {
        await api.deleteClient(client.client_id)
        message.success('Client deleted successfully')
        fetchClients()
      } catch (error) {
        message.error('Error deleting client')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchClients()
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