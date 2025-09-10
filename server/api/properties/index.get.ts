import { getProperties } from "~~/server/db/queries";
import type { PropertyFilters } from "~~/server/db/types";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    // Parse query parameters
    const filters: PropertyFilters = {
      propertyType: query.propertyType
        ? Array.isArray(query.propertyType)
          ? query.propertyType
          : [query.propertyType]
        : undefined,
      listingType: query.listingType as PropertyFilters["listingType"],
      minPrice: query.minPrice ? Number(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
      city: query.city as string,
      state: query.state as string,
      country: query.country as string,
      minBedrooms: query.minBedrooms ? Number(query.minBedrooms) : undefined,
      minBathrooms: query.minBathrooms ? Number(query.minBathrooms) : undefined,
      minArea: query.minArea ? Number(query.minArea) : undefined,
      maxArea: query.maxArea ? Number(query.maxArea) : undefined,
      features: query.features ? (Array.isArray(query.features) ? query.features : [query.features]) : undefined,
      sortBy: (query.sortBy as PropertyFilters["sortBy"]) || "created_at_desc",
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    };

    // Limit maximum page size for performance
    if (filters.limit && filters.limit > 100) {
      filters.limit = 100;
    }

    const result = await getProperties(filters);

    return {
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
      },
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch properties",
    });
  }
});
