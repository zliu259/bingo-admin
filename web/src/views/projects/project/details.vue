<template>
  <div v-if="project">
    <p>Details for ID: {{ props.id }}</p>
    <n-card title="Project Information" bordered>
      <p><strong>Project ID:</strong> {{ project.id }}</p>
      {{ quotation.client_name }}
      <n-tag :type="statusType">{{ statusLabel }}</n-tag>
      <n-card> {{ formatDate(project.date) }} --> {{ formatDate(project.due) }}
        <n-tag :type="gapDay(project.due) === 'Over Due' ? 'error' : 'warning'">{{
          gapDay(project.due)
        }}</n-tag>
      </n-card>

      <!-- Add more project details as needed -->
    </n-card>
    <n-card :title="`Project Status ${project.active ? '(Active)' : '(Inactive)'}`" bordered>
      <n-steps :current="project.status + 1" :status="'process'">
        <n-step title="Pending" description="Waiting for task allocation" />
        <n-step title="Data Processing" description="Converting raw data into useful information" />
        <n-step title="Working" description="Tasks are being executed" />
        <n-step title="Reviewing" description="Draft is being reviewed" />
        <n-step title="Documenting" description="Deliverable Document is being prepared" />
        <n-step title="Delivering" description="Document is being delivered" />
        <n-step title="Completed" description="Project is completed" />
      </n-steps>
    </n-card>
    <n-card title="Console">
      <div class="button-group">
        <h3>Status Control</h3>
        <n-button-group>
          <n-button round size="large" type="warning"> Back Step </n-button>
          <n-button size="large" type="error"> Error Stop </n-button>
          <n-button round size="large" type="success"> Next Step </n-button>
        </n-button-group>
      </div>
      <div class="button-group">
        <h3>Active Control</h3>
        <n-button-group>
          <n-button round size="large" type="error"> De-active </n-button>
          <n-button size="large" :type="project.active ? 'success' : 'error'" disabled>
            {{ project.active ? '(Active)' : '(Inactive)' }}
          </n-button>
          <n-button round size="large" type="success"> Re-active </n-button>
        </n-button-group>
      </div>
    </n-card>

    <n-card title="File Management" bordered>
      <File :id="props.id" />
    </n-card>
  </div>
  <pre>{{ project }}</pre>
  <pre>{{ quotation }}</pre>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { defineProps } from 'vue'
import api from '@/api'
import File from './file_container.vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const project = ref(null)
const quotation = ref('')

const fetchProjectDetails = async () => {
  try {
    const response = await api.getProjectById(props.id)
    project.value = response.data[0]
  } catch (error) {
    console.error('Failed to fetch project details:', error)
  }
}
const fetchQuotation = async () => {
  try {
    const response = await api.getQuotationById(props.id)
    quotation.value = response.data[0]
  } catch (error) {
    console.error('Failed to fetch quotation:', error)
  }
}
onMounted(() => {
  fetchProjectDetails()
  fetchQuotation()
})

const statusType = computed(() => {
  switch (quotation.value.status) {
    case 1:
      return 'info'
    case 2:
    case 3:
      return 'success'
    default:
      return 'default'
  }
})

const statusLabel = computed(() => {
  switch (quotation.value.status) {
    case 1:
      return 'Waiting for Payment'
    case 2:
      return 'Payment Received'
    case 3:
      return 'Payment Settled'
    default:
      return quotation.value.status
  }
})

const formatDate = (timestamp) => {
  const date = new Date(Number(timestamp))
  return date.toLocaleString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const gapDay = (timestamp) => {
  const date = new Date(Number(timestamp))
  const now = new Date()
  const gap = date - now
  const day = Math.floor(gap / (1000 * 60 * 60 * 24))
  if (day < 0) {
    return 'Over Due'
  }
  return 'Due in ' + day + ' days'
}
</script>
<style scoped></style>
