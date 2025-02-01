<template>
  <div class="clients">
    <n-button type="info" tertiary @click="openDrawerForNewClient" style="margin-bottom: 10px;">Add Client</n-button>
    <DataTable @edit-client="openDrawerForEditClient" />
    <n-drawer v-model:show="showDrawer" placement="right" width="800" style="padding: 30px;">
      <template #header>
        <h2>{{ isEdit ? 'Edit Client' : 'Add Client' }}</h2>
      </template>
      <component :is="isEdit ? 'updateForm' : 'createForm'" :client="currentClient" @submit="handleFormSubmit" />
    </n-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NButton, NDrawer } from 'naive-ui'
import DataTable from './table.vue'
import createForm from './createForm.vue'
import updateForm from './updateForm.vue'
import { v7 as uuidv7 } from 'uuid'

export default defineComponent({
  components: {
    DataTable,
    createForm,
    updateForm,
    NButton,
    NDrawer
  },
  setup() {
    const showDrawer = ref(false)
    const isEdit = ref(false)
    const currentClient = ref({
      client_id: uuidv7(),
      name: '',
      abn: '',
      contact: '',
      method: [],
      details: '',
      note: '',
      created_by: 'current_user', // Replace with actual current user logic
      created_time: new Date().toISOString()
    })

    const openDrawerForNewClient = () => {
      isEdit.value = false
      currentClient.value = {
        client_id: uuidv7(),
        name: '',
        abn: '',
        contact: '',
        method: [],
        details: '',
        note: '',
        created_by: 'current_user', // Replace with actual current user logic
        created_time: new Date().toISOString()
      }
      showDrawer.value = true
    }

    const openDrawerForEditClient = (client) => {
      isEdit.value = true
      currentClient.value = { ...client }
      showDrawer.value = true
    }

    const handleFormSubmit = (formData) => {
      showDrawer.value = false
      // Refresh the data table or perform other actions after form submission
    }

    return {
      showDrawer,
      isEdit,
      currentClient,
      openDrawerForNewClient,
      openDrawerForEditClient,
      handleFormSubmit
    }
  }
})
</script>

<style scoped>
.clients {
  padding: 20px;
}

</style>