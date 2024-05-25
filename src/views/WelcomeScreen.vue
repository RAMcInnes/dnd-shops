<template>
  <v-container style="height: 100%">
    <v-row>
      <v-col cols="12" class="text-center">
        <h1>Welcome to the Shop List</h1>
        <h5>This is a simple app that provides shop ideas for your TTRPG campaign.</h5>
        <br />
        <div class="shopBullets">
          Each shop includes various aspects that help flush out the shop:
          <li><b>Name</b></li>
          <li><b>Tags</b> (Other types of businesses that the shop could be considered)</li>
          <li><b>Image</b> (To help set the scene)</li>
          <li><b>Description</b></li>
          <li><b>Haggle Roll</b> (A way to potentially earn a discount at the shop)</li>
          <li><b>Quest</b> (A way to boost your attitude with the shop owners)</li>
          <li><b>Items</b> (The various items the shop sells)</li>
          <li><b>Services</b> (The various services the shop sells)</li>
        </div>
        <br />
        <div>Click on a shop in the left-hand pane to see more details.</div>
        <div>
          If you want to keep track of which shops to use, click on the shop icon you see when
          hovering over a shop name (it will turn <span style="color: yellow">yellow</span>).
        </div>
        <div>When you want to unselect the shop, click the icon again.</div>
        <br />
        <div>
          In the upper left-hand corner, you can search all the shops by various categories.
        </div>
      </v-col>
    </v-row>
    <br />
    <v-divider />
    <br />
    <v-row>
      <v-col cols="12" class="text-center">
        <h2>Random Settlement Generator</h2>
        <h5>Generate a random settlement with shops</h5>
        <br />
        <div>
          <v-select
            label="Town Size"
            variant="outlined"
            v-model="townSize"
            :items="settlementList"></v-select>
          <v-btn @click="generateSettlement()">Generate Settlement</v-btn>
        </div>
        <div v-if="uniqueShopsArray.length > 0">
          <br />
          <h3><u>WARNING:</u> If you click away from this home screen (to a shop), your list will be removed.</h3>
          <div>
            If you want to keep track of which shops to use, click on the shop icon you see when
            hovering over a shop name (it will turn <span style="color: yellow">yellow</span>).
          </div>
          <br />
          <v-card class="mx-auto" max-width="350">
            <v-list disabled>
              <v-list-subheader>SHOPS</v-list-subheader>

              <v-list-item
                v-for="(shop, index) in uniqueShopsArray"
                :key="index"
              >
                <template v-slot:prepend>
                  <v-icon :icon="shop.icon"></v-icon>
                </template>

                <v-list-item-title v-text="shop.name"></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import shops from '../shops'
  import type { ShopInterface } from '../types/ShopInterfaces'

  const townSize = ref('');
  const settlementList = ['Hamlet (2 Shops)', 'Village (4 Shops)', 'Town (6 Shops)', 'City (8 Shops)', 'Metropolis (10 Shops)'];
  const allShopsArray = Array<ShopInterface>()
  let uniqueShopsArray = ref<ShopInterface[]>([])

  onMounted(() => {
    for (const shop in shops) {
      allShopsArray.push(shops[shop as keyof typeof shops])
    }
  })

  const generateSettlement = () => {
    uniqueShopsArray.value = [];

    switch(townSize.value) {
      case 'Hamlet (2 Shops)':
        populateUniqueShops(2);
        break;
      case 'Village (4 Shops)':
        populateUniqueShops(4);
        break;
      case 'Town (6 Shops)':
        populateUniqueShops(6);
        break;
      case 'City (8 Shops)':
        populateUniqueShops(8);
        break;
      case 'Metropolis (10 Shops)':
        populateUniqueShops(10);
        break;
    }
  }

  const populateUniqueShops = (numOfShops: number) => {
    const uniqueShopsIndex = new Set<number>();

    while (uniqueShopsIndex.size < numOfShops) {
      uniqueShopsIndex.add(Math.floor(Math.random() * allShopsArray.length) + 1);
    }
    uniqueShopsIndex.forEach((index: number) => {
      uniqueShopsArray.value.push(allShopsArray[index]);
    })

    uniqueShopsArray.value = uniqueShopsArray.value.sort(function(x, y) {
        return (x.name < y.name) ? -1 : (x.name > y.name) ? 1 : 0;
    })
  }

</script>

<style scoped>
.shopBullets {
  position: relative;
  left: 25%;
  text-align: left;
  width: 50%;
}

.columnWrapper {
  column-count: 2;
}
</style>
