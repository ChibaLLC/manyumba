<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section with Search -->
    <section class="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl font-bold mb-4">Find Your Perfect Property</h1>
          <p class="text-xl mb-8">Discover amazing properties for rent and sale</p>
          
          <!-- Search Form -->
          <div class="bg-white rounded-lg p-6 shadow-lg">
            <form @submit.prevent="handleSearch" class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  v-model="searchQuery"
                  placeholder="Search location, property type..."
                  class="w-full"
                />
              </div>
              <div>
                <Select v-model="filters.listingType">
                  <SelectTrigger>
                    <SelectValue placeholder="Buy/Rent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="sale">Buy</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select v-model="filters.propertyType">
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" class="w-full">
                <Icon name="bxs:search" class="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters and Results -->
    <section class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <aside class="lg:w-1/4">
          <Card class="sticky top-4">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Price Range -->
              <div>
                <Label class="text-sm font-medium mb-3 block">Price Range</Label>
                <div class="grid grid-cols-2 gap-2">
                  <Input
                    v-model.number="filters.minPrice"
                    type="number"
                    placeholder="Min"
                    @input="debouncedFilter"
                  />
                  <Input
                    v-model.number="filters.maxPrice"
                    type="number"
                    placeholder="Max"
                    @input="debouncedFilter"
                  />
                </div>
              </div>

              <!-- Bedrooms -->
              <div>
                <Label class="text-sm font-medium mb-3 block">Bedrooms</Label>
                <div class="grid grid-cols-5 gap-2">
                  <Button
                    v-for="num in [1,2,3,4,5]"
                    :key="num"
                    variant="outline"
                    size="sm"
                    :class="filters.minBedrooms === num ? 'bg-purple-100 border-purple-500' : ''"
                    @click="toggleBedrooms(num)"
                  >
                    {{ num }}{{ num === 5 ? '+' : '' }}
                  </Button>
                </div>
              </div>

              <!-- Bathrooms -->
              <div>
                <Label class="text-sm font-medium mb-3 block">Bathrooms</Label>
                <div class="grid grid-cols-4 gap-2">
                  <Button
                    v-for="num in [1,2,3,4]"
                    :key="num"
                    variant="outline"
                    size="sm"
                    :class="filters.minBathrooms === num ? 'bg-purple-100 border-purple-500' : ''"
                    @click="toggleBathrooms(num)"
                  >
                    {{ num }}{{ num === 4 ? '+' : '' }}
                  </Button>
                </div>
              </div>

              <!-- Sort -->
              <div>
                <Label class="text-sm font-medium mb-3 block">Sort By</Label>
                <Select v-model="filters.sortBy" @update:model-value="handleSort">
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at_desc">Newest First</SelectItem>
                    <SelectItem value="created_at_asc">Oldest First</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Clear Filters -->
              <Button variant="outline" class="w-full" @click="clearFilters">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        </aside>

        <!-- Property Grid -->
        <main class="lg:w-3/4">
          <!-- Results Header -->
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Properties</h2>
              <p class="text-gray-600" v-if="!pending">
                {{ totalProperties }} properties found
              </p>
            </div>
            
            <!-- View Toggle -->
            <div class="flex border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                :class="viewMode === 'grid' ? 'bg-gray-100' : ''"
                @click="viewMode = 'grid'"
              >
                <Icon name="bxs:grid" class="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="viewMode === 'list' ? 'bg-gray-100' : ''"
                @click="viewMode = 'list'"
              >
                <Icon name="bxs:list-ul" class="w-4 h-4" />
              </Button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="pending && !properties.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PropertyCardSkeleton v-for="i in 6" :key="i" />
          </div>

          <!-- Empty State -->
          <div v-else-if="!properties.length && !pending" class="text-center py-12">
            <Icon name="bxs:home" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p class="text-gray-600 mb-4">Try adjusting your search criteria</p>
            <Button @click="clearFilters">Clear Filters</Button>
          </div>

          <!-- Properties Grid/List -->
          <div
            v-else
            :class="[
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
            ]"
          >
            <PropertyCard
              v-for="property in properties"
              :key="property.ulid"
              :property="property"
              :view-mode="viewMode"
              @favorite="handleFavorite"
            />
          </div>

          <!-- Load More / Infinite Scroll -->
          <div ref="loadMoreTrigger" class="mt-8 text-center">
            <div v-if="pending && properties.length" class="py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p class="mt-2 text-gray-600">Loading more properties...</p>
            </div>
            <div v-else-if="hasMore" class="py-4">
              <Button @click="loadMore" variant="outline">
                Load More Properties
              </Button>
            </div>
            <div v-else-if="properties.length" class="py-4 text-gray-500">
              <p>You've seen all available properties</p>
            </div>
          </div>
        </main>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es';
import type { PropertyWithRelations } from '~/server/db/types';

// SEO
useHead({
  title: 'Property Listings - Find Your Perfect Home',
  meta: [
    { name: 'description', content: 'Browse our extensive collection of properties for rent and sale. Find your perfect home today.' },
    { name: 'keywords', content: 'property, real estate, rent, buy, apartment, house, listings' }
  ]
});

// Reactive state
const searchQuery = ref('');
const viewMode = ref<'grid' | 'list'>('grid');
const properties = ref<PropertyWithRelations[]>([]);
const pending = ref(false);
const hasMore = ref(true);
const totalProperties = ref(0);
const currentPage = ref(1);

// Filters
const filters = reactive({
  listingType: '',
  propertyType: '',
  minPrice: null as number | null,
  maxPrice: null as number | null,
  minBedrooms: null as number | null,
  minBathrooms: null as number | null,
  sortBy: 'created_at_desc'
});

// Load more trigger for infinite scroll
const loadMoreTrigger = ref<HTMLElement>();

// Intersection Observer for infinite scroll
let observer: IntersectionObserver | null = null;

// Computed query parameters
const queryParams = computed(() => {
  const params: any = {
    page: currentPage.value,
    limit: 12
  };
  
  if (searchQuery.value) params.q = searchQuery.value;
  if (filters.listingType) params.listingType = filters.listingType;
  if (filters.propertyType) params.propertyType = [filters.propertyType];
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.minBedrooms) params.minBedrooms = filters.minBedrooms;
  if (filters.minBathrooms) params.minBathrooms = filters.minBathrooms;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  
  return params;
});

// Fetch properties
async function fetchProperties(append = false) {
  if (pending.value) return;
  
  pending.value = true;
  
  try {
    const endpoint = searchQuery.value ? '/api/properties/search' : '/api/properties';
    const response = await $fetch(endpoint, {
      query: queryParams.value
    });
    
    if (append) {
      properties.value.push(...response.data);
    } else {
      properties.value = response.data;
    }
    
    totalProperties.value = response.pagination.total;
    hasMore.value = response.pagination.hasMore;
  } catch (error) {
    console.error('Error fetching properties:', error);
  } finally {
    pending.value = false;
  }
}

// Load more properties
async function loadMore() {
  if (!hasMore.value || pending.value) return;
  
  currentPage.value++;
  await fetchProperties(true);
}

// Reset and fetch
async function resetAndFetch() {
  currentPage.value = 1;
  properties.value = [];
  await fetchProperties();
}

// Debounced filter function
const debouncedFilter = debounce(resetAndFetch, 500);

// Handle search
function handleSearch() {
  resetAndFetch();
}

// Handle sort
function handleSort() {
  resetAndFetch();
}

// Toggle functions
function toggleBedrooms(num: number) {
  filters.minBedrooms = filters.minBedrooms === num ? null : num;
  debouncedFilter();
}

function toggleBathrooms(num: number) {
  filters.minBathrooms = filters.minBathrooms === num ? null : num;
  debouncedFilter();
}

// Clear filters
function clearFilters() {
  Object.assign(filters, {
    listingType: '',
    propertyType: '',
    minPrice: null,
    maxPrice: null,
    minBedrooms: null,
    minBathrooms: null,
    sortBy: 'created_at_desc'
  });
  searchQuery.value = '';
  resetAndFetch();
}

// Handle favorite
function handleFavorite(propertyId: string, isFavorite: boolean) {
  // Update local state
  const property = properties.value.find(p => p.ulid === propertyId);
  if (property) {
    // property.isFavorite = isFavorite; // You'd need to add this field
  }
}

// Setup intersection observer for infinite scroll
function setupInfiniteScroll() {
  if (loadMoreTrigger.value) {
    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore.value && !pending.value) {
        loadMore();
      }
    }, {
      threshold: 0.1
    });
    
    observer.observe(loadMoreTrigger.value);
  }
}

// Cleanup observer
function cleanupObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// Lifecycle
onMounted(() => {
  fetchProperties();
  setupInfiniteScroll();
});

onUnmounted(() => {
  cleanupObserver();
});

// Watch for trigger element
watch(loadMoreTrigger, (newValue) => {
  cleanupObserver();
  if (newValue) {
    setupInfiniteScroll();
  }
});

// Store view mode in localStorage
watch(viewMode, (newMode) => {
  if (process.client) {
    localStorage.setItem('property-view-mode', newMode);
  }
});

// Restore view mode from localStorage
if (process.client) {
  const savedViewMode = localStorage.getItem('property-view-mode');
  if (savedViewMode === 'list' || savedViewMode === 'grid') {
    viewMode.value = savedViewMode;
  }
}
</script>
