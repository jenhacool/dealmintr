import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion, DataType } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import Shop from "../models/shop.model";
import Setting from "../models/setting.model";
import {
  storeCallback,
  loadCallback,
  deleteCallback,
} from "../utilities/redis-store";

const _ = require("lodash");
const mongoose = require("mongoose");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const fs = require('fs');

mongoose
  .connect("mongodb://127.0.0.1:27017/dealmintr", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      console.log(
        "Connected to %s",
        "mongodb://127.0.0.1:27017/dealmintr"
      );
    }
  });

dotenv.config();
const getSubscriptionUrl = require("./getSubscriptionUrl");
const getSubscriptionUrlDev = require("./getSubscriptionUrlDev");
const cancelSubscription = require("./cancelSubscription");
const path = require("path");
const serve = require("koa-static");
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES
    ? process.env.SCOPES.split(",")
    : "read_content,write_content,read_script_tags,write_script_tags,read_products,read_themes",
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: "2022-01",
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
    storeCallback,
    loadCallback,
    deleteCallback
  ),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

if (process.env.NODE_ENV == "development") {
  ACTIVE_SHOPIFY_SHOPS["dealmintr.myshopify.com"] = "access_token";
}

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      accessMode: "offline",
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        await Shop.findOneAndUpdate(
          { shop: shop },
          {
            shop: shop,
            token: accessToken,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  const verifyIfActiveShopifyShop = async (ctx, next) => {
    let { shop } = ctx.query;
    shop = "dealmintr.myshopify.com";
    const shopData = await Shop.findOne({ shop });

    console.log("here 1", ACTIVE_SHOPIFY_SHOPS);
    console.log("here 2", shopData);
    console.log("here 3", shop);

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined || !shopData) {
      ctx.redirect(`/auth?shop=${shop}`);
      return;
    }

    return next();
  };

  router.get("/", verifyIfActiveShopifyShop, async (ctx) => {
    await handleRequest(ctx);
    return;
  });
  
  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post("/webhooks/customers/redact", async (ctx) => {
    ctx.status = 200;
  });

  router.post("/webhooks/shop/redact", async (ctx) => {
    ctx.status = 200;
  });

  router.post("/webhooks/customers/data_request", async (ctx) => {
    ctx.status = 200;
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  const verifyAPI = async (ctx, next) => {
    if (process.env.NODE_ENV == "development") {
      return next;
    }

    verifyRequest({ accessMode: "offline" });
  };

  router.post("/api/settings",
    bodyParser(),
    verifyAPI,
    async (ctx) => {
      let { shop } = ctx.request.body;

      try {
        let setting = await Setting.findOne({ shop }).sort({
          createdAt: -1,
        });
        ctx.status = 200;
        ctx.body = {
          success: true,
          data: {
            settings: setting ? setting.settings : []
          }
        };
      } catch (error) {
        ctx.status = 400;
        ctx.body = {
          success: false,
        };
      }
    }
  );

  router.post("/api/settings/save",
    bodyParser(),
    verifyAPI,
    async (ctx) => {
      let { shop, settings } = ctx.request.body;

      try {
        await Setting.findOneAndUpdate({shop}, {settings}, {new: true, upsert: true});
        ctx.status = 200;
        ctx.body = {
          success: true,
          data: {
            settings,
          },
        };
      } catch (error) {
        console.log(error);
        ctx.status = 400;
        ctx.body = {
          success: false,
        };
      }
    }
  );

  router.put(
    "/api/settings/:id",
    bodyParser(),
    verifyRequest({ accessMode: "offline" }),
    async (ctx) => {
      let { shop, config } = ctx.request.body;
      let { id } = ctx.params;

      try {
        let settings = await Setting.findByIdAndUpdate(
          id,
          { $set: { config: config } },
          { new: true }
        );
        ctx.status = 200;
        ctx.body = {
          success: true,
          data: {
            settings,
          },
        };
      } catch (error) {
        console.log(error);
        ctx.status = 400;
        ctx.body = {
          success: false,
        };
      }
    }
  );

  router.delete(
    "/api/setting-product/:id",
    bodyParser(),
    verifyRequest({ accessMode: "offline" }),
    async (ctx) => {
      let { shop } = ctx.request.body;
      let { id } = ctx.params;

      try {
        await Setting.deleteOne({ _id: id });
        ctx.status = 200;
        ctx.body = {
          success: true,
        };
      } catch (error) {
        console.log(error);
        ctx.status = 400;
        ctx.body = {
          success: false,
        };
      }
    }
  );

  router.post("/api/get_settings", cors(), bodyParser(), async (ctx) => {
    console.log("here");
    let { shop } = ctx.request.body;

    try {
      let setting = await Setting.findOne({shop});
      ctx.status = 200;
      ctx.body = {
        success: true,
        data: {
          settings: setting ? setting.settings : [],
        },
      };
    } catch (error) {
      console.log(error);
      ctx.status = 400;
      ctx.body = {
        success: false,
      };
    }
  });

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", verifyIfActiveShopifyShop, handleRequest);

  const staticDirPath = path.join(process.cwd(), "public");
  server.use(serve(staticDirPath));
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});