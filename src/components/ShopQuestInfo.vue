<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <span><b>Quest:</b> {{ shopQuest?.name }}</span>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-textarea
          :model-value="shopQuest.description"
          variant="outlined"
          readonly
          no-resize
          auto-grow
        ></v-textarea>
        <div>
          <b>Reward:</b>
          <br />
          {{ shopQuest?.reward }}
          <br />
          The shop owner's attitude will change to <span style="color: lightgreen">Friendly</span>.
          <br /><br />
          <input
            v-model="checked"
            type="checkbox"
            id="checkbox"
            @change="updateQuestComplete($event)"
          />
          <label for="checkbox"> Quest Completed</label>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import type {ShopQuestInterface} from '../types/ShopInterfaces';
const store = useAppStore()
const props = defineProps<{
  shopName: string
  shopQuest: ShopQuestInterface
}>()

const name = computed(() => {
  return props.shopName?.replace(/ +/g, '')
})
const checked = computed(() => {
  const currentQuest = store.getQuest(name.value)
  return currentQuest ? currentQuest.completed : false
})

function updateQuestComplete(event: Event) {
  if (event.target instanceof HTMLInputElement && event.target.checked) {
    store.updateQuestComplete(name.value, true)
    store.updateAttitude(name.value, 'Friendly')
  } else {
    // This else isn't needed, but leave here for testing purposes
    store.updateQuestComplete(name.value, false)
    store.updateAttitude(name.value, 'Neutral')
  }
}
</script>
