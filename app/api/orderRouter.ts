import { z } from "zod";
import { createRouter, publicQuery, editorQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, orderItems } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";

export const orderRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        buyerName: z.string().min(1),
        buyerEmail: z.string().email(),
        buyerPhone: z.string().optional(),
        buyerAddress: z.string().optional(),
        paymentMethod: z.enum(["mercadopago", "webpay", "flow", "khipu", "paypal", "transferencia", "cash"]),
        notes: z.string().optional(),
        items: z.array(
          z.object({
            productId: z.number(),
            productName: z.string(),
            productPrice: z.string(),
            quantity: z.number().min(1),
            entrepreneurId: z.number(),
            entrepreneurName: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Calculate total
      const total = input.items.reduce((acc, item) => {
        const price = parseFloat(item.productPrice.replace(/[^0-9.]/g, "")) || 0;
        return acc + price * item.quantity;
      }, 0);

      const [{ id: orderId }] = await db.insert(orders).values({
        buyerName: input.buyerName,
        buyerEmail: input.buyerEmail,
        buyerPhone: input.buyerPhone,
        buyerAddress: input.buyerAddress,
        totalAmount: `$${total.toLocaleString("es-CL")}`,
        status: "pending",
        paymentMethod: input.paymentMethod,
        notes: input.notes,
      }).$returningId();

      await db.insert(orderItems).values(
        input.items.map((item) => ({
          orderId,
          productId: item.productId,
          productName: item.productName,
          productPrice: item.productPrice,
          quantity: item.quantity,
          entrepreneurId: item.entrepreneurId,
          entrepreneurName: item.entrepreneurName,
        }))
      );

      return { orderId, total: `$${total.toLocaleString("es-CL")}` };
    }),

  list: publicQuery
    .input(
      z.object({
        status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];
      if (input?.status) conditions.push(eq(orders.status, input.status));

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      return db.query.orders.findMany({
        where: whereClause,
        with: { items: true },
        orderBy: [desc(orders.createdAt)],
      });
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      return getDb().query.orders.findFirst({
        where: eq(orders.id, input.id),
        with: { items: true },
      });
    }),

  updateStatus: editorQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]),
      })
    )
    .mutation(({ input }) => {
      return getDb().update(orders).set({ status: input.status }).where(eq(orders.id, input.id));
    }),
});
