<template>
  <div class="providers">
    <NPageHeader>
      <NButton type="primary" @click="openCreateDrawer">
        New Provider
      </NButton>
    </NPageHeader>
    
    <Table ref="tableRef" style="margin-top: 10px" @edit-provider="openEditDrawer"></Table>    

    <NDrawer v-model:show="showDrawer" placement="right" :width="400">
      <NDrawerContent>
        <component :is="drawerComponent" 
                  :provider="selectedProvider" 
                  @close="closeDrawer"
                  @refresh="refreshTable" />
      </NDrawerContent>
    </NDrawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NPageHeader, NDrawer, NDrawerContent } from 'naive-ui'
import Table from './table.vue'
import CreateProvider from './createForm.vue'
import EditProvider from './updateForm.vue'

export default defineComponent({
  name: 'Providers',
  components: {
    NButton,
    NPageHeader,
    NDrawer,
    NDrawerContent,
    Table,
    CreateProvider,
    EditProvider
  },
  setup() {
    const router = useRouter()
    const showDrawer = ref(false)
    const drawerComponent = ref(null)
    const selectedProvider = ref(null)
    const tableRef = ref(null)
    
    const openCreateDrawer = () => {
      drawerComponent.value = CreateProvider
      selectedProvider.value = null
      showDrawer.value = true
    }

    const openEditDrawer = (provider: Provider) => {
      drawerComponent.value = EditProvider
      selectedProvider.value = provider
      showDrawer.value = true
    }

    const refreshTable = () => {
      tableRef.value?.fetchProviders()
    }

    const closeDrawer = () => {
      showDrawer.value = false
      refreshTable()
    }

    return {
      showDrawer,
      drawerComponent,
      selectedProvider,
      openCreateDrawer,
      openEditDrawer,
      closeDrawer,
      tableRef,
      refreshTable
    }
  }
})
</script>

<style scoped>
.providers {
  padding: 20px;
}
</style>