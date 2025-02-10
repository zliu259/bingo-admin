<template>
  <n-dynamic-input v-model:value="customValue" :on-create="onCreate">
    <template #create-button-default> Add Item</template>
    <template #default="{ value }">
      <div style="display: flex; align-items: center; width: 100%">
        <n-select
          v-model:value="value.select"
          :options="selectOptions"
          style="margin-right: 12px; width: 500px"
          @update:value="emitStatistics"
        >
        </n-select>

        <n-input-number
          v-model:value="value.num"
          style="margin-right: 12px; width: 100px"
          @update:value="emitStatistics"
        />
        <n-input v-model:value="value.sum" style="margin-right: 12px; width: 100px" disabled />
      </div>
    </template>
  </n-dynamic-input>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import api from '@/api'

export default defineComponent({
  setup(props, { emit }) {
    const selectOptions = ref([])

    const customValue = ref([
      {
        select: '',
        isCheck: true,
        num: 1,
        item: '',
        unit: '',
        price: '',
      },
    ])

    const emitStatistics = () => {
      customValue.value = customValue.value.map((item) => {
        const selectedOption = selectOptions.value.find((option) => option.value === item.select)
        const price = selectedOption ? selectedOption.price : 0
        const qty = item.num
        const sum = price * qty
        return {
          ...item,
          item: selectedOption ? selectedOption.item : '',
          unit: selectedOption ? selectedOption.unit : '',
          price: price,
          sum: sum,
        }
      })
      const statistics = customValue.value.map((item) => ({
        code: item.select,
        item: item.item,
        unit: item.unit,
        price: item.price,
        qty: item.num,
        sum: item.sum,
      }))
      emit('update-statistics', statistics)
    }

    onMounted(async () => {
      try {
        const response = await api.getServiceItemList()
        selectOptions.value = response.data.map((item) => ({
          label: item.code + ' - ' + item.item + ' - ' + item.unit,
          value: item.code,
          item: item.item,
          unit: item.unit,
          price: item.price,
        }))
      } catch (error) {
        console.error('Failed to fetch service items:', error)
      }
    })

    return {
      customValue,
      onCreate() {
        return {
          isCheck: false,
          num: 1,
          item: '',
          unit: '',
          price: '',
        }
      },
      selectOptions,
      emitStatistics,
    }
  },
})
</script>
