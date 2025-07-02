<template>
  <div class="space-y-6">
    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Properties -->
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Properties</p>
              <p class="text-3xl font-bold text-gray-900">{{ data?.totalProperties || 0 }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <Icon name="bxs:building-house" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div class="mt-4">
            <span class="text-sm text-green-600">+12% from last month</span>
          </div>
        </CardContent>
      </Card>

      <!-- Total Users -->
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Users</p>
              <p class="text-3xl font-bold text-gray-900">{{ data?.totalUsers || 0 }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <Icon name="bxs:user" class="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div class="mt-4">
            <span class="text-sm text-green-600">+8% from last month</span>
          </div>
        </CardContent>
      </Card>

      <!-- Active Listings -->
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Listings</p>
              <p class="text-3xl font-bold text-gray-900">{{ data?.totalListings || 0 }}</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <Icon name="bxs:list-ul" class="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div class="mt-4">
            <span class="text-sm text-green-600">+5% from last month</span>
          </div>
        </CardContent>
      </Card>

      <!-- Revenue -->
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p class="text-3xl font-bold text-gray-900">$24,500</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <Icon name="bxs:dollar-circle" class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div class="mt-4">
            <span class="text-sm text-green-600">+15% from last month</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Properties -->
      <Card>
        <CardHeader>
          <CardTitle>Recent Properties</CardTitle>
          <CardDescription>Latest property listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4" v-if="pending">
            <Skeleton class="h-4 w-full" v-for="i in 3" :key="i" />
          </div>
          <div class="space-y-4" v-else>
            <div class="flex items-center space-x-3 p-3 border rounded-lg" v-for="property in recentProperties" :key="property.ulid">
              <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div class="flex-1">
                <h4 class="font-medium">{{ property.title }}</h4>
                <p class="text-sm text-gray-600">{{ property.city }}, {{ property.state }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium">${{ property.price }}</p>
                <p class="text-xs text-gray-500">{{ property.propertyType }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Quick Actions -->
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 gap-4">
            <Button as-child variant="outline" class="h-20 flex-col">
              <NuxtLink to="/admin/properties">
                <Icon name="bxs:building-house" class="w-6 h-6 mb-2" />
                Manage Properties
              </NuxtLink>
            </Button>
            <Button as-child variant="outline" class="h-20 flex-col">
              <NuxtLink to="/admin/users">
                <Icon name="bxs:user" class="w-6 h-6 mb-2" />
                Manage Users
              </NuxtLink>
            </Button>
            <Button as-child variant="outline" class="h-20 flex-col">
              <NuxtLink to="/admin/reviews">
                <Icon name="bxs:star" class="w-6 h-6 mb-2" />
                Review Queue
              </NuxtLink>
            </Button>
            <Button as-child variant="outline" class="h-20 flex-col">
              <NuxtLink to="/admin/analytics">
                <Icon name="bxs:bar-chart-alt-2" class="w-6 h-6 mb-2" />
                View Analytics
              </NuxtLink>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define page meta
definePageMeta({
  layout: 'admin'
});

// Fetch dashboard stats
const { data, pending, error } = await $fetch('/api/admin/dashboard-stats').catch(() => ({ 
  data: { totalProperties: 0, totalUsers: 0, totalListings: 0 }, 
  pending: false, 
  error: null 
}));

// Mock recent properties for now
const recentProperties = [
  {
    ulid: '1',
    title: 'Modern Apartment in Downtown',
    city: 'New York',
    state: 'NY',
    price: '3,500',
    propertyType: 'apartment'
  },
  {
    ulid: '2', 
    title: 'Spacious Family House',
    city: 'Los Angeles',
    state: 'CA',
    price: '5,200',
    propertyType: 'house'
  },
  {
    ulid: '3',
    title: 'Commercial Office Space', 
    city: 'Chicago',
    state: 'IL',
    price: '8,000',
    propertyType: 'commercial'
  }
];
</script>
