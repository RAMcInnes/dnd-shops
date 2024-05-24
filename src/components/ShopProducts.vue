<template>
  <v-data-table v-if="discountedProducts.length > 0" :headers="headers" :items="discountedProducts" item-value="name" items-per-page="5">
    <template v-slot:item.actions="{ item }">
      <v-btn icon="mdi-cart-arrow-down" variant="text" @click="addProductToCart(item)"></v-btn>
    </template>
  </v-data-table>
  <br v-if="discountedProducts.length > 0" />
  <v-btn v-if="discountedProducts.length > 0" @click="openCart()" prepend-icon="mdi-cart"> Buy {{ type }} ({{ cart.length }}) </v-btn>
  <v-dialog v-model="dialog" width="auto">
    <v-card>
      <v-card-title> {{ type }} to Purchase </v-card-title>
      <v-list>
        <v-list-item
          v-for="(product, index) in dialogCart"
          :key="index"
          :style="index % 2 === 0 ? 'background-color: #2f2f2f;' : 'background-color: #4a4a4a;'"
        >
          <template v-slot:append>
            <v-tooltip text="Remove Item">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-cart-arrow-up"
                  variant="text"
                  @click="removeProductFromCart(product)"
                ></v-btn>
              </template>
            </v-tooltip>
          </template>
          <v-list-item-content>
            <v-list-item-title
              >{{ product.name }} x
              <span class="ms-auto">{{ product.quantity }}</span></v-list-item-title
            >
            <v-list-item-subtitle>{{ reformatPrice(product.price) }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <b>Total:</b> {{ calculateTotal() }}
          <span v-if="discount !== 0" :style="discount > 0 ? 'color: green;' : 'color: red;'">
            ({{ discount }}% Discount)
          </span>
        </v-list-item>
      </v-list>

      <template v-slot:actions>
        <v-btn text="Close" @click="dialog = false"></v-btn>
        <v-btn class="ms-auto" text="Clear Cart" @click="clearCart()"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type {
  ShopProductInterface,
  CartProductInterface,
  DiscountedProductInterface
} from '../types/ShopInterfaces'

const props = defineProps<{
  type: string
  discount: number
  products: ShopProductInterface[]
}>()

const cart = ref<DiscountedProductInterface[]>([] as DiscountedProductInterface[])
const dialogCart = ref<CartProductInterface[]>([] as CartProductInterface[])
const dialog = ref(false)

const headers = [
  { title: `${props.type} Name`, key: 'name', width: '50%' },
  { title: 'Price', key: 'formattedPrice', width: '25%' },
  { title: 'Add to Cart', key: 'actions', sortable: false, width: '25%' }
]

const discountedProducts = computed(() => {
  return props.products?.map((product) => {
    const priceInCP = calculateCP(product.price, product.currency)
    let discountPrice = priceInCP
    if (props.discount !== 0) {
      discountPrice = Math.ceil(priceInCP - (props.discount / 100) * priceInCP)
    }

    return {
      name: product.name,
      formattedPrice:
        reformatPrice(discountPrice) +
        (props.discount !== 0 ? ` (${props.discount}% Discount)` : ''),
      price: discountPrice
    }
  })
})

function addProductToCart(product: DiscountedProductInterface) {
  cart.value.push(product)
}

function removeProductFromCart(product: CartProductInterface) {
  const index = cart.value.findIndex(
    (cartItem: DiscountedProductInterface) => cartItem.name === product.name
  )
  cart.value.splice(index, 1)
  const dialogCartItem = dialogCart.value.find(
    (cartItem: CartProductInterface) => cartItem.name === product.name
  )
  if (dialogCartItem) {
    dialogCartItem.quantity -= 1
    if (dialogCartItem.quantity === 0) {
      dialogCart.value = dialogCart.value.filter(
        (cartItem: CartProductInterface) => cartItem.name !== product.name
      )
    }
  }
}

function openCart() {
  dialog.value = true
  dialogCart.value = []

  cart.value.forEach((product: DiscountedProductInterface) => {
    const dialogCartItem = dialogCart.value.find(
      (cartItem: CartProductInterface) => cartItem.name === product.name
    )
    if (dialogCartItem) {
      dialogCartItem.quantity += 1
    } else {
      dialogCart.value.push({ ...product, quantity: 1 })
    }
  })
}

function clearCart() {
  cart.value = []
  dialogCart.value = []
  dialog.value = false
}

function calculateTotal() {
  let totalPrice = 0
  dialogCart.value.forEach((product: CartProductInterface) => {
    totalPrice += product.price * product.quantity
  })

  return reformatPrice(totalPrice)
}

function calculateCP(price: number, currency: string) {
  switch (currency.toUpperCase()) {
    case 'CP':
      return price
    case 'SP':
      return price * 10
    case 'GP':
      return price * 100
    default:
      return price
  }
}

function reformatPrice(totalPrice: number) {
  const gp = Math.floor(totalPrice / 100)
  const sp = Math.floor((totalPrice % 100) / 10)
  const cp = Math.floor(totalPrice % 10)

  let moneyString = ''
  if (gp > 0) {
    moneyString += `${gp} GP `
  }
  if (sp > 0) {
    moneyString += `${sp} SP `
  }
  if (cp > 0) {
    moneyString += `${cp} CP`
  }
  return moneyString
}
</script>
