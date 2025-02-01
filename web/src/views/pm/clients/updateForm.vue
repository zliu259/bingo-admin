<template>
  <h1>Update Client</h1>
  <div>
    <n-form :model="form" ref="formRef" label-width="120px">
      <n-form-item label="Client ID" path="client_id">
        <n-input v-model:value="form.client_id" disabled />
      </n-form-item>
      <n-form-item label="Name" path="name">
        <n-input v-model:value="form.name" />
      </n-form-item>
      <n-form-item label="ABN" path="abn">
        <n-input v-model:value="form.abn" />
      </n-form-item>
      <n-form-item label="Contact" path="contact">
        <n-input v-model:value="form.contact" />
      </n-form-item>
      <n-form-item label="Method" path="method">
        <n-select v-model:value="form.method" multiple :options="methodOptions" />
      </n-form-item>
      <n-form-item label="Details" path="details">
        <n-input v-model:value="form.details" />
      </n-form-item>
      <n-form-item label="Note" path="note">
        <n-input v-model:value="form.note" />
      </n-form-item>
      <n-form-item label="Created By" path="created_by">
        <n-input v-model:value="form.created_by" disabled />
      </n-form-item>
      <n-form-item label="Created Time" path="created_time">
        <n-input v-model:value="form.created_time" disabled />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="handleSubmit" :loading="form.loading">Submit</n-button>
        <n-button @click="handleReset">Reset</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useMessage } from 'naive-ui'
import api from '@/api'

export default defineComponent({
  props: {
    client: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const message = useMessage()
    const formRef = ref(null)
    interface ClientForm {
      client_id: string;
      name: string;
      abn: string;
      contact: string;
      method: string | string[];
      details: string;
      note: string;
      created_by: string;
      created_time: string;
      loading: boolean;
    }
    
    const form = ref<ClientForm>({
      client_id: props.client.client_id || '',
      name: props.client.name || '',
      abn: props.client.abn || '',
      contact: props.client.contact || '',
      method: props.client.method || '',
      details: props.client.details || '',
      note: props.client.note || '',
      created_by: props.client.created_by || '',
      created_time: props.client.created_time || '',
      loading: false
    })

    const methodOptions = [
      { label: 'Phone', value: 'Phone' },
      { label: 'Post', value: 'Post' },
      { label: 'Email', value: 'Email' }
    ]

    watch(props.client, (newClient) => {
      form.value = { 
        client_id: newClient.client_id || '',
        name: newClient.name || '',
        abn: newClient.abn || '',
        contact: newClient.contact || '',
        method: newClient.method || '',
        details: newClient.details || '',
        note: newClient.note || '',
        created_by: newClient.created_by || '',
        created_time: newClient.created_time || '',
        loading: false 
      }
      // Ensure method is an array
      if (typeof form.value.method === 'string') {
        form.value.method = form.value.method.split(', ')
      }
    })

    const handleSubmit = () => {
      formRef.value.validate((errors) => {
        if (!errors) {
          form.value.loading = true // 开始加载
          const formData = {
            ...form.value,
            method: Array.isArray(form.value.method) ? form.value.method.join(', ') : form.value.method // Convert method array to string
          }
          api.updateClient(formData)
            .then(() => {
              message.success('Client updated successfully')
              emit('submit', formData)
            })
            .catch(() => {
              message.error('Error updating client')
            })
            .finally(() => {
              form.value.loading = false // 结束加载
            })
        }
      })
    }

    const handleReset = () => {
      formRef.value.resetFields()
    }

    return {
      form,
      formRef,
      handleSubmit,
      handleReset,
      methodOptions
    }
  }
})
</script>