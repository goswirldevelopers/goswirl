// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import customAuthentication from "./backend-service/custom-auth.js";
import multer from 'multer'
import axios from 'axios';
import FormData from 'form-data'
import * as fs from 'fs';
import product_findBy_title from "./backend-service/shopify-service.js"
import refreshAuthentication from "./backend-service/refreshAuth.js"

// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })
const upload = multer({ dest: 'uploads/' })
const SWRILURL = process.env.SWRILBASEURL || `https://bigleap.live/index.php/APIv1`

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  customAuthentication,
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

/* 
  Swril APIs and App logics
*/

/*
    Videos
 */

app.post('/api/swirl/single/video/upload', upload.array('video_file', 2) ,async (req, res) => {
  try {
    const refreshToken = await refreshAuthentication(res.locals.shopify.session.accessToken, res.locals.shopify.session.shop)
    let filePath, imgPreview;
    let data = new FormData();
    data.append('access_token', refreshToken.data.temp_token);
    data.append('video_title', req.body.video_title);
    data.append('brand_product_id', req.body.brand_product_id);
    data.append('brand_product_handle', req.body.product_handle)
    data.append('call_to_action', req.body.button_text)
 
    if (req.body.video_link) {      
      data.append('video_url', req.body.video_link);

      if (req.files) {
        // Save the file to a folder on your server
        if (req.body.preview == 'true') {
          imgPreview = `uploads/${req.files[0].originalname}`;
          fs.renameSync(req.files[0].path, imgPreview);
          data.append('video_thumbnail', fs.createReadStream(imgPreview))  
        }
      }  
    }
    else{
        if (req.files) {
          // Save the file to a folder on your server
          filePath = `uploads/${req.files[0].originalname}`;
          fs.renameSync(req.files[0].path, filePath);
          data.append('video_file', fs.createReadStream(filePath))  

          if (req.body.preview == 'true') {
            imgPreview = `uploads/${req.files[1].originalname}`;
            fs.renameSync(req.files[1].path, imgPreview);
            data.append('video_thumbnail', fs.createReadStream(imgPreview))  
          }
        }      
    }
    console.log(filePath, "sjbdjs", imgPreview, "djadha");
    let config = {
      method: 'post',
      url: `${SWRILURL}/shopifyApp/uploadVideo`,
      headers: { 
        ...data.getHeaders()
      },
      data : data
    };

    await axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data), "upload video response");
      if (filePath) {
        fs.unlinkSync(filePath);
      }
      if (imgPreview) {
        fs.unlinkSync(imgPreview);
      }
      return res.status(200).json({message: "successfully uploaded", data:response.data})
      
    })
    .catch((error) => {
      return res.status(500).json({message: "smonething went wrong", error})
    });
  
  } catch (error) {
    return res.status(500).json({message: "smonething went wrong", error})
  }
})

app.get('/api/swril/getVideo', async(req, res) => {
  try {

    const refreshToken = await refreshAuthentication(res.locals.shopify.session.accessToken, res.locals.shopify.session.shop)
    
    let reqPayload = new FormData()
    reqPayload.append('access_token', refreshToken.data.temp_token)
    reqPayload.append('pageNo', 0)
    reqPayload.append('perPage', 50)
    reqPayload.append('orderBy', 'desc')
    reqPayload.append('searchKey', '')
    
    let config = {
      method: 'post',
      url: `${SWRILURL}/shopifyApp/getVideos`,
      headers: { 
        ...reqPayload.getHeaders()
      },
      data : reqPayload
    };

    let fetchData = await axios(config)
    // .then((response) => {
    //   console.log(response, "response is---");
    //   return res.status(200).json({data: response})
    // })
    // .catch((error) => {
    //   return res.status(500).json({message: "smonething went wrong", error})
    // });
    if (fetchData.data) {
      return res.status(200).json({data: fetchData.data})
    }
    
  } catch (error) {
    console.log(error, "error is-")
    return res.status(500).json({message: "smonething went wrong", error})
  }
})

app.post('/api/swirl/editVideo', async (req, res) => {
  try {
    const refreshToken = await refreshAuthentication(res.locals.shopify.session.accessToken, res.locals.shopify.session.shop)

    let data = new FormData();
    data.append('access_token', refreshToken.data.temp_token)
    data.append('video_title', req.body.video_title);
    data.append('brand_product_id', req.body.brand_product_id);
    data.append('brand_product_handle', req.body.product_handle)
    data.append('call_to_action', req.body.button_text)
    data.append('video_id', req.body.video_id)
 
    let config = {
      method: 'post',
      url: `${SWRILURL}/shopifyApp/editVideo`,
      headers: { 
        ...data.getHeaders()
      },
      data : data
    };

    await axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data), "upload video response");
      return res.status(200).json({message: "successfully uploaded", data:response.data})
    })
    .catch((error) => {
      return res.status(500).json({message: "smonething went wrong", error})
    });
  
  } catch (error) {
    return res.status(500).json({message: "smonething went wrong", error})
  }
})

app.post('/api/swirl/deleteVideo', async (req, res) => {
  try {
    const refreshToken = await refreshAuthentication(res.locals.shopify.session.accessToken, res.locals.shopify.session.shop)

    let reqPayload = new FormData()
    reqPayload.append('access_token', refreshToken.data.temp_token)
    reqPayload.append('video_id', req.body.video_id)

    let config = {
      method: 'post',
      url: `${SWRILURL}/shopifyApp/deleteVideo`,
      headers: { 
        ...reqPayload.getHeaders()
      },
      data : reqPayload
    };

    await axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data), "jdsklfldsjfldfjkdkdjf");
      return res.status(200).json({data: response.data})
    })
    .catch((error) => {
      console.log(error, "error")
      return res.status(500).json({message: "smonething went wrong", error})
    });
  } catch (error) {
    return res.status(500).json({message: "smonething went wrong", error})
  }
})

app.post('/api/swirl/getVideosByIds', async(req, res) => {
  try{
    const refreshToken = await refreshAuthentication(res.locals.shopify.session.accessToken, res.locals.shopify.session.shop)
    
    let reqPayload = new FormData()
    reqPayload.append('access_token', refreshToken.data.temp_token)
    reqPayload.append('video_id', req.body.videoId)
        
    let config = {
      method: 'post',
      url: `${SWRILURL}/shopifyApp/getVideosByIds`,
      headers: { 
        ...reqPayload.getHeaders()
      },
      data : reqPayload
    };

    let fetchData = await axios(config)
    // .then((response) => {
    //   console.log(response, "response is---");
    //   return res.status(200).json({data: response})
    // })
    // .catch((error) => {
    //   return res.status(500).json({message: "smonething went wrong", error})
    // });
    if (fetchData.data) {
      return res.status(200).json({data: fetchData.data})
    }
    
  } catch (error) {
    console.log(error, "error is-")
    return res.status(500).json({message: "smonething went wrong", error})
  }
})


/* 
    playlist
 */

    
app.get('/api/swril/getPlaylist', async(req, res) => {
  try {
    const refreshToken = await refreshAuthentication(res.locals.shopify.session.accessToken, res.locals.shopify.session.shop)

    let reqPayload = new FormData()
    reqPayload.append('access_token', refreshToken.data.temp_token)
    reqPayload.append('pageNo', 0)
    reqPayload.append('perPage', 50)
    reqPayload.append('orderBy', 'desc')
    reqPayload.append('searchKey', '')

    let config = {
      method: 'post',
      url: `${SWRILURL}/shopifyApp/getPlaylist`,
      headers: { 
        ...reqPayload.getHeaders()
      },
      data : reqPayload
    };

    await axios(config)
    .then((response) => {
      return res.status(200).json({data: response.data})
    })
    .catch((error) => {
      return res.status(500).json({message: "smonething went wrong", error})
    });
    
  } catch (error) {
    return res.status(500).json({message: "smonething went wrong", error})
  }
})

app.post('/api/swirl/addPlaylist', async (req, res) => {
  try {
    console.log(req.body, "bodyyooi");
    const refreshToken = await refreshAuthentication(res.locals.shopify.session.accessToken, res.locals.shopify.session.shop)

    const videoString = req.body.video_id.join(',')
    console.log(videoString, "video string");
    let reqPayload = new FormData()
    reqPayload.append('access_token', refreshToken.data.temp_token)
    reqPayload.append('name', req.body.title)
    reqPayload.append('video_id', videoString)
    reqPayload.append('type', req.body.type)

    let config = {
      method: 'post',
      url: `${SWRILURL}/shopifyApp/addPlaylist`,
      headers: { 
        ...reqPayload.getHeaders()
      },
      data : reqPayload
    };

    await axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return res.status(200).json({data: response.data})
    })
    .catch((error) => {
      return res.status(500).json({message: "smonething went wrong", error})
    });
    
  } catch (error) {
    return res.status(500).json({message: "smonething went wrong", error})
  }
})

app.post('/api/swirl/statusPlaylist', async (req, res) => {
  try {
    const refreshToken = await refreshAuthentication(res.locals.shopify.session.accessToken, res.locals.shopify.session.shop)

    console.log(req.body, "kjdklajdkjdkajsakjd")
    let reqPayload = new FormData()
    reqPayload.append('access_token', refreshToken.data.temp_token)
    reqPayload.append('playlist_id', req.body.playlist_id)
    reqPayload.append('status', req.body.status)


    let config = {
      method: 'post',
      url: `${SWRILURL}/shopifyApp/statusPlaylist`,
      headers: { 
        ...reqPayload.getHeaders()
      },
      data : reqPayload
    };

    await axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data), "jdsklfldsjfldfjkdkdjf");
      return res.status(200).json({data: response.data})
    })
    .catch((error) => {
      console.log(error, "error")
      return res.status(500).json({message: "smonething went wrong", error})
    });
  } catch (error) {
    return res.status(500).json({message: "smonething went wrong", error})
  }
})

app.post('/api/swirl/editPlaylist', async (req, res) => {
  try {
    const refreshToken = await refreshAuthentication(res.locals.shopify.session.accessToken, res.locals.shopify.session.shop)

    const videoString = req.body.video_id.join(',')
    let reqPayload = new FormData()
    reqPayload.append('access_token', refreshToken.data.temp_token)
    reqPayload.append('playlist_id', req.body.playlist_id)
    reqPayload.append('name', req.body.title)
    reqPayload.append('video_id', videoString)
    reqPayload.append('type', req.body.type)

    let config = {
      method: 'post',
      url: `${SWRILURL}/shopifyApp/editPlaylist`,
      headers: { 
        ...reqPayload.getHeaders()
      },
      data : reqPayload
    };

    await axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return res.status(200).json({data: response.data})
    })
    .catch((error) => {
      return res.status(500).json({message: "smonething went wrong", error})
    });
  } catch (error) {
    return res.status(500).json({message: "smonething went wrong", error})
  }
})

app.post('/api/swirl/deletePlaylist', async (req, res) => {
  try {
    const refreshToken = await refreshAuthentication(res.locals.shopify.session.accessToken, res.locals.shopify.session.shop)

    let reqPayload = new FormData()
    reqPayload.append('access_token', refreshToken.data.temp_token)
    reqPayload.append('playlist_id', req.body.playlist_id)

    let config = {
      method: 'post',
      url: `${SWRILURL}/shopifyApp/deletePlaylist`,
      headers: { 
        ...reqPayload.getHeaders()
      },
      data : reqPayload
    };

    await axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data), "jdsklfldsjfldfjkdkdjf");
      return res.status(200).json({data: response.data})
    })
    .catch((error) => {
      console.log(error, "error")
      return res.status(500).json({message: "smonething went wrong", error})
    });
  } catch (error) {
    return res.status(500).json({message: "smonething went wrong", error})
  }
})


/* 
  Products
*/

app.get("/api/products", async (_req, res) => {
  const productData = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
    limit: 250
  });
  res.status(200).json({data:productData});
});

app.post('/api/swirl/product/addPlaylist', async (req, res) => {
  try {
    const refreshToken = await refreshAuthentication(res.locals.shopify.session.accessToken, res.locals.shopify.session.shop)

    const videoString = req.body.video_id.join(',')
    console.log(videoString, "video string");
    let reqPayload = new FormData()
    reqPayload.append('access_token', refreshToken.data.temp_token)
    reqPayload.append('handle', req.body.handle)
    reqPayload.append('video_id', videoString)
    reqPayload.append('type', req.body.type)

    let config = {
      method: 'post',
      url: `${SWRILURL}/shopifyApp/addProductPagePlaylist`,
      headers: { 
        ...reqPayload.getHeaders()
      },
      data : reqPayload
    };

    await axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return res.status(200).json({data: response.data})
    })
    .catch((error) => {
      return res.status(500).json({message: "smonething went wrong", error})
    });
    
  } catch (error) {
    return res.status(500).json({message: "smonething went wrong", error})
  }
})

app.get('/api/products/search', async(req, res) => {
  const productData = await product_findBy_title(res.locals.shopify.session.accessToken, res.locals.shopify.session.shop, req.query.searchTerm)
  console.log(productData, "search product data")
  res.status(200).json({data:productData});
})

/*
  Settings
*/

app.get('/api/swril/getVideoSettings', async(req, res) => {
  try {
    const refreshToken = await refreshAuthentication(res.locals.shopify.session.accessToken, res.locals.shopify.session.shop)

    let reqPayload = new FormData()
    reqPayload.append('access_token', refreshToken.data.temp_token)

    let config = {
      method: 'post',
      url: `${SWRILURL}/shopifyApp/getVideoSettings`,
      headers: { 
        ...reqPayload.getHeaders()
      },
      data : reqPayload
    };

    await axios(config)
    .then((response) => {
      return res.status(200).json({data: response.data})
    })
    .catch((error) => {
      return res.status(500).json({message: "smonething went wrong", error})
    });
    
  } catch (error) {
    return res.status(500).json({message: "smonething went wrong", error})
  }
})

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
