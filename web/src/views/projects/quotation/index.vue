<template>
  <n-card>
    <n-split direction="horizontal" min="800px" max="1200px" default-size="800px">
      <template #1>
        <Table @view-details="handleViewDetails" />
      </template>
      <template #2>
        <Details v-if="selectedId" :id="selectedId" />
      </template>
    </n-split>
  </n-card>
</template>

<script setup>
import { ref } from 'vue'
import Table from './table.vue'
import Details from './details.vue'

const selectedId = ref(null)

const handleViewDetails = (id) => {
  selectedId.value = id
}
</script>