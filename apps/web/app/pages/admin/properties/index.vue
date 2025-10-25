<template>
  <div class="space-y-6">
    <!-- Header with Actions -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Properties Management</h1>
        <p class="text-gray-600">Manage all property listings on the platform</p>
      </div>
      <div class="flex space-x-3">
        <Button variant="outline" @click="refreshData">
          <Icon name="bxs:refresh" class="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button as-child>
          <NuxtLink to="/listings/new">
            <Icon name="bxs:plus" class="w-4 h-4 mr-2" />
            Add Property
          </NuxtLink>
        </Button>
      </div>
    </div>

    <!-- Filters -->
    <Card>
      <CardContent class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label for="search">Search</Label>
            <Input id="search" v-model="filters.search" placeholder="Search properties..." @input="debouncedSearch" />
          </div>
          <div>
            <Label for="status">Status</Label>
            <Select v-model="filters.status">
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="null">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="propertyType">Property Type</Label>
            <Select v-model="filters.propertyType">
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="null">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="listingType">Listing Type</Label>
            <Select v-model="filters.listingType">
              <SelectTrigger>
                <SelectValue placeholder="All Listings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="null">All Listings</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
                <SelectItem value="sale">For Sale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Properties Table -->
    <Card>
      <CardContent class="p-0">
        <div class="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[100px]">Image</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="pending">
                <TableCell colspan="8" class="text-center py-8">
                  <div class="flex items-center justify-center space-x-2">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    <span>Loading properties...</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow v-else-if="error">
                <TableCell colspan="8" class="text-center py-8 text-red-600">
                  Error loading properties. Please try again.
                </TableCell>
              </TableRow>
              <TableRow v-else-if="!properties?.length">
                <TableCell colspan="8" class="text-center py-8 text-gray-500"> No properties found. </TableCell>
              </TableRow>
              <TableRow v-else v-for="property in properties" :key="property.ulid">
                <TableCell>
                  <div class="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      v-if="property.images?.[0]?.imageUrl"
                      :src="property.images[0].imageUrl"
                      :alt="property.title"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p class="font-medium">{{ property.title }}</p>
                    <p class="text-sm text-gray-600">{{ property.propertyType }} • {{ property.listingType }}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p class="font-medium">{{ property.owner?.name }}</p>
                    <p class="text-sm text-gray-600">{{ property.owner?.email }}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p class="font-medium">{{ property.city }}, {{ property.state }}</p>
                    <p class="text-sm text-gray-600">{{ property.country }}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span class="font-medium">${{ formatPrice(property.price) }}</span>
                </TableCell>
                <TableCell>
                  <Badge :variant="getStatusVariant(property.isPublished, property.isDeleted)">
                    {{ getStatusText(property.isPublished, property.isDeleted) }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span class="text-sm text-gray-600">{{ formatDate(property.createdAt) }}</span>
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" as-child>
                      <NuxtLink :to="`/listings/${property.ulid}`">
                        <Icon name="bxs:show" class="w-4 h-4" />
                      </NuxtLink>
                    </Button>
                    <Button variant="ghost" size="sm" as-child>
                      <NuxtLink :to="`/admin/properties/${property.ulid}/edit`">
                        <Icon name="bxs:edit" class="w-4 h-4" />
                      </NuxtLink>
                    </Button>
                    <Button variant="ghost" size="sm" @click="deleteProperty(property.ulid)">
                      <Icon name="bxs:trash" class="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Pagination -->
    <div class="flex items-center justify-between" v-if="pagination && pagination.totalPages > 1">
      <div class="text-sm text-gray-600">
        Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
        {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} properties
      </div>
      <div class="flex space-x-2">
        <Button variant="outline" size="sm" :disabled="pagination.page <= 1" @click="changePage(pagination.page - 1)">
          Previous
        </Button>
        <Button variant="outline" size="sm" :disabled="!pagination.hasMore" @click="changePage(pagination.page + 1)">
          Next
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Input } from "~/components/ui/input";

// Define page meta
definePageMeta({
  layout: "admin",
});

// Reactive filters
const filters = reactive({
  search: "",
  status: "",
  propertyType: "",
  listingType: "",
  page: 1,
  limit: 20,
});

// Computed query for API
const queryParams = computed(() => {
  const params: any = {
    page: filters.page,
    limit: filters.limit,
  };

  if (filters.search) params.search = filters.search;
  if (filters.propertyType) params.propertyType = [filters.propertyType];
  if (filters.listingType) params.listingType = filters.listingType;

  return params;
});

// Fetch properties data
const {
  data: response,
  pending,
  error,
  refresh,
} = await useFetch("/api/properties", {
  query: queryParams,
  server: true,
});

const properties = computed(() => response.value?.data || []);
const pagination = computed(() => response.value?.pagination);

// Debounced search
const debouncedSearch = debounce(() => {
  filters.page = 1; // Reset to first page on search
  refresh();
}, 300);

// Watch filters for changes
watch([() => filters.status, () => filters.propertyType, () => filters.listingType], () => {
  filters.page = 1;
  refresh();
});

// Helper functions
function formatPrice(price: string | number): string {
  return new Intl.NumberFormat("en-US").format(Number(price));
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusVariant(isPublished: boolean, isDeleted: boolean) {
  if (isDeleted) return "destructive";
  if (isPublished) return "default";
  return "secondary";
}

function getStatusText(isPublished: boolean, isDeleted: boolean): string {
  if (isDeleted) return "Deleted";
  if (isPublished) return "Published";
  return "Draft";
}

function changePage(page: number) {
  filters.page = page;
  refresh();
}

function refreshData() {
  refresh();
}

async function deleteProperty(propertyId: string) {
  if (!confirm("Are you sure you want to delete this property?")) return;

  try {
    await $fetch(`/api/admin/properties/${propertyId}`, {
      method: "DELETE",
    });
    refresh();
  } catch (error) {
    console.error("Error deleting property:", error);
    alert("Failed to delete property");
  }
}
</script>
