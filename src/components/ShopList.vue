<template>
  <v-navigation-drawer
    permanent
    :rail="smAndDown"
    width="300">
    <br />
    <div v-if="mdAndUp" style="display: flex">
      <v-select
        v-model="searchType"
        label="Search Type"
        :items="['All', 'Tags', 'Item', 'Service', 'Quests']"
        density="compact"
        variant="underlined"
        :style="{ width: '5%' }"
      />
      <v-text-field
        label="Search Shops"
        density="compact"
        variant="underlined"
        @update:modelValue="updateShownShops"
      />
    </div>
    <v-divider />
    <div v-for="(shop, index) of shownShops" :key="index">
      <v-hover v-slot="{ isHovering, props }">
        <v-list-item
          v-bind="props"
          :key="shop.name"
          :title="shop.name"
          :prependIcon="shop.icon"
          :active="shop.name === selectedShop"
          color="yellow"
          @click="highlightSelectedShop(shop)"
        >
          <template v-slot:append>
            <v-icon
              v-if="isHovering || shop.isSelected"
              icon="mdi-store"
              :color="shop.isSelected ? 'yellow' : ''"
              @click="addSelectedIconToShop(shop)"
            />
          </template>
        </v-list-item>
      </v-hover>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useAppStore } from '../stores/app'
import shops from '../shops'
import type { ShopInterface } from '../types/ShopInterfaces'

const { smAndDown, mdAndUp } = useDisplay();

const store = useAppStore()
const shopsArray = Array<ShopInterface>()
const shownShops = ref<ShopInterface[]>()
const searchType = ref('All')
const selectedShop = ref('');

const emits = defineEmits(['shop']);

onMounted(() => {
  for (const shop in shops) {
    shopsArray.push(shops[shop as keyof typeof shops])
  }
  store.setShops(shops)
  shownShops.value = shopsArray
})

const highlightSelectedShop = (shop: ShopInterface) => {
  selectedShop.value = shop.name;

  emits('shop', shop)
}

const addSelectedIconToShop = (shop: ShopInterface) => {
  shop.isSelected = !shop.isSelected
  store.updateSelected(shop.name, shop.isSelected)

  // This works, but is wonky. It doesn't happen right away. Idk, it's weird.
  shownShops.value = shopsArray.sort(function(x, y) {
        // true values first
        return (x.isSelected === y.isSelected)? 0 : x.isSelected? -1 : 1;
    })
}

function updateShownShops(searchTerm: string) {
  if (searchTerm === '') {
    // Reset shownShops to all shops
    shownShops.value = shopsArray
    return
  }

  shownShops.value = shopsArray.filter((shop) => {
    // Search Shop Name
    if (searchType.value === 'All') {
      if (shop.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        // console.log('NAME MATCHED');
        return shop
      }
    }

    // // Search Shop Tags
    if (searchType.value === 'Tags' || searchType.value === 'All') {
      for (const tag of shop.tags) {
        if (tag.toLowerCase().includes(searchTerm.toLowerCase())) {
          // console.log('TAG MATCHED');
          return shop
        }
      }
    }

    // // Search Shop Items
    if (searchType.value === 'Items' || searchType.value === 'All') {
      for (const item of shop.items) {
        if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          // console.log('ITEM MATCHED');
          return shop
        }
      }
    }

    // // Search Shop Services
    if (searchType.value === 'Services' || searchType.value === 'All') {
      for (const service of shop.services) {
        if (service.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          // console.log('SERVICE MATCHED');
          return shop
        }
      }
    }
  })
}
</script>
