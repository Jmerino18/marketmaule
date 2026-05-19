import { z } from "zod";
import { createRouter, publicQuery, editorQuery } from "./middleware";
import {
  findAllCommunes,
  findCommuneById,
  createCommune,
} from "./queries/market";

export const communeRouter = createRouter({
  list: publicQuery.query(() => findAllCommunes()),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => findCommuneById(input.id)),

  create: editorQuery
    .input(
      z.object({
        name: z.string().min(1),
        province: z.enum(["Talca", "Curico", "Linares", "Cauquenes"]),
      })
    )
    .mutation(({ input }) => createCommune(input)),
});
