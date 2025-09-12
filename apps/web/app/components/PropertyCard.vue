<template>
  <article 
    :class="[
      'bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200',
      viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'
    ]"
  >
    <!-- Image Section -->
    <div 
      :class="[
        'relative overflow-hidden bg-gray-200',
        viewMode === 'list' ? 'w-64 h-48 flex-shrink-0' : 'h-48 w-full'
      ]"
    >
      <!-- Featured Image with Lazy Loading -->
      <NuxtImg
        v-if="property.images?.[0]?.imageUrl"
        :src="property.images[0].imageUrl"
        :alt="property.title"
        :placeholder="[300, 200, 75]"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        sizes="sm:300px md:400px lg:300px"
      />
      <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
        <Icon name="bxs:image" class="w-12 h-12 text-gray-500" />
      </div>

      <!-- Price Badge -->
      <div class="absolute top-3 left-3">
        <Badge 
          :variant="property.listingType === 'sale' ? 'default' : 'secondary'"
          class="font-semibold"
        >
          {{ formatPrice(property.price) }}
        </Badge>
      </div>

      <!-- Listing Type Badge -->
      <div class="absolute top-3 right-3">
        <Badge variant="outline" class="bg-white/90 backdrop-blur-sm">
          {{ property.listingType === 'sale' ? 'For Sale' : 'For Rent' }}
        </Badge>
      </div>

      <!-- Favorite Button -->
      <Button
        variant="ghost"
        size="sm"
        class="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white"
        @click="toggleFavorite"
      >
        <Icon 
          :name="isFavorite ? 'bxs:heart' : 'bxs:heart'" 
          :class="[
            'w-4 h-4',
            isFavorite ? 'text-red-500' : 'text-gray-400'
          ]"
        />
      </Button>
    </div>

    <!-- Content Section -->
    <div :class="['p-4 flex-1', viewMode === 'list' ? 'flex flex-col justify-between' : '']">
      <!-- Property Title -->
      <div class="mb-3">
        <h3 class="font-semibold text-lg text-gray-900 line-clamp-2 mb-1">
          {{ property.title }}
        </h3>
        <p class="text-sm text-gray-600 flex items-center">
          <Icon name="bxs:map" class="w-4 h-4 mr-1" />
          {{ property.city }}, {{ property.state }}
        </p>
      </div>

      <!-- Property Details -->
      <div class="flex items-center space-x-4 mb-3 text-sm text-gray-600">
        <div v-if="property.bedrooms" class="flex items-center">
          <Icon name="bxs:bed" class="w-4 h-4 mr-1" />
          {{ property.bedrooms }} bed{{ property.bedrooms !== 1 ? 's' : '' }}
        </div>
        <div v-if="property.bathrooms" class="flex items-center">
          <Icon name="bxs:bath" class="w-4 h-4 mr-1" />
          {{ property.bathrooms }} bath{{ property.bathrooms !== 1 ? 's' : '' }}
        </div>
        <div v-if="property.area" class="flex items-center">
          <Icon name="bxs:home" class="w-4 h-4 mr-1" />
          {{ formatArea(property.area) }}
        </div>
      </div>

      <!-- Property Type -->
      <div class="mb-4">
        <Badge variant="outline" class="text-xs">
          {{ formatPropertyType(property.propertyType) }}
        </Badge>
      </div>

      <!-- Description (List view only) -->
      <div v-if="viewMode === 'list' && property.description" class="mb-4">
        <p class="text-sm text-gray-600 line-clamp-2">
          {{ property.description }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between mt-auto">
        <div class="flex items-center space-x-2">
          <!-- Owner Avatar -->
          <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <Icon name="bxs:user" class="w-4 h-4 text-purple-600" />
          </div>
          <div class="text-xs text-gray-500">
            <p class="font-medium">{{ property.owner?.name }}</p>
            <p>{{ formatDate(property.createdAt) }}</p>
          </div>
        </div>

        <!-- View Details Button -->
        <Button 
          as-child 
          size="sm"
          :variant="viewMode === 'list' ? 'default' : 'outline'"
        >
          <NuxtLink :to="`/listings/${property.ulid}`">
            {{ viewMode === 'list' ? 'View Details' : 'View' }}
          </NuxtLink>
        </Button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PropertyWithRelations } from '~~/server/db/types';

interface Props {
  property: PropertyWithRelations;
  viewMode?: 'grid' | 'list';
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'grid'
});

const emit = defineEmits<{
  favorite: [propertyId: string, isFavorite: boolean]
}>();

// Local favorite state (you might want to sync this with a global store)
const isFavorite = ref(false);

// Format price
function formatPrice(price: string | number): string {
  const numPrice = Number(price);
  if (numPrice >= 1000000) {
    return `$${(numPrice / 1000000).toFixed(1)}M`;
  } else if (numPrice >= 1000) {
    return `$${(numPrice / 1000).toFixed(0)}K`;
  }
  return `$${numPrice.toLocaleString()}`;
}

// Format area
function formatArea(area: string | number): string {
  return `${Number(area).toLocaleString()} sq ft`;
}

// Format property type
function formatPropertyType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Toggle favorite
function toggleFavorite() {
  isFavorite.value = !isFavorite.value;
  emit('favorite', props.property.ulid, isFavorite.value);
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
