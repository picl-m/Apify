"use strict";
// This code can extract all products from an API by only querying the price range
// and recieving the total ammount of products in the price range.
// The extraction doesn't contain duplicates and it works with unsorted responses.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchApi(minPrice, maxPrice) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://api.ecommerce.com/products?" + new URLSearchParams({
            minPrice: minPrice.toString(),
            maxPrice: maxPrice.toString(),
        }));
        const result = yield response.json();
        return result;
    });
}
function extractAllProducts(limit, maxPrice) {
    return __awaiter(this, void 0, void 0, function* () {
        let products = [];
        let minPrice = 0;
        const totalProducts = (yield fetchApi(0, maxPrice)).total;
        const averagePriceStep = Math.floor(maxPrice / Math.ceil(totalProducts / (limit * 0.9)));
        while (minPrice < maxPrice) {
            let priceStep = averagePriceStep;
            let productsInRange = [];
            while (productsInRange.length === 0) {
                const result = yield fetchApi(minPrice, minPrice + priceStep);
                if (priceStep < 1) {
                    // Error when there is more than the limit of products of the same price
                    throw new Error("Too many duplicate prices.");
                }
                else if (result.total > limit) {
                    // Divide the price step if the ammount of products is higher than the limit
                    priceStep = Math.floor(priceStep / 2);
                }
                else {
                    productsInRange = result.products;
                }
            }
            minPrice += priceStep + 1;
            products.push(...productsInRange);
        }
        return products;
    });
}
// Use the values from the instructions to extract all products
let products;
extractAllProducts(1000, 100000).then(extractedProducts => products = extractedProducts);
