import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  boolean,
  bigint,
  index,
} from "drizzle-orm/mysql-core";

// ==========================================
// Users (OAuth authentication)
// ==========================================
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "editor", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ==========================================
// Communes (Region del Maule)
// ==========================================
export const communes = mysqlTable("communes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  province: mysqlEnum("province", ["Talca", "Curico", "Linares", "Cauquenes"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Commune = typeof communes.$inferSelect;
export type InsertCommune = typeof communes.$inferInsert;

// ==========================================
// Categories for products/entrepreneurs
// ==========================================
export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  icon: varchar("icon", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// ==========================================
// Entrepreneurs
// ==========================================
export const entrepreneurs = mysqlTable(
  "entrepreneurs",
  {
    id: serial("id").primaryKey(),
    userId: bigint("userId", { mode: "number", unsigned: true }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    shortDescription: varchar("shortDescription", { length: 500 }),
    logo: varchar("logo", { length: 500 }),
    banner: varchar("banner", { length: 500 }),
    categoryId: bigint("categoryId", { mode: "number", unsigned: true }),
    subcategory: varchar("subcategory", { length: 255 }),
    communeId: bigint("communeId", { mode: "number", unsigned: true }),
    region: varchar("region", { length: 255 }).default("Maule"),
    address: varchar("address", { length: 500 }),
    phone: varchar("phone", { length: 50 }),
    whatsapp: varchar("whatsapp", { length: 50 }),
    email: varchar("email", { length: 320 }),
    website: varchar("website", { length: 500 }),
    facebook: varchar("facebook", { length: 500 }),
    instagram: varchar("instagram", { length: 500 }),
    mapUrl: text("mapUrl"),
    status: mysqlEnum("status", ["pending", "active", "inactive"]).default("pending").notNull(),
    featured: boolean("featured").default(false),
    views: int("views").default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (table) => ({
    statusIdx: index("status_idx").on(table.status),
    categoryIdx: index("category_idx").on(table.categoryId),
    communeIdx: index("commune_idx").on(table.communeId),
    featuredIdx: index("featured_idx").on(table.featured),
  })
);

export type Entrepreneur = typeof entrepreneurs.$inferSelect;
export type InsertEntrepreneur = typeof entrepreneurs.$inferInsert;

// ==========================================
// Products
// ==========================================
export const products = mysqlTable(
  "products",
  {
    id: serial("id").primaryKey(),
    entrepreneurId: bigint("entrepreneurId", { mode: "number", unsigned: true }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    price: varchar("price", { length: 100 }),
    image: varchar("image", { length: 500 }),
    categoryId: bigint("categoryId", { mode: "number", unsigned: true }),
    status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
    featured: boolean("featured").default(false),
    views: int("views").default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (table) => ({
    entrepreneurIdx: index("entrepreneur_idx").on(table.entrepreneurId),
    statusIdx: index("product_status_idx").on(table.status),
  })
);

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// ==========================================
// Banners (carousel/admin managed)
// ==========================================
export const banners = mysqlTable(
  "banners",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    subtitle: varchar("subtitle", { length: 500 }),
    image: varchar("image", { length: 500 }).notNull(),
    link: varchar("link", { length: 500 }),
    position: mysqlEnum("position", ["home_hero", "home_mid", "sidebar"]).default("home_hero").notNull(),
    order: int("order").default(0),
    active: boolean("active").default(true),
    startDate: timestamp("startDate"),
    endDate: timestamp("endDate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (table) => ({
    positionIdx: index("position_idx").on(table.position),
    activeIdx: index("active_idx").on(table.active),
  })
);

export type Banner = typeof banners.$inferSelect;
export type InsertBanner = typeof banners.$inferInsert;

// ==========================================
// News / Articles
// ==========================================
export const news = mysqlTable(
  "news",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    excerpt: varchar("excerpt", { length: 500 }),
    content: text("content"),
    image: varchar("image", { length: 500 }),
    authorId: bigint("authorId", { mode: "number", unsigned: true }),
    status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
    views: int("views").default(0),
    publishedAt: timestamp("publishedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (table) => ({
    statusIdx: index("news_status_idx").on(table.status),
    slugIdx: index("news_slug_idx").on(table.slug),
  })
);

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;

// ==========================================
// Stats (views tracking)
// ==========================================
export const stats = mysqlTable(
  "stats",
  {
    id: serial("id").primaryKey(),
    entityType: mysqlEnum("entityType", ["entrepreneur", "product", "news", "page"]).notNull(),
    entityId: bigint("entityId", { mode: "number", unsigned: true }).notNull(),
    eventType: mysqlEnum("eventType", ["view", "click", "contact", "share"]).default("view").notNull(),
    ipAddress: varchar("ipAddress", { length: 100 }),
    userAgent: varchar("userAgent", { length: 500 }),
    referrer: varchar("referrer", { length: 500 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    entityIdx: index("entity_idx").on(table.entityType, table.entityId),
    eventIdx: index("event_idx").on(table.eventType),
    createdIdx: index("created_idx").on(table.createdAt),
  })
);

export type Stat = typeof stats.$inferSelect;
export type InsertStat = typeof stats.$inferInsert;

// ==========================================
// Payment Methods (for entrepreneurs)
// ==========================================
export const paymentMethods = mysqlTable("paymentMethods", {
  id: serial("id").primaryKey(),
  entrepreneurId: bigint("entrepreneurId", { mode: "number", unsigned: true }).notNull(),
  type: mysqlEnum("type", ["mercadopago", "webpay", "flow", "khipu", "paypal", "transferencia"]).notNull(),
  accountKey: varchar("accountKey", { length: 500 }),
  accountEmail: varchar("accountEmail", { length: 320 }),
  bankName: varchar("bankName", { length: 255 }),
  accountNumber: varchar("accountNumber", { length: 100 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PaymentMethod = typeof paymentMethods.$inferSelect;

// ==========================================
// Orders
// ==========================================
export const orders = mysqlTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    buyerName: varchar("buyerName", { length: 255 }).notNull(),
    buyerEmail: varchar("buyerEmail", { length: 320 }).notNull(),
    buyerPhone: varchar("buyerPhone", { length: 50 }),
    buyerAddress: varchar("buyerAddress", { length: 500 }),
    totalAmount: varchar("totalAmount", { length: 100 }).notNull(),
    status: mysqlEnum("status", ["pending", "paid", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
    paymentMethod: mysqlEnum("paymentMethod", ["mercadopago", "webpay", "flow", "khipu", "paypal", "transferencia", "cash"]).notNull(),
    paymentReference: varchar("paymentReference", { length: 500 }),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (table) => ({
    statusIdx: index("order_status_idx").on(table.status),
  })
);

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// ==========================================
// Order Items
// ==========================================
export const orderItems = mysqlTable(
  "orderItems",
  {
    id: serial("id").primaryKey(),
    orderId: bigint("orderId", { mode: "number", unsigned: true }).notNull(),
    productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
    productName: varchar("productName", { length: 255 }).notNull(),
    productPrice: varchar("productPrice", { length: 100 }).notNull(),
    quantity: int("quantity").default(1).notNull(),
    entrepreneurId: bigint("entrepreneurId", { mode: "number", unsigned: true }).notNull(),
    entrepreneurName: varchar("entrepreneurName", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    orderIdx: index("order_item_order_idx").on(table.orderId),
    productIdx: index("order_item_product_idx").on(table.productId),
  })
);

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

// ==========================================
// Contact / Join Requests
// ==========================================
export const contacts = mysqlTable(
  "contacts",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    communeId: bigint("communeId", { mode: "number", unsigned: true }),
    message: text("message"),
    type: mysqlEnum("type", ["join", "contact", "support"]).default("contact").notNull(),
    status: mysqlEnum("status", ["new", "read", "replied", "closed"]).default("new").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (table) => ({
    typeIdx: index("contact_type_idx").on(table.type),
    statusIdx: index("contact_status_idx").on(table.status),
  })
);

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

// ==========================================
// Reviews / Ratings for Entrepreneurs
// ==========================================
export const reviews = mysqlTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    entrepreneurId: bigint("entrepreneurId", { mode: "number", unsigned: true }).notNull(),
    authorName: varchar("authorName", { length: 255 }).notNull(),
    authorEmail: varchar("authorEmail", { length: 320 }),
    rating: int("rating").notNull(), // 1-5 stars
    comment: text("comment"),
    status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (table) => ({
    entrepreneurIdx: index("review_entrepreneur_idx").on(table.entrepreneurId),
    statusIdx: index("review_status_idx").on(table.status),
  })
);

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// ==========================================
// Navigation Menu Items (Admin-managed)
// ==========================================
export const menuItems = mysqlTable(
  "menuItems",
  {
    id: serial("id").primaryKey(),
    label: varchar("label", { length: 100 }).notNull(),
    url: varchar("url", { length: 500 }).notNull(),
    icon: varchar("icon", { length: 50 }), // emoji or icon class
    position: int("position").default(0).notNull(), // sort order
    location: mysqlEnum("location", ["header", "footer", "mobile"]).default("header").notNull(),
    parentId: bigint("parentId", { mode: "number", unsigned: true }), // for dropdown submenus
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (table) => ({
    locationIdx: index("menu_location_idx").on(table.location),
    positionIdx: index("menu_position_idx").on(table.position),
    activeIdx: index("menu_active_idx").on(table.isActive),
  })
);

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = typeof menuItems.$inferInsert;