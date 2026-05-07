import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  findAllContacts,
  createContact,
  updateContactStatus,
} from "./queries/market";

export const contactRouter = createRouter({
  list: adminQuery
    .input(
      z.object({
        type: z.enum(["join", "contact", "support"]).optional(),
        status: z.enum(["new", "read", "replied", "closed"]).optional(),
      }).optional()
    )
    .query(({ input }) => findAllContacts(input)),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        communeId: z.number().optional(),
        message: z.string().optional(),
        type: z.enum(["join", "contact", "support"]).default("contact"),
      })
    )
    .mutation(({ input }) => createContact(input)),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "read", "replied", "closed"]),
      })
    )
    .mutation(({ input }) => updateContactStatus(input.id, input.status)),
});
