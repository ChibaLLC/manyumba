<script lang="ts">
import { z } from "zod/v4/mini";
import { listingType, propertyType } from "~/components/Listing/Information/Basic.vue";

// Reusable coord object
const coordSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

// Reusable basicInfo block
const basicInfoSchema = z.object({
  title: z.string().check(z.minLength(5)),
  description: z.string().check(z.minLength(20)),
  propertyType: z.enum(propertyType),
  listingType: z.enum(listingType),
  price: z.number().check(z.gt(0)),
  bedrooms: z.optional(z.number().check(z.int())),
  bathrooms: z.optional(z.number().check(z.int())),
  area: z.optional(z.number().check(z.gt(0))),
  yearBuilt: z.optional(z.number().check(z.int())),
});

// Reusable address block
const addressSchema = z.object({
  address: z.string().check(z.minLength(5)),
  city: z.string().check(z.minLength(2)),
  state: z.string().check(z.minLength(2)),
  zipCode: z.string().check(z.minLength(3)),
  country: z.string().check(z.minLength(2)),
});

// Image object schema
const imageSchema = z.object({
  file: z.instanceof(File),
  preview: z.string(),
  isFeatured: z.boolean(),
});

export const listing = useZodState({
  location: z.object({
    cood: coordSchema,
    isAccurate: z.boolean(),
  }),

  basicInfo: basicInfoSchema,

  address: addressSchema,

  images: z.object({
    images: z.array(imageSchema).check(z.minLength(1)),
  }),

  features: z.object({
    features: z.record(z.string(), z.boolean()),
    customFeatures: z.array(z.string()),
  }),
});

export type ListingData = z.infer<(typeof listing)["schema"]>;
</script>

<script setup lang="ts">
const steps = ref(0);

const stepTitles = ["Location", "Basic Information", "Address", "Images", "Features", "Review"] as const;

function handleLocation(locationData: any) {
  listing.data.location = locationData;
  steps.value++;
}

function handleBasicInfo(basicInfoData: any) {
  listing.data.basicInfo = basicInfoData;
  steps.value++;
}
function handleInformationDetails(basicInfo: ListingData["basicInfo"]) {
  data.basicInfo = basicInfo;
  steps.value++;
}

function handleAddress(addressData: any) {
  listing.data.address = addressData;
  steps.value++;
}

function handleImages(imagesData: any) {
  listing.data.images = imagesData;
  steps.value++;
}

function handleFeatures(featuresData: any) {
  listing.data.features = featuresData;
  steps.value++;
}

function handleSubmit() {
  // Here you would handle the final submission
  navigateTo("/listings");
  // Show success message
  $alert("Listing created successfully!");
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
      <div class="h-full grid place-items-center grow w-full">
        <ListingLocation v-if="steps === 0" @location="handleLocation" />

        <ListingInformationBasic v-if="steps === 1" @next="handleBasicInfo" @back="goBack" />

        <ListingInformationDetails
          v-if="listing.data.basicInfo?.propertyType && steps === 2"
          :propertyType="listing.data.basicInfo?.propertyType"
        />

        <ListingInformationAddress v-if="steps === 3" @next="handleAddress" @back="goBack" />

        <ListingInformationImages v-if="steps === 4" @next="handleImages" @back="goBack" />

        <ListingInformationFeatures v-if="steps === 5" @next="handleFeatures" @back="goBack" />
        <ListingInformationFeatures v-if="steps === 5" @next="handleFeatures" @back="goBack" />

        <ListingInformationReview v-if="steps === 6" :data="listing.data" @submit="handleSubmit" @back="goBack" />
      </div>
    </div>
  </section>
</template>
