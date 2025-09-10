<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="pending" class="container mx-auto px-4 py-8">
      <PropertyDetailSkeleton />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-8 text-center">
      <div class="max-w-md mx-auto">
        <Icon name="bxs:error" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
        <p class="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
        <Button as-child>
          <NuxtLink to="/listings">Browse Properties</NuxtLink>
        </Button>
      </div>
    </div>

    <!-- Property Details -->
    <div v-else-if="property" class="pb-8">
      <!-- Image Gallery -->
      <section class="relative h-96 lg:h-[500px] overflow-hidden">
        <div v-if="property.images?.length" class="relative h-full">
          <!-- Main Image -->
          <NuxtImg
            :src="selectedImage?.imageUrl || property.images?.[0]?.imageUrl"
            :alt="property.title"
            class="w-full h-full object-cover"
            sizes="sm:100vw md:100vw lg:100vw"
            placeholder
          />
          
          <!-- Image Overlay -->
          <div class="absolute inset-0 bg-black/20"></div>
          
          <!-- Navigation Arrows -->
          <button
            v-if="property.images.length > 1"
            @click="previousImage"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
          >
            <Icon name="bxs:chevron-left" class="w-6 h-6" />
          </button>
          <button
            v-if="property.images.length > 1"
            @click="nextImage"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
          >
            <Icon name="bxs:chevron-right" class="w-6 h-6" />
          </button>
          
          <!-- Image Counter -->
          <div v-if="property.images.length > 1" class="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {{ currentImageIndex + 1 }} / {{ property.images.length }}
          </div>
        </div>
        
        <!-- Fallback for no images -->
        <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
          <Icon name="bxs:image" class="w-24 h-24 text-gray-500" />
        </div>
        
        <!-- Back Button -->
        <Button
          variant="ghost"
          size="sm"
          class="absolute top-4 left-4 bg-white/90 hover:bg-white backdrop-blur-sm"
          @click="$router.back()"
        >
          <Icon name="bxs:arrow-back" class="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <!-- Favorite Button -->
        <Button
          variant="ghost"
          size="sm"
          class="absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm"
          @click="toggleFavorite"
        >
          <Icon 
            :name="isFavorite ? 'bxs:heart' : 'bxs:heart'" 
            :class="[
              'w-4 h-4 mr-2',
              isFavorite ? 'text-red-500' : 'text-gray-600'
            ]"
          />
          {{ isFavorite ? 'Saved' : 'Save' }}
        </Button>
      </section>

      <!-- Property Info -->
      <section class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Header -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <Badge 
                  :variant="property.listingType === 'sale' ? 'default' : 'secondary'"
                  class="text-sm"
                >
                  {{ property.listingType === 'sale' ? 'For Sale' : 'For Rent' }}
                </Badge>
                <Badge variant="outline">{{ formatPropertyType(property.propertyType) }}</Badge>
              </div>
              
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ property.title }}</h1>
              
              <div class="flex items-center text-gray-600 mb-4">
                <Icon name="bxs:map" class="w-5 h-5 mr-2" />
                <span>{{ property.address }}, {{ property.city }}, {{ property.state }} {{ property.zipCode }}</span>
              </div>
              
              <div class="text-3xl font-bold text-purple-600 mb-4">
                ${{ formatPrice(property.price) }}
                <span v-if="property.listingType === 'rent'" class="text-lg text-gray-500 font-normal">/month</span>
              </div>
            </div>

            <!-- Key Details -->
            <Card>
              <CardContent class="p-6">
                <h2 class="text-xl font-semibold mb-4">Property Details</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div v-if="property.bedrooms" class="text-center p-4 bg-gray-50 rounded-lg">
                    <Icon name="bxs:bed" class="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div class="font-semibold">{{ property.bedrooms }}</div>
                    <div class="text-sm text-gray-600">Bedroom{{ property.bedrooms !== 1 ? 's' : '' }}</div>
                  </div>
                  <div v-if="property.bathrooms" class="text-center p-4 bg-gray-50 rounded-lg">
                    <Icon name="bxs:bath" class="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div class="font-semibold">{{ property.bathrooms }}</div>
                    <div class="text-sm text-gray-600">Bathroom{{ property.bathrooms !== 1 ? 's' : '' }}</div>
                  </div>
                  <div v-if="property.area" class="text-center p-4 bg-gray-50 rounded-lg">
                    <Icon name="bxs:home" class="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div class="font-semibold">{{ formatArea(property.area) }}</div>
                    <div class="text-sm text-gray-600">Area</div>
                  </div>
                  <div v-if="property.yearBuilt" class="text-center p-4 bg-gray-50 rounded-lg">
                    <Icon name="bxs:calendar" class="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div class="font-semibold">{{ property.yearBuilt }}</div>
                    <div class="text-sm text-gray-600">Year Built</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Description -->
            <Card>
              <CardContent class="p-6">
                <h2 class="text-xl font-semibold mb-4">Description</h2>
                <div class="prose prose-gray max-w-none">
                  <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ property.description }}</p>
                </div>
              </CardContent>
            </Card>

            <!-- Features -->
            <Card v-if="property.features && Object.keys(property.features).length">
              <CardContent class="p-6">
                <h2 class="text-xl font-semibold mb-4">Features & Amenities</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div 
                    v-for="(value, feature) in property.features" 
                    :key="feature"
                    class="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                  >
                    <Icon name="bxs:check-circle" class="w-4 h-4 text-green-600" />
                    <span class="text-sm">{{ feature }}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Reviews -->
            <Card v-if="property.reviews?.length">
              <CardContent class="p-6">
                <h2 class="text-xl font-semibold mb-4">Reviews</h2>
                <div class="space-y-4">
                  <div 
                    v-for="review in property.reviews?.slice(0, 3)" 
                    :key="review.ulid"
                    class="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Icon name="bxs:user" class="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div class="font-medium">{{ review.user?.name }}</div>
                          <div class="text-xs text-gray-500">{{ formatDate(review.createdAt) }}</div>
                        </div>
                      </div>
                      <div class="flex text-yellow-400">
                        <Icon 
                          v-for="star in 5" 
                          :key="star"
                          name="bxs:star" 
                          :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                          class="w-4 h-4"
                        />
                      </div>
                    </div>
                    <p class="text-gray-700 text-sm">{{ review.comment }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Contact Card -->
            <Card class="sticky top-4">
              <CardContent class="p-6">
                <h3 class="text-lg font-semibold mb-4">Contact Agent</h3>
                
                <!-- Agent Info -->
                <div class="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Icon name="bxs:user" class="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div class="font-medium">{{ property.owner?.name }}</div>
                    <div class="text-sm text-gray-600">{{ property.owner?.role || 'Agent' }}</div>
                    <div class="text-sm text-gray-600">{{ property.owner?.email }}</div>
                  </div>
                </div>
                
                <!-- Contact Actions -->
                <div class="space-y-3">
                  <Button class="w-full" @click="showContactForm = true">
                    <Icon name="bxs:message" class="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" class="w-full" @click="showBookingForm = true">
                    <Icon name="bxs:calendar" class="w-4 h-4 mr-2" />
                    Schedule Viewing
                  </Button>
                  <Button 
                    v-if="property.owner?.phone" 
                    variant="outline" 
                    class="w-full"
                    @click="callAgent"
                  >
                    <Icon name="bxs:phone" class="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <!-- Location Map -->
            <Card>
              <CardContent class="p-6">
                <h3 class="text-lg font-semibold mb-4">Location</h3>
                <div class="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <!-- Map placeholder - integrate with Google Maps or similar -->
                  <div class="text-center">
                    <Icon name="bxs:map" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p class="text-gray-600 text-sm">Interactive map coming soon</p>
                  </div>
                </div>
                <div class="mt-4 text-sm text-gray-600">
                  <p>{{ property.address }}</p>
                  <p>{{ property.city }}, {{ property.state }} {{ property.zipCode }}</p>
                  <p>{{ property.country }}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <!-- Image Thumbnails -->
      <section v-if="property.images?.length > 1" class="container mx-auto px-4 pb-8">
        <h2 class="text-xl font-semibold mb-4">Property Photos</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button
            v-for="(image, index) in property.images"
            :key="image.ulid"
            @click="selectImage(index)"
            :class="[
              'relative h-24 rounded-lg overflow-hidden border-2 transition-colors',
              selectedImageIndex === index ? 'border-purple-500' : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <NuxtImg
              :src="image.imageUrl"
              :alt="`${property.title} - Image ${index + 1}`"
              class="w-full h-full object-cover"
              sizes="150px"
            />
          </button>
        </div>
      </section>
    </div>

    <!-- Contact Form Modal -->
    <ContactFormModal 
      v-if="showContactForm" 
      :property="property" 
      @close="showContactForm = false"
    />

    <!-- Booking Form Modal -->
    <BookingFormModal 
      v-if="showBookingForm" 
      :property="property" 
      @close="showBookingForm = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropertyWithRelations } from '~/server/db/types';

// Get property ID from route
const route = useRoute();
const propertyId = route.params.id as string;

// Fetch property data with caching
const { data: property, pending, error } = await $fetch(`/api/properties/${propertyId}`).catch(() => ({
  data: null,
  pending: false,
  error: true
}));

// SEO
if (property) {
  useHead({
    title: `${property.title} - Property Details`,
    meta: [
      { name: 'description', content: property.description.substring(0, 160) + '...' },
      { property: 'og:title', content: property.title },
      { property: 'og:description', content: property.description.substring(0, 160) + '...' },
      { property: 'og:image', content: property.images?.[0]?.imageUrl || '' },
      { property: 'og:type', content: 'website' }
    ]
  });
}

// Image gallery state
const selectedImageIndex = ref(0);
const currentImageIndex = computed(() => selectedImageIndex.value);
const selectedImage = computed(() => property?.images?.[selectedImageIndex.value]);

// Modal states
const showContactForm = ref(false);
const showBookingForm = ref(false);

// Favorite state
const isFavorite = ref(false);

// Image navigation
function nextImage() {
  if (property?.images?.length) {
    selectedImageIndex.value = (selectedImageIndex.value + 1) % property.images.length;
  }
}

function previousImage() {
  if (property?.images?.length) {
    selectedImageIndex.value = selectedImageIndex.value === 0 
      ? property.images.length - 1 
      : selectedImageIndex.value - 1;
  }
}

function selectImage(index: number) {
  selectedImageIndex.value = index;
}

// Actions
function toggleFavorite() {
  isFavorite.value = !isFavorite.value;
  // TODO: Call API to update favorite status
}

function callAgent() {
  if (property?.owner?.phone) {
    window.location.href = `tel:${property.owner.phone}`;
  }
}

// Utility functions
function formatPrice(price: string | number): string {
  return Number(price).toLocaleString();
}

function formatArea(area: string | number): string {
  return `${Number(area).toLocaleString()} sq ft`;
}

function formatPropertyType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Keyboard navigation for images
onMounted(() => {
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      previousImage();
    } else if (event.key === 'ArrowRight') {
      nextImage();
    } else if (event.key === 'Escape') {
      showContactForm.value = false;
      showBookingForm.value = false;
    }
  }
  
  document.addEventListener('keydown', handleKeydown);
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
  });
});
</script>
