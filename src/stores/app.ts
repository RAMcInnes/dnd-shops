// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MapShopInterface, ShopInterface } from '../types/ShopInterfaces'

export const useAppStore = defineStore('app', () => {
  const shops = ref<MapShopInterface>({})

  function setShops(newShops: MapShopInterface) {
    shops.value = newShops
  }

  function getShop(shopName: string): ShopInterface | undefined {
    const regexShopName = shopName.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '')
    return shops.value[regexShopName] || undefined
  }

  function getImage(shopName: string) {
    const shop = getShop(shopName)
    return shop ? shop.image : ''
  }

  function getAttitude(shopName: string) {
    const shop = getShop(shopName)
    return shop ? shop.attitude : ''
  }

  function getQuest(shopName: string) {
    const shop = getShop(shopName)
    return shop ? shop.quest : ''
  }

  function getDiscount(shopName: string) {
    const shop = getShop(shopName)
    return shop ? shop.discount : ''
  }

  function updateAttitude(shopName: string, attitude: string) {
    const shop = getShop(shopName)
    return shop ? (shop.attitude = attitude) : ''
  }

  function updateDiscount(shopName: string, discount: number) {
    const shop = getShop(shopName)
    return shop ? (shop.discount = discount) : ''
  }

  function updateQuestComplete(shopName: string, completed: boolean) {
    const shop = getShop(shopName)

    return shop ? (shop.quest.completed = completed) : ''
  }

  function updateSelected(shopName: string, selected: boolean) {
    const shop = getShop(shopName)
    return shop ? (shop.isSelected = selected) : ''
  }

  return {
    setShops,
    getShop,
    getImage,
    getAttitude,
    getQuest,
    getDiscount,
    updateAttitude,
    updateDiscount,
    updateQuestComplete,
    updateSelected
  }
})
