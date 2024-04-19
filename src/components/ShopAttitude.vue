<template>
  <div>
    Current Attitude:
    <span :style="attitudeColor" class="verticalRightLine"> {{ attitude }} </span>
    Haggle Roll DC:
    <span :style="attitudeColor" class="verticalRightLine"> {{ haggleRollDC < 100 ? haggleRollDC : 'N/A' }} </span>
    Current Discount:
    <span :style="attitudeColor"> {{ currentDiscount() }}% </span> (max: {{ maxCurrentDiscount }}%)
  </div>
  <br />
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>Haggle Roll Information</v-expansion-panel-title>
      <v-expansion-panel-text>
        <b>Haggle Roll</b><br />
        <p>
          A Player may try to haggle down the prices of the shop by making a relevant Charisma
          Roll.<br />
          But be careful! If the Player fails the Haggle Roll by too much, the shop owner may become
          <span style="color: orange">Annoyed</span> or even
          <span style="color: red">Aggravated</span>.<br />
          The DC of the roll is determined by the Attitude of the shop owner.<br />
          <span style="color: orange">Annoyed</span> - DC: 25
          <span style="color: grey" class="verticalLeftLine">Neutral</span> - DC: 20
          <span style="color: lightgreen" class="verticalLeftLine">Friendly</span> - DC: 15<br />
        </p>
        <br />
        <b>Haggle Roll (Results)</b><br />
        If the Player fails the Haggle Roll by 5+, the shop owner will become
        <span style="color: orange">Annoyed</span>.<br />
        <span class="tab"
          >If the shop owner is already <span style="color: orange">Annoyed</span> and the Player
          fails the Haggle roll by 10+, the shop owner will become
          <span style="color: red">Aggravated</span>.</span
        ><br />
        <span class="tab"
          >An <span style="color: red">Aggravated</span> shop owner will
          <u>raise their prices by 25% and their Attitude cannot be changed further!</u></span
        ><br />
        If the Player fails the Haggle Roll by 4 or less, the shop owner will not change their
        prices.<br />
        For every point above the DC the Player rolls, the prices will be discounted by 5% up to a
        maximum discount determined by the shop owner's Attitude.<br />
        <i>Max Discount</i><br />
        <span style="color: orange">Annoyed</span> - 10%
        <span style="color: grey" class="verticalLeftLine">Neutral</span> - 25%
        <span style="color: lightgreen" class="verticalLeftLine">Friendly</span> - 50%<br />
        <br />
        <v-text-field
          v-model="haggleRollvModel"
          clearable
          label="Player's Haggle Roll"
          prepend-icon="mdi-dice-d20-outline"
          variant="underlined"
          type="number"
          :disabled="haggleRollDC === 101"
          @update:focused="updateHaggleRoll"
        ></v-text-field>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const props = defineProps<{
  shopName: string
  shopAttitude: string
}>()

const haggleRollvModel = ref<number>()
const playersHaggleRoll = ref<number>()
const name = computed(() => {
  return props.shopName?.replace(/ +/g, '')
})
const attitude = computed(() => {
  return store.getAttitude(name.value)
})

/*
 * currentDiscount gets called more than once.
 * I believe this happens because when the store updates it triggers another call of currentDiscount.
 * This leads to attitude being updated multiple times and the discount being calculated multiple times.
 * Neutral -> Annoyed -> Aggravated (rather than one step at a time)
 *
 * I don't love this fix, but it works for now.
 */
let uniqueRoll = false

function updateHaggleRoll(focus: boolean) {
  // Only update playerHaggleRoll when Player clicks away from the input field
  if (!focus) {
    uniqueRoll = true
    playersHaggleRoll.value = haggleRollvModel.value
  }
}

const haggleRollDC = computed(() => {
  switch (attitude.value) {
    case 'Aggravated':
      return 101 // N/A
    case 'Annoyed':
      return 25
    case 'Neutral':
      return 20
    case 'Friendly':
      return 15
    default:
      return 0
  }
})

const maxCurrentDiscount = computed(() => {
  switch (attitude.value) {
    case 'Aggravated':
      return -25
    case 'Annoyed':
      return 10
    case 'Neutral':
      return 25
    case 'Friendly':
      return 50
    default:
      return 0
  }
})

// Known issue: currentDiscount doesn't seem to run if the same value is inputted twice
function currentDiscount() {
  const storeDiscount = store.getDiscount(name.value)
  let currentDiscount: number = storeDiscount ? storeDiscount : 0
  if (playersHaggleRoll.value === undefined || !uniqueRoll) {
    uniqueRoll = false
    haggleRollvModel.value = 0
    return currentDiscount
  }

  if (
    (attitude.value === 'Friendly' || attitude.value === 'Neutral') &&
    playersHaggleRoll.value < haggleRollDC.value - 5
  ) {
    store.updateAttitude(name.value, 'Annoyed')
  } else if (attitude.value === 'Annoyed' && playersHaggleRoll.value < haggleRollDC.value - 10) {
    store.updateAttitude(name.value, 'Aggravated')
  }

  const percent = (playersHaggleRoll.value - haggleRollDC.value) * 5
  // If discount is higher than the current discount, set discount to the new discount
  if (percent > currentDiscount) {
    currentDiscount = percent
  }
  // If discount is higher than the max discount, set discount to max discount
  if (percent > maxCurrentDiscount.value) {
    currentDiscount = maxCurrentDiscount.value
  }
  // If current discount is higher than the max discount, set discount to max discount
  if (currentDiscount > maxCurrentDiscount.value) {
    currentDiscount = maxCurrentDiscount.value
  }

  // Update discount in store so that it can be used in the ShopItems and ShopService components
  store.updateDiscount(name.value, currentDiscount)
  uniqueRoll = false
  return currentDiscount
}

const attitudeColor = computed(() => {
  switch (attitude.value) {
    case 'Aggravated':
      return 'color:red'
    case 'Annoyed':
      return 'color:orange'
    case 'Neutral':
      return 'color:grey'
    case 'Friendly':
      return 'color:lightgreen'
    default:
      return 'color:yellow'
  }
})
</script>

<style scoped>
.verticalRightLine {
  padding-right: 5px;
  border-right: 2px solid white;
  height: 100%;
}
.verticalLeftLine {
  padding-left: 5px;
  border-left: 2px solid white;
  height: 100%;
}
.tab {
  display: inline-block;
  margin-left: 2em;
}
</style>
