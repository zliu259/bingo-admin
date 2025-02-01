<template>
  <h1>New Clients</h1>
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
import { defineComponent, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { v7 as uuidv7 } from 'uuid'
import { useRouter } from 'vue-router'
import api from '@/api'

export default defineComponent({
  setup(_, { emit }) {
    const message = useMessage()
    const router = useRouter()
    const formRef = ref(null)
    const form = ref({
      client_id: uuidv7(),
      name: '',
      abn: '',
      contact: '',
      method: [],
      details: '',
      note: '',
      created_by: 'current_user', // Replace with actual current user logic
      created_time: new Date().toISOString(),
      loading: false // 添加loading状态
    })

    const methodOptions = [
      { label: 'Phone', value: 'Phone' },
      { label: 'Post', value: 'Post' },
      { label: 'Wechat', value: 'Wechat' },
      { label: 'Email', value: 'Email' }
    ]

    const handleSubmit = () => {
      formRef.value.validate((errors) => {
        if (!errors) {
          form.value.loading = true // 开始加载
          const formData = {
            ...form.value,
            method: form.value.method.join(', ') // Convert method array to string
          }
          api.createClient(formData)
            .then(() => {
              message.success('Client created successfully')
              emit('submit', formData)
              // 跳转到结果页
              //router.push({ name: 'ResultPage' })
            })
            .catch(() => {
              //message.error('Error creating client')
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