// Properties
export * from './properties';

// Users & Authentication
export * from './users';

// Appointments & Reviews
export * from './appointments';

// Analytics queries for admin dashboard
export async function getDashboardStats() {
  const { getProperties } = await import('./properties');
  const { getAllUsers } = await import('./users');
  const { getUserAppointments } = await import('./appointments');
  
  // This would typically be optimized with a single query
  // For now, we'll use the existing functions
  const [propertiesData, usersData] = await Promise.all([
    getProperties({ limit: 1 }), // Just get count
    getAllUsers({ limit: 1 }) // Just get count
  ]);
  
  return {
    totalProperties: propertiesData.total,
    totalUsers: usersData.total,
    totalListings: propertiesData.total, // Same as properties for now
    // Add more dashboard stats as needed
  };
}


