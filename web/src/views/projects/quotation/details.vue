<template>

    <div>
        <div v-if="loading" style="margin: 200px;">
            <n-spin size="large">
                <template #description>
                    <h1>Loading<br>加载中</h1>
                </template>
            </n-spin>
        </div>
        <div v-else>
            <n-card title="Quotation Information" style="margin: 20px; max-width: 96%">
                <div id="quotation_info">
                    <div style="width : 400px">
                        <h2><n-tag v-if="quotation.status === -1" type="default" :bordered="false">Closed</n-tag>
                            <n-tag v-else-if="quotation.status === 0" type="warning" :bordered="false">Pending</n-tag>
                            <n-tag v-else-if="quotation.status === 1" type="success" :bordered="false">Accepted</n-tag>
                            <n-tag v-else-if="quotation.status === 2" type="info" :bordered="false">Completed</n-tag>
                            {{ quotation.id }}
                        </h2><br>

                        <div style="width : 40%">
                            {{ quotation.type }}<br>
                            {{ quotation.date }}
                        </div>
                    </div>
                    <div style="width : 150px">
                        <n-alert :show-icon="false" type="info" style="width : 150px">
                            <h1>Total Price<br>
                                <n-tag v-if="quotation.gst === 'true'" type="warning" :bordered="false">With GST</n-tag>
                                <n-tag v-else-if="quotation.status === 'false'" type="info" :bordered="false">No
                                    GST</n-tag>
                            </h1>
                            <h1>AU$ {{ quotation.total_price }}</h1>
                        </n-alert>
                    </div>
                    <div style="width : 180px ; margin-left: 20px ; ">
                        <n-alert :show-icon="false" :bordered=false>

                            <n-button-group vertical>
                                <n-button type="success">
                                    Accept Quotation
                                </n-button><br>
                                <n-button type="info">
                                    Payment Received
                                </n-button><br>
                                <n-button type="error">
                                    Quotation Closed
                                </n-button>
                            </n-button-group>


                        </n-alert>
                    </div>
                </div>



            </n-card>
            <div id="info">
                <n-card class="part_info" title="Client Information">
                    Client ID: {{ quotation.client_id }}<br>
                    Client: {{ quotation.client_name }}<br>
                    Contact: {{ quotation.client_contact }}<br>
                    Details: {{ quotation.client_details }}
                </n-card>
                <n-card class="part_info" title="Provider Information">
                    Provider ID: {{ quotation.provider_id }}<br>
                </n-card>
            </div>



            <pre>{{ quotation }}</pre>
            <!-- 这里可以添加更多详细信息的展示 -->
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { defineProps } from 'vue'
import api from '@/api'

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

const id = ref(props.id)
const quotation = ref(null)
const loading = ref(true)

const fetchQuotationDetails = async (quotationId) => {
    loading.value = true
    try {
        const response = await api.getQuotationById(quotationId)
        quotation.value = response.data[0]
    } catch (error) {
        console.error('Error fetching quotation details:', error)
    } finally {
        loading.value = false
    }
}

watch(() => props.id, (newId) => {
    id.value = newId
    fetchQuotationDetails(newId)
})

onMounted(() => {
    fetchQuotationDetails(id.value)
})
</script>

<style scoped>
.part_info {
    margin: 20px;
    min-width: 400px;
    max-width: 600px;
}

#info {
    display: flex;
}

#quotation_info {
    display: flex;
    margin: 20px;
}
</style>