import { z } from "zod";
import { createRouter, publicQuery, editorQuery } from "./middleware";
import {
  getTopEntrepreneurs,
  getTopProducts,
  getStatsByCommune,
  getRecentStats,
  createStat,
} from "./queries/market";

export const statRouter = createRouter({
  topEntrepreneurs: publicQuery
    .input(z.object({ limit: z.number().default(10) }).optional())
    .query(({ input }) => getTopEntrepreneurs(input?.limit ?? 10)),

  topProducts: publicQuery
    .input(z.object({ limit: z.number().default(10) }).optional())
    .query(({ input }) => getTopProducts(input?.limit ?? 10)),

  byCommune: publicQuery.query(() => getStatsByCommune()),

  recent: publicQuery
    .input(z.object({ days: z.number().default(30) }).optional())
    .query(({ input }) => getRecentStats(input?.days ?? 30)),

  track: publicQuery
    .input(
      z.object({
        entityType: z.enum(["entrepreneur", "product", "news", "page"]),
        entityId: z.number(),
        eventType: z.enum(["view", "click", "contact", "share"]).default("view"),
        referrer: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) =>
      createStat({
        ...input,
        ipAddress: ctx.req.headers.get("x-forwarded-for") || "",
        userAgent: ctx.req.headers.get("user-agent") || "",
      })
    ),

  dashboard: editorQuery
    .input(z.object({ days: z.number().default(30) }).optional())
    .query(async ({ input }) => {
      const days = input?.days ?? 30;
      const [topEntrepreneurs, topProducts, byCommune, recent] = await Promise.all([
        getTopEntrepreneurs(10),
        getTopProducts(10),
        getStatsByCommune(),
        getRecentStats(days),
      ]);
      return { topEntrepreneurs, topProducts, byCommune, recent };
    }),
});
