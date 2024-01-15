interface TestApiResponse {
    total: number;
    count: number;
    products: TestProduct[];
}

interface TestProduct {
    price: number;
    name: string;
}

let calls = 0;

const allPrices = Array.from(
    { length: Math.floor(Math.random() * 100000) },
    () => Math.floor(Math.random() * 100000));

const allProducts: TestProduct[] = [];

allPrices.forEach(value => allProducts.push({price: value, name: "product"}));

async function testFetchApi(minPrice: number, maxPrice: number): Promise<TestApiResponse> {
    const selectedProducts = allProducts.filter(value => {
        if (value.price >= minPrice && value.price <= maxPrice) {
            return true;
        } else {
            return false;
        }
    });

    const slicedProducts = selectedProducts.slice(0, 1000);

    const result = {
        total: selectedProducts.length,
        count: slicedProducts.length,
        products: slicedProducts
    }

    calls++;

    return result as TestApiResponse;
}

async function testGetAllProducts(): Promise<TestProduct[]> {
    let products: object[] = [];
    let price = 0;
    const totalProducts = (await testFetchApi(0, 100000)).total;
    const averagePriceStep = Math.floor(100000 / Math.ceil(totalProducts / 900));

    while (price < 100000) {
        let minPrice = price;
        let priceStep = averagePriceStep;
        let productsInRange: object[] = [];

        while (productsInRange.length === 0) {
            const result = await testFetchApi(minPrice, minPrice + priceStep);

            if (priceStep < 1) {
                throw new Error("Too many duplicate prices.");
            } else if (result.total > result.count) {
                priceStep = Math.floor(priceStep / 2);
            } else {
                productsInRange = result.products;
            }
        }

        price += priceStep + 1;
        products.push(...productsInRange);
    }

    return products as TestProduct[];
}

const allProductsSorted = JSON.stringify(allProducts.sort((a, b) => b.price-a.price));

testGetAllProducts().then(products => {
    console.log(`Extracted ${products.length} products in ${calls} API calls.
    Equality: ${JSON.stringify(products.sort((a, b) => b.price-a.price)) === allProductsSorted}`);
});