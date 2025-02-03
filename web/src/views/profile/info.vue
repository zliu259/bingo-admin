<template>
    <div v-if="userInfo">
      <n-card title="Account Info" bordered style="padding: 20px;">
        <h3>ID: {{ userInfo.alias }}</h3>
        <h3>User Name: {{ userInfo.username }}</h3>
        <br>
        <n-tag :type="userInfo.is_active ? 'success' : 'default'" round :bordered="false">
          {{ userInfo.is_active ? 'Actived' : 'Inactive' }}
        </n-tag>
      </n-card>
      <n-card title="Accreditation Info" bordered style="padding: 20px; margin-top: 10px;" >
        <n-flex>
          <n-card title="Current Accreditation" style="width: 45%;">
            <n-image height="200" :src="imageUrl" />
          </n-card>
          <n-card title="Update Accreditation" style="width: 45%;">
            <Upload :alias="userInfo.alias" />
          </n-card>
        </n-flex>
      </n-card>
      <pre v-if="userInfo">{{ userInfo }}</pre>
    </div>
  </template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import Upload from './upload.vue'

import api from '@/api'

export default defineComponent({
    components: {
        Upload
    },
    setup() {
        const userInfo = ref(null)

        const fetchUserInfo = async () => {
            try {
                const response = await api.getUserInfo()
                userInfo.value = response.data
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching user info', error)
            }
        }

        onMounted(() => {
            fetchUserInfo()
        })

        const imageUrl = computed(() => {
            return userInfo.value ? `https://storage.bingocommunications.com.au/Accreditation/${userInfo.value.alias}/${userInfo.value.alias}.png` : ''
        })

        return {
            userInfo,
            imageUrl,
        }
    }
})
</script>