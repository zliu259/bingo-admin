<template>
  <div v-if="project">
    <p>Details for ID: {{ props.id }}</p>
    <n-card :title="`Project Status ${project.active ? '(Active)' : '(Inactive)'}`" bordered>
      <n-steps :current="project.status" :status="'process'">
        <n-step title="Pending" description="Waiting for task allocation" />
        <n-step title="Data Processing" description="Converting raw data into useful information" />
        <n-step title="Working" description="Task is being executed" />
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
    <n-card title="Project Information" bordered>
      <p><strong>Project Name:</strong> {{ project.id }}</p>
      <p><strong>Description:</strong> {{ project.task }}</p>
      <!-- Add more project details as needed -->
    </n-card>
    <n-card title="File Management" bordered>
      <File :id="props.id" />
    </n-card>
  </div>
  <pre>{{ project }}</pre>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

const fetchProjectDetails = async () => {
  try {
    const response = await api.getProjectById(props.id)
    project.value = response.data[0]
  } catch (error) {
    console.error('Failed to fetch project details:', error)
  }
}

onMounted(() => {
  fetchProjectDetails()
})
</script>
<style scoped></style>
