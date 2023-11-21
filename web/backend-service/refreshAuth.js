import axios from'axios';

const refreshAuthentication = async (token, shop) => {
    const regPayload = {
        'X-Shopify-Access-Token': token,
        "Shop_name": shop,
    }

    //create token from swirl backend
    const refresSwirlhToken = await axios.post(`https://bigleap.live/index.php/APIv1/shopifyApp/signup`, regPayload)

    return refresSwirlhToken.data;

}

export default refreshAuthentication;