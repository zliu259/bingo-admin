<template>
  <div>
    <p>Details for ID: {{ props.id }}</p>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})
</script>
<style scoped></style>
