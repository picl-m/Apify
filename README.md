# Apify

This code can extract all products from an API by only querying the price range and recieving the total ammount of products in the price range. The extraction doesn't contain duplicates and it works with unsorted responses.

This code relies on the expectation that there is no more than 1000 products, that are of the same price, otherwise it will throw an error.

## Usage
The program will not work because the API in the fetch function is only an example.

If the API URL is replaced by a real API the application can be ran with:
``
npm install
npm run dev
``
