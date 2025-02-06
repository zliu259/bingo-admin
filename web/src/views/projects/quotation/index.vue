<template>
  <n-scrollbar style="max-height: 100%">
    <n-split direction="horizontal" min="400px" max="1000px" default-size="800px">
      <template #1>
        <Table @view-details="handleViewDetails" />
        <div style="margin-top: 20px; padding: 20px">
          <Form />
        </div>
      </template>
      <template #2>
          <Details v-if="selectedId" :id="selectedId" />
      </template>
    </n-split>
  </n-scrollbar>
</template>

<script setup>
import { ref } from 'vue'
import Table from './table.vue'
import Details from './details.vue'
import Form from './form.vue'

const selectedId = ref(null)

const handleViewDetails = (id) => {
  selectedId.value = id
}
</script>