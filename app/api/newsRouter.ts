import { z } from "zod";
import { createRouter, publicQuery, editorQuery, adminQuery } from "./middleware";
import {
  findAllNews,
  findNewsBySlug,
  findNewsById,
  createNews,
  updateNews,
  deleteNews,
  incrementNewsViews,
} from "./queries/market";

export const newsRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        status: z.enum(["draft", "published", "archived"]).optional(),
        search: z.string().optional(),
        limit: z.number().optional(),
      }).optional()
    )
    .query(({ input }) => findAllNews(input)),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const result = await findNewsBySlug(input.slug);
      if (result) {
        await incrementNewsViews(result.id);
      }
      return result;
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => findNewsById(input.id)),

  create: editorQuery
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        image: z.string().optional(),
        status: z.enum(["draft", "published", "archived"]).default("draft"),
      })
    )
    .mutation(({ ctx, input }) =>
      createNews({ ...input, authorId: ctx.user.id })
    ),

  update: editorQuery
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          title: z.string().min(1).optional(),
          slug: z.string().min(1).optional(),
          excerpt: z.string().optional(),
          content: z.string().optional(),
          image: z.string().optional(),
          status: z.enum(["draft", "published", "archived"]).optional(),
          publishedAt: z.date().optional(),
        }),
      })
    )
    .mutation(({ input }) => updateNews(input.id, input.data)),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteNews(input.id)),
});
