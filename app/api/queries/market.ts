import { getDb } from "./connection";
import { entrepreneurs, products, categories, banners, news, stats, contacts, communes } from "@db/schema";
import { eq, and, like, or, desc, asc, sql, count, gte } from "drizzle-orm";

// ==========================================
// Communes Queries
// ==========================================
export async function findAllCommunes() {
  return getDb().query.communes.findMany({
    orderBy: [asc(communes.name)],
  });
}

export async function findCommuneById(id: number) {
  return getDb().query.communes.findFirst({
    where: eq(communes.id, id),
  });
}

export async function createCommune(data: typeof communes.$inferInsert) {
  const db = getDb();
  const [{ id }] = await db.insert(communes).values(data).$returningId();
  return findCommuneById(id);
}

// ==========================================
// Entrepreneurs Queries
// ==========================================
export async function findAllEntrepreneurs(filters?: { 
  status?: "pending" | "active" | "inactive"; 
  categoryId?: number; 
  communeId?: number; 
  featured?: boolean; 
  search?: string;
}) {
  const db = getDb();
  const conditions = [];

  if (filters?.status) conditions.push(eq(entrepreneurs.status, filters.status));
  if (filters?.categoryId) conditions.push(eq(entrepreneurs.categoryId, filters.categoryId));
  if (filters?.communeId) conditions.push(eq(entrepreneurs.communeId, filters.communeId));
  if (filters?.featured !== undefined) conditions.push(eq(entrepreneurs.featured, filters.featured));
  if (filters?.search) {
    conditions.push(
      or(
        like(entrepreneurs.name, `%${filters.search}%`),
        like(entrepreneurs.description, `%${filters.search}%`),
        like(entrepreneurs.shortDescription, `%${filters.search}%`)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db.query.entrepreneurs.findMany({
    where: whereClause,
    with: { category: true, commune: true },
    orderBy: [desc(entrepreneurs.createdAt)],
  });
}

export async function findEntrepreneurBySlug(slug: string) {
  return getDb().query.entrepreneurs.findFirst({
    where: eq(entrepreneurs.slug, slug),
    with: { category: true, commune: true, products: true },
  });
}

export async function findEntrepreneurById(id: number) {
  return getDb().query.entrepreneurs.findFirst({
    where: eq(entrepreneurs.id, id),
    with: { category: true, commune: true, products: true },
  });
}

export async function createEntrepreneur(data: typeof entrepreneurs.$inferInsert) {
  const db = getDb();
  const [{ id }] = await db.insert(entrepreneurs).values(data).$returningId();
  return findEntrepreneurById(id);
}

export async function updateEntrepreneur(id: number, data: Partial<typeof entrepreneurs.$inferInsert>) {
  await getDb().update(entrepreneurs).set(data).where(eq(entrepreneurs.id, id));
  return findEntrepreneurById(id);
}

export async function deleteEntrepreneur(id: number) {
  await getDb().delete(entrepreneurs).where(eq(entrepreneurs.id, id));
}

export async function incrementEntrepreneurViews(id: number) {
  await getDb()
    .update(entrepreneurs)
    .set({ views: sql`${entrepreneurs.views} + 1` })
    .where(eq(entrepreneurs.id, id));
}

// ==========================================
// Products Queries
// ==========================================
export async function findAllProducts(filters?: { 
  entrepreneurId?: number; 
  categoryId?: number; 
  status?: "active" | "inactive"; 
  search?: string; 
  featured?: boolean;
}) {
  const db = getDb();
  const conditions = [];

  if (filters?.entrepreneurId) conditions.push(eq(products.entrepreneurId, filters.entrepreneurId));
  if (filters?.categoryId) conditions.push(eq(products.categoryId, filters.categoryId));
  if (filters?.status) conditions.push(eq(products.status, filters.status));
  if (filters?.featured !== undefined) conditions.push(eq(products.featured, filters.featured));
  if (filters?.search) {
    conditions.push(
      or(
        like(products.name, `%${filters.search}%`),
        like(products.description, `%${filters.search}%`)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db.query.products.findMany({
    where: whereClause,
    with: { entrepreneur: { with: { category: true, commune: true } } },
    orderBy: [desc(products.createdAt)],
  });
}

export async function findProductById(id: number) {
  return getDb().query.products.findFirst({
    where: eq(products.id, id),
    with: { entrepreneur: true },
  });
}

export async function createProduct(data: typeof products.$inferInsert) {
  const db = getDb();
  const [{ id }] = await db.insert(products).values(data).$returningId();
  return findProductById(id);
}

export async function updateProduct(id: number, data: Partial<typeof products.$inferInsert>) {
  await getDb().update(products).set(data).where(eq(products.id, id));
  return findProductById(id);
}

export async function deleteProduct(id: number) {
  await getDb().delete(products).where(eq(products.id, id));
}

export async function incrementProductViews(id: number) {
  await getDb()
    .update(products)
    .set({ views: sql`${products.views} + 1` })
    .where(eq(products.id, id));
}

// ==========================================
// Categories Queries
// ==========================================
export async function findAllCategories() {
  return getDb().query.categories.findMany({
    orderBy: [asc(categories.name)],
  });
}

export async function findCategoryById(id: number) {
  return getDb().query.categories.findFirst({
    where: eq(categories.id, id),
  });
}

export async function createCategory(data: typeof categories.$inferInsert) {
  const db = getDb();
  const [{ id }] = await db.insert(categories).values(data).$returningId();
  return findCategoryById(id);
}

export async function updateCategory(id: number, data: Partial<typeof categories.$inferInsert>) {
  await getDb().update(categories).set(data).where(eq(categories.id, id));
  return findCategoryById(id);
}

export async function deleteCategory(id: number) {
  await getDb().delete(categories).where(eq(categories.id, id));
}

// ==========================================
// Banners Queries
// ==========================================
export async function findAllBanners(position?: "home_hero" | "home_mid" | "sidebar") {
  const db = getDb();
  const conditions = [eq(banners.active, true)];
  if (position) conditions.push(eq(banners.position, position));

  return db.query.banners.findMany({
    where: and(...conditions),
    orderBy: [asc(banners.order)],
  });
}

export async function findBannerById(id: number) {
  return getDb().query.banners.findFirst({
    where: eq(banners.id, id),
  });
}

export async function createBanner(data: typeof banners.$inferInsert) {
  const db = getDb();
  const [{ id }] = await db.insert(banners).values(data).$returningId();
  return findBannerById(id);
}

export async function updateBanner(id: number, data: Partial<typeof banners.$inferInsert>) {
  await getDb().update(banners).set(data).where(eq(banners.id, id));
  return findBannerById(id);
}

export async function deleteBanner(id: number) {
  await getDb().delete(banners).where(eq(banners.id, id));
}

// ==========================================
// News Queries
// ==========================================
export async function findAllNews(filters?: { 
  status?: "draft" | "published" | "archived"; 
  search?: string; 
  limit?: number;
}) {
  const db = getDb();
  const conditions = [];

  if (filters?.status) conditions.push(eq(news.status, filters.status));
  if (filters?.search) {
    conditions.push(
      or(
        like(news.title, `%${filters.search}%`),
        like(news.excerpt, `%${filters.search}%`)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db.query.news.findMany({
    where: whereClause,
    with: { author: true },
    orderBy: [desc(news.publishedAt), desc(news.createdAt)],
    limit: filters?.limit,
  });
}

export async function findNewsBySlug(slug: string) {
  return getDb().query.news.findFirst({
    where: eq(news.slug, slug),
    with: { author: true },
  });
}

export async function findNewsById(id: number) {
  return getDb().query.news.findFirst({
    where: eq(news.id, id),
    with: { author: true },
  });
}

export async function createNews(data: typeof news.$inferInsert) {
  const db = getDb();
  const [{ id }] = await db.insert(news).values(data).$returningId();
  return findNewsById(id);
}

export async function updateNews(id: number, data: Partial<typeof news.$inferInsert>) {
  await getDb().update(news).set(data).where(eq(news.id, id));
  return findNewsById(id);
}

export async function deleteNews(id: number) {
  await getDb().delete(news).where(eq(news.id, id));
}

export async function incrementNewsViews(id: number) {
  await getDb()
    .update(news)
    .set({ views: sql`${news.views} + 1` })
    .where(eq(news.id, id));
}

// ==========================================
// Stats Queries
// ==========================================
export async function createStat(data: typeof stats.$inferInsert) {
  await getDb().insert(stats).values(data);
}

export async function getTopEntrepreneurs(limit: number = 10) {
  return getDb()
    .select({
      id: entrepreneurs.id,
      name: entrepreneurs.name,
      slug: entrepreneurs.slug,
      logo: entrepreneurs.logo,
      views: entrepreneurs.views,
    })
    .from(entrepreneurs)
    .where(eq(entrepreneurs.status, "active"))
    .orderBy(desc(entrepreneurs.views))
    .limit(limit);
}

export async function getTopProducts(limit: number = 10) {
  return getDb()
    .select({
      id: products.id,
      name: products.name,
      image: products.image,
      views: products.views,
      entrepreneurName: entrepreneurs.name,
      entrepreneurSlug: entrepreneurs.slug,
    })
    .from(products)
    .innerJoin(entrepreneurs, eq(products.entrepreneurId, entrepreneurs.id))
    .where(eq(products.status, "active"))
    .orderBy(desc(products.views))
    .limit(limit);
}

export async function getStatsByCommune() {
  return getDb()
    .select({
      commune: communes.name,
      count: count(entrepreneurs.id),
    })
    .from(entrepreneurs)
    .innerJoin(communes, eq(entrepreneurs.communeId, communes.id))
    .where(eq(entrepreneurs.status, "active"))
    .groupBy(communes.name)
    .orderBy(desc(count(entrepreneurs.id)));
}

export async function getRecentStats(days: number = 30) {
  const date = new Date();
  date.setDate(date.getDate() - days);

  return getDb()
    .select({
      entityType: stats.entityType,
      count: count(stats.id),
    })
    .from(stats)
    .where(gte(stats.createdAt, date))
    .groupBy(stats.entityType);
}

// ==========================================
// Contacts Queries
// ==========================================
export async function findAllContacts(filters?: { 
  type?: "join" | "contact" | "support"; 
  status?: "new" | "read" | "replied" | "closed";
}) {
  const db = getDb();
  const conditions = [];
  if (filters?.type) conditions.push(eq(contacts.type, filters.type));
  if (filters?.status) conditions.push(eq(contacts.status, filters.status));

  return db.query.contacts.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: [desc(contacts.createdAt)],
  });
}

export async function createContact(data: typeof contacts.$inferInsert) {
  const db = getDb();
  const [{ id }] = await db.insert(contacts).values(data).$returningId();
  return db.query.contacts.findFirst({ where: eq(contacts.id, id) });
}

export async function updateContactStatus(id: number, status: "new" | "read" | "replied" | "closed") {
  await getDb().update(contacts).set({ status }).where(eq(contacts.id, id));
  return getDb().query.contacts.findFirst({ where: eq(contacts.id, id) });
}
