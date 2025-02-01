<template>
  <div>
    <n-page-header title="Edit Provider" />
    <n-form :model="form" :rules="rules" ref="formRef">
      <n-form-item label="Name" path="name">
        <n-input v-model:value="form.name" />
      </n-form-item>
      <n-form-item label="ABN" path="abn">
        <n-input v-model:value="form.abn" />
      </n-form-item>
      <n-form-item label="Address" path="address">
        <n-input v-model:value="form.address" />
      </n-form-item>
      <n-form-item label="Contact" path="contact">
        <n-input v-model:value="form.contact" />
      </n-form-item>
      <n-form-item label="Bank" path="bank">
        <n-input v-model:value="form.bank" />
      </n-form-item>
      <n-form-item label="BSB" path="bsb">
        <n-input v-model:value="form.bsb" />
      </n-form-item>
      <n-form-item label="Account" path="account">
        <n-input v-model:value="form.account" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="handleSubmit">Submit</n-button>
        <n-button @click="$emit('close')">Cancel</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage, NForm, NFormItem, NInput, NButton, NPageHeader } from 'naive-ui'
import api from '@/api'

export default defineComponent({
  name: 'EditProvider',
  props: {
    provider: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const router = useRouter()
    const message = useMessage()
    const formRef = ref(null)
    const form = ref({ ...props.provider })
    const rules = {
      name: { required: true, message: 'Name is required', trigger: 'blur' },
      abn: { required: true, message: 'ABN is required', trigger: 'blur' },
      address: { required: true, message: 'Address is required', trigger: 'blur' },
      contact: { required: true, message: 'Contact is required', trigger: 'blur' },
      bank: { required: true, message: 'Bank is required', trigger: 'blur' },
      bsb: { required: true, message: 'BSB is required', trigger: 'blur' },
      account: { required: true, message: 'Account is required', trigger: 'blur' }
    }

    const handleSubmit = () => {
      formRef.value.validate(async (valid: boolean) => {
        if (valid) {
          try {
            await api.updateProvider(form.value.provider_id, form.value)
            message.success('Provider updated successfully')
            emit('close')
          } catch (error) {
            message.error('Error updating provider')
          }
        }
      })
    }

    return {
      form,
      rules,
      formRef,
      handleSubmit
    }
  }
})
</script>