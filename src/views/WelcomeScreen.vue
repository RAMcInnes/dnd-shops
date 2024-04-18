<template>
  <v-container style="height: 100%">
    <v-row>
      <v-col cols="12" class="text-center">
        <h1>Welcome to the Shop Generator</h1>
        <h5>This is a simple app that generates shop ideas for your TTRPG campaign.</h5>
        <br />
        <div class="shopbullets">
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
  </v-container>
</template>

<style scoped>
.shopbullets {
  position: relative;
  left: 25%;
  text-align: left;
  width: 50%;
}
</style>
