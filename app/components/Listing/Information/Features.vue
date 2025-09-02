<script setup lang="ts">
import { z } from "zod/v4-mini";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { FeaturesData } from "~~/shared/schemas/listing";

const featuresData = reactive<FeaturesData>({
  features: {
    "Air Conditioning": false,
    Heating: false,
    Garage: false,
    Pool: false,
    Garden: false,
    Balcony: false,
    Fireplace: false,
    "Security System": false,
    Elevator: false,
    Gym: false,
    Parking: false,
    Furnished: false,
    "Pets Allowed": false,
    "Wheelchair Access": false,
    Storage: false,
  },
  customFeatures: [],
});

const newFeature = ref("");

const emits = defineEmits<{
  next: [FeaturesData];
  back: [];
}>();

function addCustomFeature() {
  if (newFeature.value.trim()) {
    featuresData.customFeatures.push(newFeature.value.trim());
    newFeature.value = "";
  }
}

function removeCustomFeature(index: number) {
  featuresData.customFeatures.splice(index, 1);
}

function next() {
  emits("next", featuresData);
}

function back() {
  emits("back");
}
</script>

<template>
  <ListingContainer>
    <div>
      <h1 class="font-dm-serif text-4xl">Property Features</h1>
      <p class="font-mulish">Select all the features that apply to your property.</p>
    </div>

    <div class="mt-6">
      <h2 class="font-newton font-semibold text-lg mb-2">Common Features</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-y-3">
        <div v-for="(value, feature) in featuresData.features" :key="feature" class="flex items-center space-x-2">
          <Checkbox :id="feature" v-model:checked="featuresData.features[feature]" />
          <label :for="feature" class="text-sm font-medium leading-none cursor-pointer">
            {{ feature }}
          </label>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <h2 class="font-newton font-semibold text-lg mb-2">Custom Features</h2>
      <div class="flex items-center space-x-2">
        <Input v-model="newFeature" placeholder="Add custom feature" class="flex-1" @keyup.enter="addCustomFeature" />
        <Button @click="addCustomFeature">Add</Button>
      </div>

      <div v-if="featuresData.customFeatures.length > 0" class="mt-4">
        <div
          v-for="(feature, index) in featuresData.customFeatures"
          :key="index"
          class="flex items-center justify-between py-2 px-3 bg-sky-50 rounded-md mb-2"
        >
          <span>{{ feature }}</span>
          <Button variant="ghost" size="icon" class="h-8 w-8 text-red-500" @click="removeCustomFeature(index)">
            <Icon name="local:x" class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <Button variant="outline" @click="back">Back</Button>
      <Button class="bg-navy text-white" @click="next">Next</Button>
    </div>
  </ListingContainer>
</template>
