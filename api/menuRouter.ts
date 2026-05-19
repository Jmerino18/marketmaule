import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { menuItems } from "@db/schema";
import { eq, asc, and } from "drizzle-orm";

export const menuRouter = createRouter({
  // List all menu items (public)
  list: publicQuery
    .input(
      z
        .object({
          location: z.enum(["header", "footer", "mobile"]).optional(),
          onlyActive: z.boolean().default(true),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.location) {
        conditions.push(eq(menuItems.location, input.location));
      }
      if (input?.onlyActive !== false) {
        conditions.push(eq(menuItems.isActive, true));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(menuItems)
        .where(where)
        .orderBy(asc(menuItems.position));

      return items;
    }),

  // Get single menu item
  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(menuItems)
        .where(eq(menuItems.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  // Create menu item
  create: publicQuery
    .input(
      z.object({
        label: z.string().min(1).max(100),
        url: z.string().min(1).max(500),
        icon: z.string().max(50).optional(),
        position: z.number().int().default(0),
        location: z.enum(["header", "footer", "mobile"]).default("header"),
        parentId: z.number().int().optional(),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(menuItems).values({
        label: input.label,
        url: input.url,
        icon: input.icon || null,
        position: input.position,
        location: input.location,
        parentId: input.parentId || null,
        isActive: input.isActive,
      });
      return { id: Number(result[0].insertId), ...input };
    }),

  // Update menu item
  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        label: z.string().min(1).max(100).optional(),
        url: z.string().min(1).max(500).optional(),
        icon: z.string().max(50).optional(),
        position: z.number().int().optional(),
        location: z.enum(["header", "footer", "mobile"]).optional(),
        parentId: z.number().int().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = {};

      if (data.label !== undefined) updateData.label = data.label;
      if (data.url !== undefined) updateData.url = data.url;
      if (data.icon !== undefined) updateData.icon = data.icon || null;
      if (data.position !== undefined) updateData.position = data.position;
      if (data.location !== undefined) updateData.location = data.location;
      if (data.parentId !== undefined) updateData.parentId = data.parentId || null;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;

      await db.update(menuItems).set(updateData).where(eq(menuItems.id, id));
      return { id, ...data };
    }),

  // Delete menu item
  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(menuItems).where(eq(menuItems.id, input.id));
      return { success: true, id: input.id };
    }),

  // Reorder menu items
  reorder: publicQuery
    .input(
      z.object({
        items: z.array(
          z.object({
            id: z.number(),
            position: z.number().int(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      for (const item of input.items) {
        await db
          .update(menuItems)
          .set({ position: item.position })
          .where(eq(menuItems.id, item.id));
      }
      return { success: true };
    }),
});
