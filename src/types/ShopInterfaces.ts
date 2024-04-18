export interface MapShopInterface {
  [key: string]: ShopInterface
}

export interface ShopInterface {
  name: string
  image: string
  description: string
  items: ShopProductInterface[]
  services: ShopProductInterface[]
  attitude: string
  discount: number
  tags: string[]
  quest: ShopQuestInterface
  isSelected: boolean
}

export interface ShopProductInterface {
  name: string
  price: number
  currency: string
}

export interface DiscountedProductInterface {
  name: string
  formattedPrice: string
  price: number
}

export interface CartProductInterface extends DiscountedProductInterface {
  quantity: number
}

export interface ShopQuestInterface {
  name: string
  description: string
  reward: string
  completed: boolean
}
