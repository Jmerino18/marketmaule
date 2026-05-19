import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  findReviewsByEntrepreneurId,
  findAllReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
  getAverageRating,
} from "./queries/market";

export const reviewRouter = createRouter({
  // List reviews for a specific entrepreneur (public, only approved)
  byEntrepreneur: publicQuery
    .input(z.object({ entrepreneurId: z.number() }))
    .query(({ input }) =>
      findReviewsByEntrepreneurId(input.entrepreneurId, "approved")
    ),

  // Get average rating for an entrepreneur (public)
  average: publicQuery
    .input(z.object({ entrepreneurId: z.number() }))
    .query(({ input }) => getAverageRating(input.entrepreneurId)),

  // Create a new review (public, no auth required)
  create: publicQuery
    .input(
      z.object({
        entrepreneurId: z.number(),
        authorName: z.string().min(1).max(255),
        authorEmail: z.string().email().optional(),
        rating: z.number().min(1).max(5),
        comment: z.string().min(1).max(2000),
      })
    )
    .mutation(({ input }) =>
      createReview({
        entrepreneurId: input.entrepreneurId,
        authorName: input.authorName,
        authorEmail: input.authorEmail || null,
        rating: input.rating,
        comment: input.comment,
        status: "pending", // All new reviews go to moderation
      })
    ),

  // List all reviews with filters (admin only)
  list: adminQuery
    .input(
      z.object({
        entrepreneurId: z.number().optional(),
        status: z.enum(["pending", "approved", "rejected"]).optional(),
      }).optional()
    )
    .query(({ input }) => findAllReviews(input || {})),

  // Update review status - approve/reject (admin only)
  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "rejected"]),
      })
    )
    .mutation(({ input }) => updateReviewStatus(input.id, input.status)),

  // Delete a review (admin only)
  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteReview(input.id)),
});
