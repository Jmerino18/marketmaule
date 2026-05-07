import { relations } from "drizzle-orm";
import {
  users,
  entrepreneurs,
  products,
  categories,
  news,
  communes,
  orders,
  orderItems,
  paymentMethods,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  entrepreneurs: many(entrepreneurs),
  news: many(news),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  entrepreneurs: many(entrepreneurs),
  products: many(products),
}));

export const communesRelations = relations(communes, ({ many }) => ({
  entrepreneurs: many(entrepreneurs),
}));

export const entrepreneursRelations = relations(entrepreneurs, ({ one, many }) => ({
  user: one(users, {
    fields: [entrepreneurs.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [entrepreneurs.categoryId],
    references: [categories.id],
  }),
  commune: one(communes, {
    fields: [entrepreneurs.communeId],
    references: [communes.id],
  }),
  products: many(products),
  paymentMethods: many(paymentMethods),
}));

export const productsRelations = relations(products, ({ one }) => ({
  entrepreneur: one(entrepreneurs, {
    fields: [products.entrepreneurId],
    references: [entrepreneurs.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const newsRelations = relations(news, ({ one }) => ({
  author: one(users, {
    fields: [news.authorId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  entrepreneur: one(entrepreneurs, {
    fields: [paymentMethods.entrepreneurId],
    references: [entrepreneurs.id],
  }),
}));
