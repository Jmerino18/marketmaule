import { authRouter } from "./auth-router";
import { entrepreneurRouter } from "./entrepreneurRouter";
import { productRouter } from "./productRouter";
import { bannerRouter } from "./bannerRouter";
import { newsRouter } from "./newsRouter";
import { statRouter } from "./statRouter";
import { contactRouter } from "./contactRouter";
import { communeRouter } from "./communeRouter";
import { orderRouter } from "./orderRouter";
import { reviewRouter } from "./reviewRouter";
import { menuRouter } from "./menuRouter";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  entrepreneur: entrepreneurRouter,
  product: productRouter,
  banner: bannerRouter,
  news: newsRouter,
  stat: statRouter,
  contact: contactRouter,
  commune: communeRouter,
  order: orderRouter,
  review: reviewRouter,
  menu: menuRouter,
});

export type AppRouter = typeof appRouter;
