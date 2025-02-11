<template>
  <n-scrollbar style="max-height: 100%">
    <n-split direction="horizontal" min="400px" max="1000px" default-size="800px">
      <template #1>
        <n-button @click="showModal = true"> New Quotation </n-button>
        <n-modal v-model:show="showModal">
          <n-card
            style="width: 1000px"
            title="Create New Quotation"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
          >
            <Form class="form" />
          </n-card>
        </n-modal>
        <Table @view-details="handleViewDetails" />
      </template>
      <template #2>
        <Details v-if="selectedId" :id="selectedId" :key="selectedId" />
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

const showModal = ref(false)

const handleViewDetails = (id) => {
  selectedId.value = id
}
</script>

<style scoped>
.form {
  padding: 10px;
  width: 95%;
}
</style>
