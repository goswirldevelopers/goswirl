import axios from "axios"
const SWIRL_BACKEND_URL = process.env.BACKEND_URL || `https://bigleap.live/index.php/APIv1/shopifyApp/syncProduct`

const createWebhook = async (token, shop) => {
    const requestUrl = `https://${shop}/admin/api/2023-01/webhooks.json`;
  
    const webhook_topic = ["orders/create", "orders/cancelled", "products/create", "products/update", "products/delete"];
  
    webhook_topic.forEach(async (item) => {
      let webhookPayload = {
        webhook: {
          topic: item,
          address: `${SWIRL_BACKEND_URL}`,
          format: 'json',
        },
      };
      const makeWebhook = await axios({
        method: "POST",
        url: requestUrl,
        data: webhookPayload,
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
      })
      .then((data) => {
        console.log("shopify webhook created..." , data.data);
        return data.data;
      })
      .catch((error) => {
        console.log("shopify webhook created error..." , error);
      });
    });
}

export default createWebhook