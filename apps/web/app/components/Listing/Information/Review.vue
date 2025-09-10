<script setup lang="ts">
import { Button } from "@/components/ui/button";
import type { ListingData } from "~/pages/listings/new.vue";

const props = defineProps<{
  data: Partial<ListingData>;
}>();

const emits = defineEmits<{
  submit: [];
  back: [];
}>();

const isSubmitting = ref(false);

async function submit() {
  isSubmitting.value = true;
  try {
    // Here you would submit the data to your API
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
    emits("submit");
  } catch (error) {
    $alert("Failed to submit listing. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
}

function back() {
  emits("back");
}

const featuredImage = computed(() => {
  if (!props.data.images?.images?.length) return null;
  return props.data.images.images.find((img: any) => img.isFeatured) || props.data.images.images[0];
});

const selectedFeatures = computed(() => {
  if (!props.data.features) return [];

  const features = [];
  for (const [key, value] of Object.entries(props.data.features.features)) {
    if (value) features.push(key);
  }

  return [...features, ...props.data.features.customFeatures];
});
</script>

<template>
  <ListingContainer>
    <div>
      <h1 class="font-dm-serif text-4xl">Review Your Listing</h1>
      <p class="font-mulish">Please review all information before submitting.</p>
    </div>

    <div class="mt-6 space-y-8">
      <!-- Property Preview -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden border">
        <div v-if="featuredImage" class="h-64 overflow-hidden">
          <img :src="featuredImage.preview" alt="Property featured image" class="w-full h-full object-cover" />
        </div>

        <div class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-2xl font-bold">{{ data.basicInfo?.title || "No Title" }}</h2>
              <p class="text-gray-500">{{ data.address?.address || "No Address" }}, {{ data.address?.city || "" }}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-navy">${{ data.basicInfo?.price?.toLocaleString() || "0" }}</p>
              <p class="text-sm text-gray-500">
                {{ data.basicInfo?.listingType === "rent" ? "For Rent" : "For Sale" }}
              </p>
            </div>
          </div>

          <div class="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <div v-if="data.basicInfo?.bedrooms" class="flex items-center">
              <Icon name="local:bed" class="w-5 h-5 mr-1" />
              {{ data.basicInfo.bedrooms }} Beds
            </div>
            <div v-if="data.basicInfo?.bathrooms" class="flex items-center">
              <Icon name="local:bath" class="w-5 h-5 mr-1" />
              {{ data.basicInfo.bathrooms }} Baths
            </div>
            <div v-if="data.basicInfo?.area" class="flex items-center">
              <Icon name="local:ruler" class="w-5 h-5 mr-1" />
              {{ data.basicInfo.area }} sq ft
            </div>
          </div>

          <p class="mt-4 text-gray-600 line-clamp-3">{{ data.basicInfo?.description || "No description provided." }}</p>
        </div>
      </div>

      <!-- Property Details -->
      <div>
        <h3 class="font-newton font-semibold text-lg mb-2">Property Details</h3>
        <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Property Type</p>
            <p class="font-medium">{{ data.basicInfo?.propertyType || "Not specified" }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Listing Type</p>
            <p class="font-medium">{{ data.basicInfo?.listingType === "rent" ? "For Rent" : "For Sale" }}</p>
          </div>
          <div v-if="data.basicInfo?.yearBuilt">
            <p class="text-sm text-gray-500">Year Built</p>
            <p class="font-medium">{{ data.basicInfo.yearBuilt }}</p>
          </div>
        </div>
      </div>

      <!-- Location -->
      <div>
        <h3 class="font-newton font-semibold text-lg mb-2">Location</h3>
        <div class="bg-gray-50 rounded-lg p-4">
          <p>{{ data.address?.address || "No address provided" }}</p>
          <p>{{ data.address?.city || "" }}, {{ data.address?.state || "" }} {{ data.address?.zipCode || "" }}</p>
          <p>{{ data.address?.country || "" }}</p>
        </div>
      </div>

      <!-- Features -->
      <div v-if="selectedFeatures.length > 0">
        <h3 class="font-newton font-semibold text-lg mb-2">Features</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(feature, index) in selectedFeatures"
            :key="index"
            class="bg-sky-100 text-navy px-3 py-1 rounded-full text-sm"
          >
            {{ feature }}
          </span>
        </div>
      </div>

      <!-- Images -->
      <div v-if="data.images?.images?.length">
        <h3 class="font-newton font-semibold text-lg mb-2">Images ({{ data.images.images.length }})</h3>
        <div class="grid grid-cols-3 md:grid-cols-4 gap-2">
          <div
            v-for="(image, index) in data.images.images.slice(0, 8)"
            :key="index"
            class="relative aspect-square rounded-lg overflow-hidden"
          >
            <img :src="image.preview" :alt="`Property image ${index + 1}`" class="w-full h-full object-cover" />
            <div
              v-if="image.isFeatured"
              class="absolute top-1 right-1 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full"
            >
              Featured
            </div>
          </div>
          <div
            v-if="data.images.images.length > 8"
            class="relative aspect-square rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center"
          >
            <span class="text-lg font-bold text-gray-600">+{{ data.images.images.length - 8 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <Button variant="outline" @click="back" :disabled="isSubmitting">Back</Button>
      <Button class="bg-navy text-white" @click="submit" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="flex items-center">
          <Icon name="local:spinner" class="animate-spin mr-2 w-4 h-4" />
          Submitting...
        </span>
        <span v-else>Submit Listing</span>
      </Button>
    </div>
  </ListingContainer>
</template>
