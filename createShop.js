import fs from 'fs';
import csv from 'csv-parser';

const csvData = [];
let shop = resetShop();

fs.createReadStream('shops.csv')
  .pipe(csv())
  .on('data', (data) => csvData.push(data))
  .on('end', () => {
    csvData.forEach((currentShop, index) => {
      // Description, Price, Category, Shop Name, Shop Function
      const {
        'Price': cost,
        'Category': category,
        'Shop Name': shopName,
        'Shop Function': tag
      } = currentShop;
      // I have no idea why 'Description': product does not work above
      const product = Object.values(currentShop)[0];
      try {
        const previousShop = csvData[index - 1];
        const previousShopName = previousShop ? previousShop['Shop Name'] : '';
        // If previous shop is different than the current shop, write out the previous shop to a file.
        if (previousShopName && (previousShopName !== shopName)) {
          const fileName = `${previousShopName.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '')}.json`;
          fs.writeFileSync(`src/shops/${fileName}`, JSON.stringify(shop, null, "\t"));
          shop = resetShop();
        }
        shop.name = shopName.trim();;
        shop.image = `/shops/${shopName?.replace(/ +/g, "")}.png`;
        if (category === 'Item') {
          shop.items.push(formatProduct(product, cost.trim()));
        } else if (category === 'Service') {
          shop.services.push(formatProduct(product, cost.trim()));
        }
      } catch (err) {
        console.error('Error trying to createShop: ', err);
      }
    });
  });

function formatProduct(productName, cost) {
  try {
    const price = Number(cost.match(/\d+/g)?.join('')) || 0;
    const currency = (cost.match(/[a-zA-Z]{2}/)[0]).toUpperCase();

    const formattedProduct = {
      name: productName.trim(),
      price: price,
      currency: currency
    };

    return formattedProduct;
  } catch (err) {
    console.error(`Error while formatting product: ${productName} with cost: ${cost}`);
    console.error(err);
  }
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
