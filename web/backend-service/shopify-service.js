import axios from'axios';

export default async function product_findBy_title(token, shop, searchTerm) {
    const shopHearders = {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
    }

    const productData = await axios.get(`https://${shop}/admin/api/2023-04/products/search.json?query=${searchTerm}`, {headers: shopHearders}).then(async productObj => {
        
        console.log(productObj, "product obj dara is----");
        
    }).catch(error=> {
        console.error(error, "product search error")
    })
}