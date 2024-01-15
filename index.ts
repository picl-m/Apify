// This code can extract all products from an API by only querying the price range
// and recieving the total ammount of products in the price range.
// The extraction doesn't contain duplicates and it works with unsorted responses.

// This code relies on the expectation that there is no more than 1000 products,
// that are of the same price, otherwise it will throw an error.

interface ApiResponse {
    total: number;
    count: number;
    products: object[];
}

async function fetchApi(minPrice: number, maxPrice: number): Promise<ApiResponse> {
    const response = await fetch("https://api.ecommerce.com/products?" + new URLSearchParams({
        minPrice: minPrice.toString(),
        maxPrice: maxPrice.toString(),
    }));

    const result = await response.json();

    return result as ApiResponse;
}

async function extractAllProducts(limit: number, maxPrice: number): Promise<object[]> {
    let products: object[] = [];
    let minPrice = 0;
    const totalProducts = (await fetchApi(0, maxPrice)).total;
    const averagePriceStep = Math.floor(maxPrice / Math.ceil(totalProducts / (limit * 0.9)));

    while (minPrice < maxPrice) {
        let priceStep = averagePriceStep;
        let productsInRange: object[] = [];

        while (productsInRange.length === 0) {
            const result = await fetchApi(minPrice, minPrice + priceStep);

            if (priceStep < 1) {
                // Error when there is more than the limit of products of the same price
                throw new Error("Too many duplicate prices.");
            } else if (result.total > limit) {
                // Divide the price step if the ammount of products is higher than the limit
                priceStep = Math.floor(priceStep / 2);
            } else {
                productsInRange = result.products;
            }
        }

        minPrice += priceStep + 1;
        products.push(...productsInRange);
    }

    return products as object[];
}


// Use the values from the instructions to extract all products
let products: object[];
extractAllProducts(1000, 100000).then(extractedProducts => products = extractedProducts);