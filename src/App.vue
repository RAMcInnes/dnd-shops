<template>
  <v-app>
    <v-main>
      <ShopList @shop="updateSelectedShop" />
      <GenericShop v-if="!!selectedShop" :shop="selectedShop" />
      <WelcomeScreen v-else />
      <v-footer>
        <div class="text-center w-100">
          These shop ideas were created by Steven Chabotte using his
          <a
            href="https://www.drivethrurpg.com/product/472514/Town-Builder--87-Unique-Dropin-Businesses-and-Trades-for-your-TTRPG"
            target="_blank"
          >
            Town Builder
          </a>
          product
        </div>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ShopList from './components/ShopList.vue'
import GenericShop from './views/GenericShop.vue'
import WelcomeScreen from './views/WelcomeScreen.vue'
import { useAppStore } from '@/stores/app'
import type { ShopInterface } from './types/ShopInterfaces'

const store = useAppStore()

const selectedShop = ref()

function updateSelectedShop(shop: ShopInterface) {
  const shopName = shop.name.replace(/ +/g, '')
  selectedShop.value = store.getShop(shopName)
}
</script>
