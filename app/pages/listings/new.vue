<script lang="ts">
import { z } from "zod/v4";

// Define the complete schema for the listing
export const listingSchema = z.object({
  location: z.object({
    cood: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    isAccurate: z.boolean(),
  }),
  basicInfo: z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    propertyType: z.enum(["apartment", "house", "commercial", "plot", "land"]),
    listingType: z.enum(["rent", "sale"]),
    price: z.number().positive("Price must be positive"),
    bedrooms: z.number().int().optional(),
    bathrooms: z.number().int().optional(),
    area: z.number().positive("Area must be positive").optional(),
    yearBuilt: z.number().int().optional(),
  }),
  address: z.object({
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    state: z.string().min(2, "State must be at least 2 characters"),
    zipCode: z.string().min(3, "Zip code must be at least 3 characters"),
    country: z.string().min(2, "Country must be at least 2 characters"),
  }),
  images: z.object({
    images: z
      .array(
        z.object({
          file: z.instanceof(File),
          preview: z.string(),
          isFeatured: z.boolean(),
        }),
      )
      .min(1, "At least one image is required"),
  }),
  features: z.object({
    features: z.record(z.string(), z.boolean()),
    customFeatures: z.array(z.string()),
  }),
});

export type ListingData = z.infer<typeof listingSchema>;
</script>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useRouter } from "vue-router";

const steps = ref(0);
const data = reactive<Partial<ListingData>>({});
const router = useRouter();

const stepTitles = ["Location", "Basic Information", "Address", "Images", "Features", "Review"];

function handleLocation(locationData: any) {
  data.location = locationData;
  steps.value++;
}

function handleBasicInfo(basicInfoData: any) {
  data.basicInfo = basicInfoData;
  steps.value++;
}

function handleAddress(addressData: any) {
  data.address = addressData;
  steps.value++;
}

function handleImages(imagesData: any) {
  data.images = imagesData;
  steps.value++;
}

function handleFeatures(featuresData: any) {
  data.features = featuresData;
  steps.value++;
}

function handleSubmit() {
  // Here you would handle the final submission
  router.push("/listings");
  // Show success message
  $alert("Listing created successfully!", { type: "success" });
}

function goBack() {
  if (steps.value > 0) {
    steps.value--;
  }
}
</script>

<template>
  <section class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <Title>New Listing</Title>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-medium">Step {{ steps + 1 }} of {{ stepTitles.length }}</span>
          <span class="text-sm font-medium">{{ stepTitles[steps] }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-navy h-2.5 rounded-full transition-all duration-300"
            :style="{ width: `${((steps + 1) / stepTitles.length) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Step Components -->
      <div class="h-full grid place-items-center grow">
        <ListingLocation v-if="steps === 0" @location="handleLocation" />

        <ListingInformationBasic v-if="steps === 1" @next="handleBasicInfo" @back="goBack" />

        <ListingInformationAddress v-if="steps === 2" @next="handleAddress" @back="goBack" />

        <ListingInformationImages v-if="steps === 3" @next="handleImages" @back="goBack" />

        <ListingInformationFeatures v-if="steps === 4" @next="handleFeatures" @back="goBack" />

        <ListingInformationReview v-if="steps === 5" :data="data" @submit="handleSubmit" @back="goBack" />
      </div>
    </div>
  </section>
</template>
