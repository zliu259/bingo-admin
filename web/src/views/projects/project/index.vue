<template>
  <n-space vertical>
    <Table @view-details="handleViewDetails" />
    <Details v-if="selectedId" :id="selectedId" />
  </n-space>
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