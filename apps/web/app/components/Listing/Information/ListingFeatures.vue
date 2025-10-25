<script lang="ts">
export const { data: featuresData, validate } = useZodState(FeaturesSchema);
</script>
<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { FeaturesData } from "types";
import { FeaturesSchema } from "utils";

const newFeature = ref("");

const emits = defineEmits<{
  next: [FeaturesData];
  back: [];
}>();

function addCustomFeature() {
  if (!featuresData.customFeatures) {
    featuresData.customFeatures = [];
  }
  if (newFeature.value.trim()) {
    featuresData.customFeatures.push(newFeature.value.trim());
    newFeature.value = "";
  }
}

function removeCustomFeature(index: number) {
  if (!featuresData.customFeatures) {
    return;
  }
  featuresData.customFeatures.splice(index, 1);
}

function next() {
  const { error, data } = validate({
    prettifyError: true,
  });
  if (error) {
    $alert.error(String(error));
    return;
  }
  emits("next", data);
}

function back() {
  emits("back");
}

const commonFeatures = reactive({
  "Air Conditioning": false,
  Balcony: false,
  Dishwasher: false,
  Fireplace: false,
  Garden: false,
  Gym: false,
  Parking: false,
  Pool: false,
  "Security System": false,
  "Washer/Dryer": false,
});

function updateFeature(key: string, value: boolean) {
  if (featuresData.features) {
    if (value === false) {
      delete featuresData.features[key];
      return;
    }

    featuresData.features[key] = value;
  } else {
    featuresData.features = { [key]: value };
  }
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
        <div v-for="(_, feature) in commonFeatures" :key="feature" class="flex items-center space-x-2">
          <Checkbox
            :id="feature"
            v-model:checked="commonFeatures[feature]"
            @update:model-value="updateFeature(feature, Boolish($event))"
          />
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

      <div v-if="featuresData.customFeatures && featuresData.customFeatures.length > 0" class="mt-4">
        <div
          v-for="(feature, index) in featuresData.customFeatures"
          :key="index"
          class="flex items-center justify-between py-2 px-3 border-1 border-gray-200 bg-gray-100 rounded-md mb-2"
        >
          <span>{{ feature }}</span>
          <Button variant="ghost" size="icon" class="h-8 w-8 text-red-500" @click="removeCustomFeature(index)">
            <Icon name="i-lucide-x" class="w-4 h-4" />
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
