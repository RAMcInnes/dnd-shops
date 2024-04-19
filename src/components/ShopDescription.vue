<template>
  <div>
    {{ description }}
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  description: string
}>()
</script>
