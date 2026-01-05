import { searchProperties } from "~~/server/db/queries";
import type { PropertyFilters } from "~~/server/db/types";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    const searchTerm = query.q as string;
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw createError({
        statusCode: 400,
        statusMessage: "Search term must be at least 2 characters long",
      });
    }

    // Parse additional filters
    const filters: Omit<PropertyFilters, "page" | "limit"> = {
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
    };

    const page = query.page ? Number(query.page) : 1;
    const limit = Math.min(query.limit ? Number(query.limit) : 20, 100);

    const result = await searchProperties(searchTerm.trim(), filters, page, limit);

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
      searchTerm: searchTerm.trim(),
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    console.error("Error searching properties:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to search properties",
    });
  }
});
