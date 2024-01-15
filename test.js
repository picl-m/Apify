"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let calls = 0;
const allPrices = Array.from({ length: Math.floor(Math.random() * 100000) }, () => Math.floor(Math.random() * 100000));
const allProducts = [];
allPrices.forEach(value => allProducts.push({ price: value, name: "product" }));
function testFetchApi(minPrice, maxPrice) {
    return __awaiter(this, void 0, void 0, function* () {
        const selectedProducts = allProducts.filter(value => {
            if (value.price >= minPrice && value.price <= maxPrice) {
                return true;
            }
            else {
                return false;
            }
        });
        const slicedProducts = selectedProducts.slice(0, 1000);
        const result = {
            total: selectedProducts.length,
            count: slicedProducts.length,
            products: slicedProducts
        };
        calls++;
        return result;
    });
}
function testGetAllProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        let products = [];
        let price = 0;
        const totalProducts = (yield testFetchApi(0, 100000)).total;
        const averagePriceStep = Math.floor(100000 / Math.ceil(totalProducts / 900));
        while (price < 100000) {
            let minPrice = price;
            let priceStep = averagePriceStep;
            let productsInRange = [];
            while (productsInRange.length === 0) {
                const result = yield testFetchApi(minPrice, minPrice + priceStep);
                if (priceStep < 1) {
                    throw new Error("Too many duplicate prices.");
                }
                else if (result.total > result.count) {
                    priceStep = Math.floor(priceStep / 2);
                }
                else {
                    productsInRange = result.products;
                }
            }
            price += priceStep + 1;
            products.push(...productsInRange);
        }
        return products;
    });
}
const allProductsSorted = JSON.stringify(allProducts.sort((a, b) => b.price - a.price));
testGetAllProducts().then(products => {
    console.log(`Extracted ${products.length} products in ${calls} API calls.
    Equality: ${JSON.stringify(products.sort((a, b) => b.price - a.price)) === allProductsSorted}`);
});
