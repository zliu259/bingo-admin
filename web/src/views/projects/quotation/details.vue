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
                <n-tag v-if="quotation.gst" type="warning" :bordered="false">With GST</n-tag>
                <n-tag v-else type="info" :bordered="false">No GST</n-tag>
              </h1>
              <h1>AU$ {{ quotation.total_price.toFixed(2) }}</h1>
            </n-alert>
          </div>
          <div style="width: 180px; margin-left: 20px">
            <n-alert :show-icon="false" :bordered="false">
              <n-button-group vertical>
                <n-button type="success" :loading="updating" @click="updateQuotation(1)">
                  Accept Quotation </n-button
                ><br />
                <n-button type="info" :loading="updating" @click="updateQuotation(2)">
                  Payment Received </n-button
                ><br />
                <n-button type="error" :loading="updating" @click="updateQuotation(-1)">
                  Quotation Closed </n-button
                ><br />
                <n-button type="error" :loading="updating" @click="updateQuotation(0)">
                  Reactive
                </n-button>
              </n-button-group>
            </n-alert>
          </div>
          <div style="width: 180px; margin-left: 20px">
            <n-alert :show-icon="false" :bordered="false">
              <n-button-group vertical>
                <n-button type="warning" :loading="updating" @click="updateQuotation()">
                  Update Quotation
                </n-button>
                <br />
                <n-button type="success"> Confirm Project </n-button><br />
                <n-button type="info"> Generate Quotation </n-button><br />
                <n-button type="info"> Generate Invoice </n-button>
              </n-button-group>
            </n-alert>
          </div>
        </div>
      </n-card>
      <n-card style="margin: 20px; max-width: 96%">
        <div id="p_info">
          <n-card title="Client" class="part_info">
            <h5>{{ quotation.client_id }}</h5>
            <h2>{{ quotation.client_name }}</h2>
            <h2>{{ quotation.client_contact }}</h2>
            <h2>{{ quotation.client_details }}</h2>
          </n-card>
          <n-card title="Provider" class="part_info">
            <h5>{{ quotation.provider_id }}</h5>
            <h2>{{ providerName }}</h2>
          </n-card>
        </div>
      </n-card>

      <div class="invoice">
        <n-card style="width: 97%; margin: 20px">
          <div style="display: flex; align-items: center; margin-bottom: 10px">
            <n-button
              type="primary"
              style="margin-right: 20px"
              :disabled="quotation.status !== 0"
              @click="addRow"
              >Add Item</n-button
            >
            <n-switch
              v-model:value="quotation.gst"
              :round="false"
              :disabled="quotation.status !== 0"
              @update:value="toggleGST"
            >
              <template #checked>GST</template>
              <template #unchecked>No GST</template>
            </n-switch>
          </div>
          <n-data-table
            :columns="columns"
            :data="data"
            :pagination="pagination"
            :bordered="false"
          />
        </n-card>
      </div>
      <pre>{{ quotation }}</pre>
    </div>
  </div>
  <n-message-provider>
    <p></p>
  </n-message-provider>
</template>

<script setup>
import { ref, onMounted, watch, h } from 'vue'
import { defineProps } from 'vue'
import api from '@/api'
import { NInputNumber, NSelect, NButton, useMessage } from 'naive-ui'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const id = ref(props.id)
const quotation = ref({
  price: 0,
  total_price: 0,
  gst: false,
  statistics: '[]',
})
const loading = ref(true)
const data = ref([]) // 可编辑表格数据
const availableItems = ref([]) // 可选服务项

// 获取服务项数据
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

// 计算总价
const calculateTotalPrice = () => {
  const subtotal = data.value.reduce((acc, item) => acc + item.sum, 0)
  quotation.value.price = subtotal
  quotation.value.total_price = quotation.value.gst ? subtotal * 1.1 : subtotal

  // ✅ **正确更新 statistics**
  quotation.value.statistics = JSON.stringify(data.value)
}

// 监听 `data`，确保 statistics 及时更新
watch(
  data,
  () => {
    quotation.value.statistics = JSON.stringify(data.value)
  },
  { deep: true }
)

const toggleGST = () => {
  calculateTotalPrice()
}

const addRow = () => {
  data.value.push({
    code: '',
    item: '',
    unit: '',
    qty: 1,
    price: 0,
    sum: 0,
  })
  calculateTotalPrice()
}

const deleteRow = (index) => {
  data.value.splice(index, 1)
  calculateTotalPrice()
}

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
          if (quotation.value.status !== 0) return
          const selectedItem = availableItems.value.find((item) => item.code === value)
          if (selectedItem) {
            row.code = selectedItem.code
            row.item = selectedItem.item
            row.unit = selectedItem.unit
            row.price = selectedItem.price
            row.sum = row.qty * selectedItem.price
            calculateTotalPrice()
          }
        },
        disabled: quotation.value.status !== 0,
      }),
  },
  { title: 'Item', key: 'item' },
  { title: 'Unit', key: 'unit' },
  { title: 'Unit Price', key: 'price' },
  {
    title: 'Quantity',
    key: 'qty',
    render: (row) =>
      h(NInputNumber, {
        value: row.qty,
        min: 1,
        onUpdateValue: (value) => {
          if (quotation.value.status !== 0) return // 只有 status=0 时才允许修改
          row.qty = value
          row.sum = row.qty * row.price
          calculateTotalPrice()
        },
        disabled: quotation.value.status !== 0,
      }),
  },
  { title: 'Total Price', key: 'sum', render: (row) => `AU$ ${row.sum.toFixed(2)}` },
  {
    title: 'Operations',
    key: 'actions',
    render: (row, index) =>
      h(
        NButton,
        {
          type: 'error',
          size: 'small',
          onClick: () => deleteRow(index),
          disabled: quotation.value.status !== 0,
        },
        'Remove'
      ),
  },
])
const providerName = ref('') // 用于存储 provider 名称

const fetchProviderDetails = async (providerId) => {
  if (!providerId) return // 防止 providerId 为空时报错

  try {
    const response = await api.getProviderById(providerId)
    if (response.data.length > 0) {
      providerName.value = response.data[0].name
    } else {
      providerName.value = 'Unknown Provider'
    }
  } catch (error) {
    console.error('Error fetching provider details:', error)
    providerName.value = 'Failed to load provider'
  }
}

const fetchQuotationDetails = async (quotationId) => {
  loading.value = true
  try {
    const response = await api.getQuotationById(quotationId)
    quotation.value = response.data[0]

    // ✅ **确保 `gst` 正确加载**
    quotation.value.gst = !!quotation.value.gst

    // ✅ **确保 `statistics` 正确解析**
    if (quotation.value.statistics) {
      try {
        data.value = JSON.parse(quotation.value.statistics).map((item) => ({
          ...item,
          sum: item.qty * item.price,
        }))
      } catch (e) {
        console.error('Failed to parse quotation statistics:', e)
      }
    }
    await fetchProviderDetails(quotation.value.provider_id)

    calculateTotalPrice()
  } catch (error) {
    console.error('Error fetching quotation details:', error)
  } finally {
    loading.value = false
  }
}
const message = useMessage() // 创建消息实例
const updating = ref(false) // 控制加载状态

const updateQuotation = async (status = null) => {
  try {
    updating.value = true // 进入加载状态

    if (status !== null) {
      quotation.value.status = status // 更新状态
    }

    // 确保 `total_price` 保留两位小数
    quotation.value.total_price = parseFloat(quotation.value.total_price.toFixed(2))

    // 确保 `gst` 作为字符串格式
    const payload = {
      ...quotation.value,
      gst: quotation.value.gst ? 'true' : 'false',
    }

    console.log('Sending updated quotation:', payload)

    // 发送 API 请求更新整个 quotation
    const response = await api.updateQuotation(payload)

    console.log('Quotation updated successfully:', response.data)

    // ✅ 显示成功消息
    message.success('Quotation updated successfully!')
  } catch (error) {
    console.error('Failed to update quotation:', error)
    // ❌ 显示错误消息
    message.error('Failed to update quotation. Please try again.')
  } finally {
    updating.value = false // 结束加载状态
  }
}

onMounted(() => {
  fetchQuotationDetails(id.value)
  fetchServiceItems()
})
</script>

<style scoped>
#p_info {
  margin: 20px;
  max-width: 96%;
  display: flex;
}
.part_info {
  margin: 10px;
}

#quotation_info {
  display: flex;
  justify-content: space-between;
}
</style>
