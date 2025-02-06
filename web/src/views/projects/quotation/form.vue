<template>
  <n-scrollbar style="max-height: 100%">

    <n-form ref="formRef" :model="form" label-width="120px">
      <n-card title="Quotation Information" class="info-card">
        <n-form-item label="ID" path="id">
          <n-input v-model:value="form.id" disabled />
        </n-form-item>
        <n-form-item label="Date" path="date">

          <n-date-picker v-model:value="timestamp" clearable type="datetime" />

        </n-form-item>
        <n-form-item label="Type" path="type">
          <n-select
            v-model:value="form.type"
            placeholder="Select"
          />
        </n-form-item>
        <n-form-item label="Created By" path="created_by">
          <n-input v-model:value="form.created_by" />
        </n-form-item>
      </n-card>
      <n-card class="info-card" title="Client Information">
        <n-form-item label="Client ID" path="client_id">
          <n-select v-model:value="form.client_id" placeholder="Select" :options="clientOptions"/>
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
          <n-select v-model:value="form.provider_id" :options="providerOptions" placeholder="Select" />
        </n-form-item>
      </n-card>
      <n-card class="info-card" title="Work Scope">
        <n-form-item label="Work Load in hours" path="load">
          <n-input-number v-model:value="form.load" />
        </n-form-item>
        <n-form-item label="Statistics" path="statistics">
          <Subtable />

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
          <n-input v-model:value="form.total_price" />
        </n-form-item>
      </n-card>

      <n-form-item>
        <n-button type="primary" @click="handleSubmit">Submit</n-button>
      </n-form-item>
    </n-form>
    <pre>{{ form }}</pre>
  </n-scrollbar>
</template>

<script setup>
import { defineComponent, ref } from 'vue'
import { NForm, NFormItem, NInput, NInputNumber, NButton, NScrollbar } from 'naive-ui'
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
  created_by: ''
})

const providerOptions = ref([])
const clientOptions = ref([])
const timestamp = ref(new Date())


onMounted(async () => {
  try {
    const provider_response = await api.getProviderList()
    const client_response = await api.getClientList()
    providerOptions.value = provider_response.data.map(provider => ({
      label: provider.name,
      value: provider.id
    }))
    clientOptions.value = client_response.data.map(client => ({
      label: client.name,
      value: client.id
    }))
  } catch (error) {
    console.error('Failed to fetch provider options:', error)
  }
})


</script>

<style scoped>
/* Add any custom styles here */
.info-card {
  margin: 10px;
}
</style>