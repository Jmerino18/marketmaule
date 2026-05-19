import { z } from "zod";
import { createRouter, publicQuery, editorQuery, adminQuery } from "./middleware";
import {
  findAllBanners,
  findBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from "./queries/market";

export const bannerRouter = createRouter({
  list: publicQuery
    .input(z.object({ position: z.enum(["home_hero", "home_mid", "sidebar"]).optional() }).optional())
    .query(({ input }) => findAllBanners(input?.position)),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => findBannerById(input.id)),

  create: editorQuery
    .input(
      z.object({
        title: z.string().min(1),
        subtitle: z.string().optional(),
        image: z.string().min(1),
        link: z.string().optional(),
        position: z.enum(["home_hero", "home_mid", "sidebar"]),
        order: z.number().default(0),
        active: z.boolean().default(true),
      })
    )
    .mutation(({ input }) => createBanner(input)),

  update: editorQuery
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          title: z.string().min(1).optional(),
          subtitle: z.string().optional(),
          image: z.string().optional(),
          link: z.string().optional(),
          position: z.enum(["home_hero", "home_mid", "sidebar"]).optional(),
          order: z.number().optional(),
          active: z.boolean().optional(),
        }),
      })
    )
    .mutation(({ input }) => updateBanner(input.id, input.data)),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteBanner(input.id)),
});
