<template>
  <v-img :cover="true" :src="urlImage" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUpdated, computed } from 'vue'
import { useAppStore } from '@/stores/app'
const props = defineProps(['shopName'])

const store = useAppStore()
const name = computed(() => {
  return props.shopName?.replace(/ +/g, '')
})
const urlImage = ref('')

// Weird hack to get the image to initially load
onMounted(() => {
  const updatedImage = store.getImage(name.value)
  urlImage.value = new URL(updatedImage, import.meta.url).href
})
onUpdated(() => {
  const updatedImage = store.getImage(name.value)
  urlImage.value = new URL(updatedImage, import.meta.url).href
})
</script>
