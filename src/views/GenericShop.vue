<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h1 style="text-align: left;">{{ currentShop.name }}</h1>
          <v-tooltip text="Back to Home Page">
            <template v-slot:activator="{ props }">
              <v-btn  v-bind="props" icon="mdi-alpha-x" @click="$emit('shop', undefined)"></v-btn>
            </template>
          </v-tooltip>
        </div>
        <h4 style="color: lightgray">
          <b>Tags: </b>
          <span v-for="(tag, index) of currentShop.tags" :key="index">
            {{ tag === currentShop.tags[currentShop.tags.length - 1] ? tag : tag + ', ' }}
          </span>
        </h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="mdAndUp ? 6 : 12">
        <ShopImage :shop-name="currentShop.name" />
      </v-col>
      <v-col :cols="mdAndUp ? 6 : 12">
        <ShopDescription :description="currentShop.description" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ShopAttitude :shop-name="currentShop.name" :shop-attitude="currentShop.attitude" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ShopQuestInfo :shop-name="currentShop.name" :shop-quest="currentShop.quest" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ShopProducts type="Item" :discount="currentShop.discount" :products="currentShop.items" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ShopProducts type="Service" :discount="currentShop.discount" :products="currentShop.services"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import ShopImage from '../components/ShopImage.vue'
import ShopDescription from '../components/ShopDescription.vue'
import ShopAttitude from '../components/ShopAttitude.vue'
import ShopQuestInfo from '../components/ShopQuestInfo.vue'
import ShopProducts from '../components/ShopProducts.vue'
import type { ShopInterface } from '../types/ShopInterfaces'

const { mdAndUp } = useDisplay();

const props = defineProps<{
  shop: ShopInterface
}>()

const currentShop = computed(() => {
  return props.shop
})
</script>
