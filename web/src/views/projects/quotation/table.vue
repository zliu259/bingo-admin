<template>
  <n-card>
    <n-data-table
      :columns="columns"
      :data="quotations"
      :loading="loading"
    />
  </n-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, h } from 'vue'
import { NDataTable, NCard, NButton, NTag } from 'naive-ui'
import api from '@/api'

export default defineComponent({
  components: {
    NDataTable,
    NCard,
    NButton,
    NTag
  },
  emits: ['view-details'],
  setup(props, { emit }) {
    const quotations = ref([])
    const loading = ref(false)

    const columns = [
      {
        title: 'Date',
        key: 'date',
        render(row) {
          const date = new Date(parseInt(row.date)).toLocaleString('en-AU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Australia/Sydney',
          })
          return date// Adjust the format as needed
        }
      },
      {
        title: 'Status',
        key: 'status',
        render(row) {
          let statusText = ''
          let statusType: 'success' | 'error' | 'warning' | 'default' | 'primary' | 'info' = 'default'
          switch (row.status) {
            case -1:
              statusText = 'Closed'
              statusType = 'default'
              break
            case 0:
              statusText = 'Pending'
              statusType = 'warning'
              break
            case 1:
              statusText = 'Accepted'
              statusType = 'success'
              break
            case 2:
              statusText = 'Completed'
              statusType = 'info'
              break
            default:
              statusText = 'Unknown'
              statusType = 'default'
          }
          return h(
            NTag,
            { type: statusType },
            { default: () => statusText }
          )
        }
      },
      { title: 'Client Name', key: 'client_name' },
      { title: 'Type', key: 'type' },
      { title: 'Total Price', key: 'total_price' },
      {
        title: 'Actions',
        key: 'actions',
        render(row) {
          return h(
            NButton,
            {
                quaternary: true,
                type: 'info',
              onClick: () => {
                emit('view-details', row.id)
              }
            },
            { default: () => 'Details' }
            
          )
        }
      }
    ]

    const fetchQuotations = async () => {
      loading.value = true
      try {
        const response = await api.getQuotationList()
        quotations.value = response.data
      } catch (error) {
        console.error('Error fetching quotations:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchQuotations()
    })

    return {
      quotations,
      columns,
      loading
    }
  }
})
</script>