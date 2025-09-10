import { getDashboardStats } from "~~/server/db/queries";

export default defineEventHandler(async (event) => {
  try {
    // TODO: Add authentication check here
    // const user = await getCurrentUser(event);
    // if (!user || user.role !== 'admin') {
    //   throw createError({
    //     statusCode: 403,
    //     statusMessage: 'Forbidden'
    //   });
    // }

    const stats = await getDashboardStats();

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch dashboard statistics",
    });
  }
});
