<script setup lang="ts">
import { ListingSchema } from 'utils';

const steps = ref(0);

const stepTitles = ["Location", "Basic Information", "Address", "Images", "Features", "Review"] as const;

const listing = useZodState(ListingSchema);

function handleLocation(locationData: any) {
  listing.data.location = locationData;
  steps.value++;
}

function handleBasicInfo(basicInfoData: any) {
  listing.data.basicInfo = basicInfoData;
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
  <section class="fullscreen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <Title>New Listing</Title>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-medium">Step {{ steps + 1 }} of {{ stepTitles.length + 1 }}</span>
          <span class="text-sm font-medium">{{ stepTitles[steps] }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-navy h-2.5 rounded-full transition-all duration-300"
            :style="{ width: `${(steps / stepTitles.length) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Step Components -->
      <div class="h-full grid place-items-center grow w-full">
        <ListingLocation v-if="steps === 0" @location="handleLocation" />

        <ListingBasic v-else-if="steps === 1" @next="handleBasicInfo" @back="goBack" />

        <ListingDetails
          v-else-if="steps === 2 && listing.data.meta?.basic"
          :basicInfo="listing.data.meta.basic"
          @back="goBack"
          @next="handleFeatures"
        />

        <ListingAddress v-else-if="steps === 3" @next="handleAddress" @back="goBack" />

        <ListingImages v-else-if="steps === 4" @next="handleImages" @back="goBack" />

        <ListingFeatures v-else-if="steps === 5" @next="handleFeatures" @back="goBack" />
        <ListingFeatures v-else-if="steps === 5" @next="handleFeatures" @back="goBack" />

        <ListingReview v-if="steps === 6" :data="listing.data" @submit="handleSubmit" @back="goBack" />
      </div>
    </div>
  </section>
</template>
