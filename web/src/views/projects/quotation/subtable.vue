<template>
  <n-dynamic-input v-model:value="customValue" :on-create="onCreate">
    <template #create-button-default>
      Add Item
    </template>
    <template #default="{ value }">
      <div style="display: flex; align-items: center; width: 100%">
        <n-select
          v-model:value="value.select"
          :options="selectOptions"
          style="margin-right: 12px; width: 350px">
        </n-select>

        <n-input-number
          v-model:value="value.num"
          style="margin-right: 12px; width: 160px"
        />
      </div>
    </template>
  </n-dynamic-input>
  <br>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const selectOptions = ref([
      { label: 'Translation Chinese (Characters)', value: 'Translation Chinese (Characters)' },
      { label: 'Translation English (Words)', value: 'Translation English (Words)' },
      { label: 'ID Translation (Item)', value: 'ID Translation (Item)' },
      { label: 'Interpreting (day)', value: 'Interpreting (day)' },
      { label: 'Audio Transcription (sec)', value: 'Audio Transcription (sec)' },
      { label: 'Video Transcription (sec)', value: 'Video Transcription (sec)' },
      { label: 'Others', value: 'Others' },
    ])

    return {
      customValue: ref([
        {
          select: '',
          isCheck: true,
          num: 1,
        }
      ]),
      onCreate() {
        return {
          isCheck: false,
          num: 1,
        }
      },
      selectOptions
    }
  }
})
</script>