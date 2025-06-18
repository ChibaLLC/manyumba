<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { z } from "zod/v4";
import type { listingSchema } from "~~/shared/schemas/listing";

export type ListingData = z.infer<typeof listingSchema>;
const steps = ref(0);
const data = reactive<Partial<ListingData>>({});

const stepTitles = ["Location", "Basic Information", "Address", "Images", "Features", "Review"] as const;

function handleLocation(locationData: ListingData["location"]) {
  data.location = locationData;
  steps.value++;
}

function handleBasicInfo(basicInfoData: ListingData["basicInfo"]) {
  data.basicInfo = basicInfoData;
  steps.value++;
}
function handleInformationDetails(basicInfo: ListingData["basicInfo"]) {
  data.basicInfo = basicInfo;
  steps.value++;
}

function handleAddress(addressData: ListingData["address"]) {
  data.address = addressData;
  steps.value++;
}

function handleImages(imagesData: ListingData["images"]) {
  data.images = imagesData;
  steps.value++;
}

function handleFeatures(featuresData: ListingData["features"]) {
  data.features = featuresData;
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
          v-if="steps === 2"
          :basic-info="data.basicInfo"
          @next="handleInformationDetails"
          @back="goBack()"
        />

        <ListingInformationAddress v-if="steps === 3" @next="handleAddress" @back="goBack" />

        <ListingInformationImages v-if="steps === 4" @next="handleImages" @back="goBack" />

        <ListingInformationFeatures v-if="steps === 5" @next="handleFeatures" @back="goBack" />

        <ListingInformationReview v-if="steps === 6" :data="data" @submit="handleSubmit" @back="goBack" />
      </div>
    </div>
  </section>
</template>
