import { and, desc, eq, ilike, sql, count, asc, or, gte, lte, inArray } from "drizzle-orm";
import db from "../index";
import { properties, propertyImages, users, reviews, favorites } from "../schema";
import type { Property, PropertyWithRelations, PropertyFilters, PaginationResult } from "../types";
import { getOrSetCache, invalidateCache, invalidateCachePattern, cacheKeys } from "~~/server/utils/cache";

// Get all properties with filters and pagination (cached)
export async function getProperties(filters: PropertyFilters = {}): Promise<PaginationResult<PropertyWithRelations>> {
  const cacheKey = cacheKeys.properties(filters);

  return getOrSetCache(
    cacheKey,
    () => getPropertiesUncached(filters),
    { ttl: 300 }, // 5 minutes cache
  );
}

// Internal uncached version
async function getPropertiesUncached(filters: PropertyFilters = {}): Promise<PaginationResult<PropertyWithRelations>> {
  const {
    propertyType,
    listingType,
    minPrice,
    maxPrice,
    city,
    state,
    country,
    minBedrooms,
    minBathrooms,
    minArea,
    maxArea,
    features,
    sortBy = "created_at_desc",
    page = 1,
    limit = 20,
  } = filters;

  const offset = (page - 1) * limit;

  // Build where conditions
  const conditions = [eq(properties.isPublished, true), eq(properties.isDeleted, false)];

  if (propertyType?.length) {
    conditions.push(inArray(properties.propertyType, propertyType));
  }
  if (listingType) {
    conditions.push(eq(properties.listingType, listingType));
  }
  if (minPrice !== undefined) {
    conditions.push(gte(sql`CAST(${properties.price} AS NUMERIC)`, minPrice));
  }
  if (maxPrice !== undefined) {
    conditions.push(lte(sql`CAST(${properties.price} AS NUMERIC)`, maxPrice));
  }
  if (city) {
    conditions.push(ilike(properties.city, `%${city}%`));
  }
  if (state) {
    conditions.push(ilike(properties.state, `%${state}%`));
  }
  if (country) {
    conditions.push(ilike(properties.country, `%${country}%`));
  }
  if (minBedrooms !== undefined) {
    conditions.push(gte(properties.bedrooms, minBedrooms));
  }
  if (minBathrooms !== undefined) {
    conditions.push(gte(properties.bathrooms, minBathrooms));
  }
  if (minArea !== undefined) {
    conditions.push(gte(sql`CAST(${properties.area} AS NUMERIC)`, minArea));
  }
  if (maxArea !== undefined) {
    conditions.push(lte(sql`CAST(${properties.area} AS NUMERIC)`, maxArea));
  }

  // Handle features filtering using JSONB
  if (features?.length) {
    const featureConditions = features.map((feature) => sql`${properties.features} ? ${feature}`);
    conditions.push(or(...featureConditions));
  }

  // Build order by
  let orderBy;
  switch (sortBy) {
    case "price_asc":
      orderBy = asc(sql`CAST(${properties.price} AS NUMERIC)`);
      break;
    case "price_desc":
      orderBy = desc(sql`CAST(${properties.price} AS NUMERIC)`);
      break;
    case "created_at_asc":
      orderBy = asc(properties.createdAt);
      break;
    default:
      orderBy = desc(properties.createdAt);
  }

  // Get total count
  const [totalResult] = await db
    .select({ count: count() })
    .from(properties)
    .where(and(...conditions));

  const total = totalResult.count;

  // Get properties with relations
  const result = await db
    .select({
      property: properties,
      owner: {
        ulid: users.ulid,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        profileImage: users.profileImage,
      },
      featuredImage: {
        ulid: propertyImages.ulid,
        imageUrl: propertyImages.imageUrl,
        isFeatured: propertyImages.isFeatured,
      },
    })
    .from(properties)
    .leftJoin(users, eq(properties.ownerUlid, users.ulid))
    .leftJoin(
      propertyImages,
      and(eq(properties.ulid, propertyImages.propertyUlid), eq(propertyImages.isFeatured, true)),
    )
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Transform results
  const data = result.map((row) => ({
    ...row.property,
    owner: row.owner,
    images: row.featuredImage ? [row.featuredImage] : [],
  }));

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
}

// Get property by ID with all relations
export async function getPropertyById(ulid: string): Promise<PropertyWithRelations | null> {
  const [property] = await db
    .select()
    .from(properties)
    .where(and(eq(properties.ulid, ulid), eq(properties.isDeleted, false)))
    .limit(1);

  if (!property) return null;

  // Get owner
  const [owner] = await db
    .select({
      ulid: users.ulid,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      profileImage: users.profileImage,
    })
    .from(users)
    .where(eq(users.ulid, property.ownerUlid))
    .limit(1);

  // Get images
  const images = await db
    .select()
    .from(propertyImages)
    .where(eq(propertyImages.propertyUlid, ulid))
    .orderBy(desc(propertyImages.isFeatured), asc(propertyImages.sortOrder));

  // Get reviews
  const propertyReviews = await db
    .select({
      review: reviews,
      user: {
        ulid: users.ulid,
        name: users.name,
        profileImage: users.profileImage,
      },
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userUlid, users.ulid))
    .where(and(eq(reviews.propertyUlid, ulid), eq(reviews.isApproved, true)))
    .orderBy(desc(reviews.createdAt));

  return {
    ...property,
    owner,
    images,
    reviews: propertyReviews.map((r) => ({ ...r.review, user: r.user })),
  };
}

// Create property
export async function createProperty(data: Omit<Property, "ulid" | "createdAt" | "updatedAt">): Promise<Property> {
  const [property] = await db
    .insert(properties)
    .values({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .returning();

  // Invalidate relevant caches
  await invalidateCachePattern("properties:*");
  await invalidateCache(cacheKeys.dashboardStats());
  await invalidateCache(cacheKeys.userProperties(data.ownerUlid));

  return property;
}

// Update property
export async function updateProperty(ulid: string, data: Partial<Property>): Promise<Property | null> {
  const [property] = await db
    .update(properties)
    .set({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(properties.ulid, ulid))
    .returning();

  if (property) {
    // Invalidate relevant caches
    await invalidateCachePattern("properties:*");
    await invalidateCache(cacheKeys.property(ulid));
    await invalidateCache(cacheKeys.userProperties(property.ownerUlid));
    await invalidateCache(cacheKeys.dashboardStats());
  }

  return property || null;
}

// Delete property (soft delete)
export async function deleteProperty(ulid: string): Promise<boolean> {
  const [result] = await db
    .update(properties)
    .set({
      isDeleted: true,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(properties.ulid, ulid))
    .returning();

  if (result) {
    // Invalidate relevant caches
    await invalidateCachePattern("properties:*");
    await invalidateCache(cacheKeys.property(ulid));
    await invalidateCache(cacheKeys.userProperties(result.ownerUlid));
    await invalidateCache(cacheKeys.dashboardStats());
  }

  return !!result;
}

// Get user's properties
export async function getUserProperties(userUlid: string, includeDeleted = false): Promise<PropertyWithRelations[]> {
  const conditions = [eq(properties.ownerUlid, userUlid)];

  if (!includeDeleted) {
    conditions.push(eq(properties.isDeleted, false));
  }

  const result = await db
    .select({
      property: properties,
      featuredImage: {
        ulid: propertyImages.ulid,
        imageUrl: propertyImages.imageUrl,
        isFeatured: propertyImages.isFeatured,
      },
    })
    .from(properties)
    .leftJoin(
      propertyImages,
      and(eq(properties.ulid, propertyImages.propertyUlid), eq(propertyImages.isFeatured, true)),
    )
    .where(and(...conditions))
    .orderBy(desc(properties.createdAt));

  return result.map((row) => ({
    ...row.property,
    images: row.featuredImage ? [row.featuredImage] : [],
  }));
}

// Get user's favorite properties
export async function getUserFavorites(userUlid: string): Promise<PropertyWithRelations[]> {
  const result = await db
    .select({
      property: properties,
      featuredImage: {
        ulid: propertyImages.ulid,
        imageUrl: propertyImages.imageUrl,
        isFeatured: propertyImages.isFeatured,
      },
    })
    .from(favorites)
    .innerJoin(properties, eq(favorites.propertyUlid, properties.ulid))
    .leftJoin(
      propertyImages,
      and(eq(properties.ulid, propertyImages.propertyUlid), eq(propertyImages.isFeatured, true)),
    )
    .where(and(eq(favorites.userUlid, userUlid), eq(properties.isPublished, true), eq(properties.isDeleted, false)))
    .orderBy(desc(favorites.createdAt));

  return result.map((row) => ({
    ...row.property,
    images: row.featuredImage ? [row.featuredImage] : [],
  }));
}

// Toggle favorite
export async function toggleFavorite(userUlid: string, propertyUlid: string): Promise<boolean> {
  const [existing] = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userUlid, userUlid), eq(favorites.propertyUlid, propertyUlid)))
    .limit(1);

  if (existing) {
    await db.delete(favorites).where(and(eq(favorites.userUlid, userUlid), eq(favorites.propertyUlid, propertyUlid)));
    return false; // Removed from favorites
  } else {
    await db.insert(favorites).values({
      userUlid,
      propertyUlid,
      createdAt: new Date().toISOString(),
    });
    return true; // Added to favorites
  }
}

// Search properties (full-text search)
export async function searchProperties(
  searchTerm: string,
  filters: Omit<PropertyFilters, "page" | "limit"> = {},
  page = 1,
  limit = 20,
): Promise<PaginationResult<PropertyWithRelations>> {
  const searchConditions = [
    or(
      ilike(properties.title, `%${searchTerm}%`),
      ilike(properties.description, `%${searchTerm}%`),
      ilike(properties.address, `%${searchTerm}%`),
      ilike(properties.city, `%${searchTerm}%`),
      ilike(properties.state, `%${searchTerm}%`),
    ),
  ];

  return getProperties({
    ...filters,
    page,
    limit,
    // We'll need to modify getProperties to accept additional where conditions
  });
}
