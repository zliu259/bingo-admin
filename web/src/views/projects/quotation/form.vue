<template>
  <n-scrollbar style="max-height: 100%">
    <n-form ref="formRef" :model="form" label-width="120px">
      <n-card title="Quotation Information" class="info-card">
        <n-form-item label="ID" path="id">
          <n-input v-model:value="form.id" disabled />
        </n-form-item>
        <n-form-item label="Date" path="date">
          <n-date-picker
            v-model:value="timestamp"
            clearable
            type="datetime"
            @update:value="updateTimestamp"
          />
        </n-form-item>
        <n-form-item label="Type" path="type">
          <n-select v-model:value="form.type" placeholder="Select" :options="typeOptions" />
        </n-form-item>
        <n-form-item label="Created By" path="created_by">
          <n-input v-model:value="form.created_by" disabled />
        </n-form-item>
      </n-card>
      <n-card class="info-card" title="Client Information">
        <n-form-item label="Client ID" path="client_id">
          <n-select v-model:value="form.client_id" placeholder="Select" :options="clientOptions" />
        </n-form-item>
        <n-form-item label="Name" path="client_name">
          <n-input v-model:value="form.client_name" />
        </n-form-item>
        <n-form-item label="Contact" path="client_contact">
          <n-input v-model:value="form.client_contact" />
        </n-form-item>
        <n-form-item label="Details" path="client_details">
          <n-input v-model:value="form.client_details" />
        </n-form-item>
      </n-card>
      <n-card class="info-card" title="Provider Information">
        <n-form-item label="Provider ID" path="provider_id">
          <n-select
            v-model:value="form.provider_id"
            :options="providerOptions"
            placeholder="Select"
          />
        </n-form-item>
      </n-card>
      <n-card class="info-card" title="Work Scope">
        <n-form-item label="Work Load in hours" path="load">
          <n-input-number v-model:value="form.load" />
        </n-form-item>
        <n-form-item label="Statistics" path="statistics">
          <Subtable @update-statistics="updateStatistics" />
        </n-form-item>
        <n-form-item label="Description" path="description">
          <n-input v-model:value="form.description" />
        </n-form-item>
      </n-card>
      <n-card class="info-card" title="Price Information">
        <n-form-item label="Price" path="price">
          <n-input v-model:value="form.price" />
        </n-form-item>
        <n-form-item label="GST" path="gst">
          <n-radio-group v-model:value="form.gst">
            <n-radio-button value="true">With GST</n-radio-button>
            <n-radio-button value="false">No GST</n-radio-button>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="Total Price" path="total_price">
          <n-input :value="totalPrice" />
        </n-form-item>
      </n-card>

      <n-form-item>
        <n-button type="primary" :loading="loading" @click="handleSubmit">Submit</n-button>
      </n-form-item>
    </n-form>
    <!--  <pre>{{ form }}</pre> -->
    <pre>{{ form }}</pre>
  </n-scrollbar>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NButton,
  NScrollbar,
  NDatePicker,
  NSelect,
  NSpin,
} from 'naive-ui'
import { v7 as uuidv7 } from 'uuid'
import Subtable from './subtable.vue'

import api from '@/api'

const form = ref({
  id: uuidv7(),
  client_name: '',
  client_contact: '',
  client_details: '',
  client_id: '',
  provider_id: '',
  date: '',
  type: '',
  status: 0,
  load: 1,
  statistics: '',
  description: '',
  price: '',
  gst: '',
  total_price: '',
  created_by: '',
})

const providerOptions = ref([])
const clientOptions = ref([])
const typeOptions = ref([
  { label: 'Interpreting', value: 'Interpreting' },
  { label: 'Translation', value: 'Translation' },
  { label: 'Certified copies', value: 'Certified copies' },
  { label: 'Other', value: 'Other' },
])
const timestamp = ref(new Date().getTime())
const loading = ref(false)

const totalPrice = computed(() => {
  const price = parseFloat(form.value.price) || 0
  const gst = form.value.gst === 'true' ? 0.1 : 0
  return (price * (1 + gst)).toFixed(2)
})

watch(totalPrice, (newTotalPrice) => {
  form.value.total_price = newTotalPrice
})

const updateTimestamp = (value) => {
  form.value.date = value ? new Date(value).getTime().toString() : ''
}

const updateStatistics = (statistics) => {
  form.value.statistics = JSON.stringify(statistics)
  form.value.price = calculateTotalSum(statistics)
}

const calculateTotalSum = (statistics) => {
  return statistics.reduce((total, item) => total + item.sum, 0).toFixed(2)
}

const fetchClientDetails = async (clientId) => {
  try {
    if (clientId) {
      const response = await api.getClientById(clientId)
      const client = response.data[0]
      form.value.client_name = client.name
      form.value.client_contact = client.contact
      form.value.client_details = client.details
    }
  } catch (error) {
    console.error('Failed to fetch client details:', error)
  }
}

watch(
  () => form.value.client_id,
  (newClientId) => {
    if (newClientId) {
      fetchClientDetails(newClientId)
    }
  }
)

watch(
  () => form.value.provider_id,
  (newProviderId) => {
    console.log('Selected provider ID:', newProviderId)
  }
)

onMounted(async () => {
  try {
    const provider_response = await api.getProviderList()
    const client_response = await api.getClientList()
    const name = await api.getUserInfo()
    providerOptions.value = provider_response.data.map((provider) => ({
      label: provider.name,
      value: provider.id,
    }))
    clientOptions.value = client_response.data.map((client) => ({
      label: client.name,
      value: client.client_id,
    }))
    form.value.created_by = name.data.username
  } catch (error) {
    console.error('Failed to fetch provider options:', error)
  }
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await api.createQuotation(form.value)
    alert('Quotation created successfully')
  } catch (error) {
    console.error('Failed to create quotation:', error)
    alert('Failed to create quotation')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Add any custom styles here */
.info-card {
  margin: 10px;
  width: 98%;
}
</style>
