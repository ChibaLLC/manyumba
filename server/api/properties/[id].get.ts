import { getPropertyById } from "~/server/db/queries";

export default defineEventHandler(async (event) => {
  try {
    const propertyId = getRouterParam(event, 'id');
    
    if (!propertyId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Property ID is required'
      });
    }

    const property = await getPropertyById(propertyId);
    
    if (!property) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Property not found'
      });
    }

    return {
      success: true,
      data: property
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    
    console.error('Error fetching property:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch property'
    });
  }
});
