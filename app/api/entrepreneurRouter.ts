import { z } from "zod";
import { createRouter, publicQuery, adminQuery, editorQuery } from "./middleware";
import {
  findAllEntrepreneurs,
  findEntrepreneurBySlug,
  findEntrepreneurById,
  createEntrepreneur,
  updateEntrepreneur,
  deleteEntrepreneur,
  incrementEntrepreneurViews,
} from "./queries/market";

export const entrepreneurRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        status: z.enum(["pending", "active", "inactive"]).optional(),
        categoryId: z.number().optional(),
        communeId: z.number().optional(),
        featured: z.boolean().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(({ input }) => findAllEntrepreneurs(input)),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const result = await findEntrepreneurBySlug(input.slug);
      if (result) {
        await incrementEntrepreneurViews(result.id);
      }
      return result;
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => findEntrepreneurById(input.id)),

  create: editorQuery
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        logo: z.string().optional(),
        banner: z.string().optional(),
        categoryId: z.number().optional(),
        communeId: z.number().optional(),
        subcategory: z.string().optional(),
        region: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        whatsapp: z.string().optional(),
        email: z.string().email().optional(),
        website: z.string().optional(),
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        mapUrl: z.string().optional(),
        status: z.enum(["pending", "active", "inactive"]).optional(),
        featured: z.boolean().optional(),
      })
    )
    .mutation(({ input }) => createEntrepreneur(input)),

  update: editorQuery
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          name: z.string().min(1).optional(),
          slug: z.string().min(1).optional(),
          description: z.string().optional(),
          shortDescription: z.string().optional(),
          logo: z.string().optional(),
          banner: z.string().optional(),
          categoryId: z.number().optional(),
          communeId: z.number().optional(),
          subcategory: z.string().optional(),
          region: z.string().optional(),
          address: z.string().optional(),
          phone: z.string().optional(),
          whatsapp: z.string().optional(),
          email: z.string().email().optional(),
          website: z.string().optional(),
          facebook: z.string().optional(),
          instagram: z.string().optional(),
          mapUrl: z.string().optional(),
          status: z.enum(["pending", "active", "inactive"]).optional(),
          featured: z.boolean().optional(),
        }),
      })
    )
    .mutation(({ input }) => updateEntrepreneur(input.id, input.data)),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteEntrepreneur(input.id)),
});
