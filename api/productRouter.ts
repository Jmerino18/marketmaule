import { z } from "zod";
import { createRouter, publicQuery, editorQuery, adminQuery } from "./middleware";
import {
  findAllProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  incrementProductViews,
} from "./queries/market";

export const productRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        entrepreneurId: z.number().optional(),
        categoryId: z.number().optional(),
        status: z.enum(["active", "inactive"]).optional(),
        search: z.string().optional(),
        featured: z.boolean().optional(),
      }).optional()
    )
    .query(({ input }) => findAllProducts(input)),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await findProductById(input.id);
      if (result) {
        await incrementProductViews(result.id);
      }
      return result;
    }),

  create: editorQuery
    .input(
      z.object({
        entrepreneurId: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.string().optional(),
        image: z.string().optional(),
        categoryId: z.number().optional(),
        status: z.enum(["active", "inactive"]).optional(),
        featured: z.boolean().optional(),
      })
    )
    .mutation(({ input }) => createProduct(input)),

  update: editorQuery
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          entrepreneurId: z.number().optional(),
          name: z.string().min(1).optional(),
          description: z.string().optional(),
          price: z.string().optional(),
          image: z.string().optional(),
          categoryId: z.number().optional(),
          status: z.enum(["active", "inactive"]).optional(),
          featured: z.boolean().optional(),
        }),
      })
    )
    .mutation(({ input }) => updateProduct(input.id, input.data)),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteProduct(input.id)),
});
