import shopify from "../shopify.js";
import axios from'axios';
import createWebhook from "./webhook.js";

const customAuthentication = async (req, res, next) => {
    const callback = await shopify.auth.callback({

        rawRequest: req,
    
        rawResponse: res,
    
    });

    const shopHearders = {
        "X-Shopify-Access-Token": res.locals.shopify.session.accessToken,
        "Content-Type": "application/json",
    }
    const shopData = await axios.get(`https://${res.locals.shopify.session.shop}/admin/api/2023-04/shop.json`, {headers: shopHearders}).then(async shopObj => {
        // console.log(shopObj.data.shop, "shhop object is ==")
        const regPayload = {
            'X-Shopify-Access-Token': res.locals.shopify.session.accessToken,
            "Shop_name": res.locals.shopify.session.shop,
            "Shop_Data": shopObj.data.shop
        }
        
        //create token from swirl backend
        const addMerchant = await axios.post(`https://bigleap.live/index.php/APIv1/shopifyApp/signup`, regPayload)

        console.log(addMerchant, "add merchant result is ---")

        //  await createWebhook(res.locals.shopify.session.accessToken, res.locals.shopify.session.shop)
        
        next()
        
    }).catch(error=> {
        console.error(error, "swril registration error---")
    })
    
    
}

export default customAuthentication