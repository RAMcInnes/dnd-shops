<template>
  <div v-html="description" class="textDecoration"></div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  description: string
}>()
</script>
<style>
.textDecoration {
  font-size: large;
  font-family: "Papyrus", "Fantasy";
}
</style>
