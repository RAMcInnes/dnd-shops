import fs from 'fs';

const fileContent = fs.readFileSync('./shops.csv', 'utf-8');
const rows = fileContent.split('\n');
const csvData = [];

for (const row of rows) {
  const columns = row.split(',');
  csvData.push(columns);
}

let shop = resetShop();

csvData.forEach((row, rowIndex) => {
  const [previousProduct, previousCost, previousCategory, previousShopName, previousTag] = csvData[rowIndex-1] ? csvData[rowIndex-1] : [] ;
  const [product, cost, category, shopName, tag] = csvData[rowIndex];
  try {
    // If previous shop is different than the current shop, write out the previous shop to a file.
    if (previousShopName && (previousShopName !== shopName)) {
      const fileName = `${previousShopName.replace(/ +/g, "")}.json`;
      fs.writeFileSync(`src/test-shops/${fileName}`, JSON.stringify(shop, null, "\t"));
      shop = resetShop();
    }
    shop.name = shopName.trim();;
    shop.image = `../assets/${shopName?.replace(/ +/g, "")}.png`;
    if (previousTag !== tag) {
      shop.tags.push(tag);
    }
    if (category === 'Item') {
      shop.items.push(formatProduct(product, cost));
    } else if (category === 'Service') {
      shop.services.push(formatProduct(product, cost));
    }
  } catch (err) {
    console.error('Error trying to createShop: ', err);
  }
});

function formatProduct(product, cost) {
  const price = Number(cost.match(/\d+/g).join(''));
  const currency = (cost.match(/[a-zA-Z]{2}/)[0]).toUpperCase();

  const formattedProduct = {
    name: product.trim(),
    price: price,
    currency: currency,
    quantity: 0,
  };

  return formattedProduct;
}

function resetShop() {
  return {
    name: 'PLACEHOLDER',
    image: 'PLACEHOLDER',
    description: 'PLACEHOLDER',
    attitude: 'Neutral',
    discount: 0,
    tags: [],
    items: [],
    services: [],
    quest: {
      name: 'PLACEHOLDER',
      description: 'PLACEHOLDER',
      reward: 'PLACEHOLDER',
      completed: false,
    },
    isSelected: false,
  };
}
