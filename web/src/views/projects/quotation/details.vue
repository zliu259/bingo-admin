<!-- Parent Component (details.vue) -->
<template>
  <div>
    <div v-if="loading" style="margin: 200px">
      <n-spin size="large">
        <template #description>
          <h1>Loading<br />加载中</h1>
        </template>
      </n-spin>
    </div>
    <div v-else>
      <n-card title="Quotation Information" style="margin: 20px; max-width: 96%">
        <div id="quotation_info">
          <div style="width: 480px">
            <h2>
              <n-tag v-if="quotation.status === -1" type="default" :bordered="false">Closed</n-tag>
              <n-tag v-else-if="quotation.status === 0" type="warning" :bordered="false"
                >Pending</n-tag
              >
              <n-tag v-else-if="quotation.status === 1" type="success" :bordered="false"
                >Accepted</n-tag
              >
              <n-tag v-else-if="quotation.status === 2" type="info" :bordered="false"
                >Completed</n-tag
              >
              <br />
              {{ quotation.id }}
            </h2>
            <br />
            <div style="width: 100%">
              {{ quotation.type }}<br />
              {{
                new Date(parseInt(quotation.date)).toLocaleString('en-AU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  timeZone: 'Australia/Sydney',
                })
              }}
            </div>
          </div>
          <div style="width: 200px">
            <n-alert :show-icon="false" type="info" style="width: 200px">
              <h1>
                Total Price<br />
                <n-tag v-if="quotation.gst === 'true'" type="warning" :bordered="false"
                  >With GST</n-tag
                >
                <n-tag v-else-if="quotation.status === 'false'" type="info" :bordered="false"
                  >No GST</n-tag
                >
              </h1>
              <h1>AU$ {{ quotation.total_price }}</h1>
            </n-alert>
          </div>
          <div style="width: 180px; margin-left: 20px">
            <n-alert :show-icon="false" :bordered="false">
              <n-button-group vertical>
                <n-button type="success"> Accept Quotation </n-button><br />
                <n-button type="info"> Payment Received </n-button><br />
                <n-button type="error"> Quotation Closed </n-button>
              </n-button-group>
            </n-alert>
          </div>
        </div>
      </n-card>
      <div id="info">
        <n-card class="part_info" title="Client Information">
          Client ID: {{ quotation.client_id }}<br />
          Client: {{ quotation.client_name }}<br />
          Contact: {{ quotation.client_contact }}<br />
          Details: {{ quotation.client_details }}
        </n-card>
        <n-card class="part_info" title="Provider Information">
          Provider ID: {{ quotation.provider_id }}<br />
        </n-card>
      </div>
      <div class="invoice">
        <n-card style="width: 97%; margin: 20px">
          <n-data-table
            :columns="columns"
            :data="data"
            :pagination="pagination"
            :bordered="false"
          />
        </n-card>
      </div>
      <pre>{{ quotation }}</pre>
      <!-- 这里可以添加更多详细信息的展示 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, h } from 'vue'
import { defineProps } from 'vue'
import api from '@/api'
import { NInputNumber, NSelect } from 'naive-ui'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const id = ref(props.id)
const quotation = ref(null)
const loading = ref(true)
const data = ref([]) // Editable Table Data
const rawStatistics = ref([]) // Store original statistics for updating
const availableItems = ref([]) // Available service items for dropdown

// Fetch available service items from API
const fetchServiceItems = async () => {
  try {
    const response = await api.getServiceItemList()
    availableItems.value = response.data.map((item) => ({
      code: item.code,
      item: item.item,
      unit: item.unit,
      price: item.price,
    }))
  } catch (error) {
    console.error('Error fetching service items:', error)
  }
}

// Define Editable Table Columns
const columns = ref([
  {
    title: 'Code',
    key: 'code',
    render: (row) =>
      h(NSelect, {
        value: row.code,
        options: availableItems.value.map((item) => ({
          label: item.code,
          value: item.code,
        })),
        onUpdateValue: (value) => {
          const selectedItem = availableItems.value.find((item) => item.code === value)
          if (selectedItem) {
            row.code = selectedItem.code
            row.item = selectedItem.item
            row.unit = selectedItem.unit
            row.price = selectedItem.price
            row.sum = row.qty * selectedItem.price
            updateSourceData()
          }
        },
      }),
  },
  { title: 'Item', key: 'item' },
  { title: 'Unit', key: 'unit' },
  {
    title: 'Quantity',
    key: 'qty',
    render: (row) =>
      h(NInputNumber, {
        value: row.qty,
        min: 1,
        onUpdateValue: (value) => {
          row.qty = value
          row.sum = row.qty * row.price
          updateSourceData()
        },
      }),
  },
  {
    title: 'Unit Price (AU$)',
    key: 'price',
  },
  {
    title: 'Total Price (AU$)',
    key: 'sum',
    render: (row) => `AU$ ${row.sum.toFixed(2)}`,
  },
])

// Fetch quotation details and initialize the table
const fetchQuotationDetails = async (quotationId) => {
  loading.value = true
  try {
    const response = await api.getQuotationById(quotationId)
    quotation.value = response.data[0]

    // Check if statistics exists and parse it
    if (quotation.value.statistics) {
      try {
        let parsedData = JSON.parse(quotation.value.statistics)
        rawStatistics.value = parsedData

        // Convert to editable format
        data.value = parsedData.map((item) => ({
          code: item.code,
          item: item.item,
          unit: item.unit,
          qty: item.qty,
          price: item.price,
          sum: item.sum,
        }))
      } catch (error) {
        console.error('Error parsing statistics JSON:', error)
      }
    }
  } catch (error) {
    console.error('Error fetching quotation details:', error)
  } finally {
    loading.value = false
  }
}

// Function to update the quotation source data
const updateSourceData = () => {
  quotation.value.statistics = JSON.stringify(data.value)
}

watch(
  () => props.id,
  (newId) => {
    id.value = newId
    fetchQuotationDetails(newId)
    fetchServiceItems()
  }
)

onMounted(() => {
  fetchQuotationDetails(id.value)
  fetchServiceItems()
})
</script>
<style scoped>
.part_info {
  margin: 20px;
  min-width: 400px;
  max-width: 600px;
}

#info {
  display: flex;
}

#quotation_info {
  display: flex;
  margin: 20px;
}
</style>
