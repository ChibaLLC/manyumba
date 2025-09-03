<script lang="ts">
import { z } from "zod/v4-mini";
export const {
  schema: featuresSchema,
  data: featuresData,
  validate,
} = useZodState({
  features: z.record(z.string(), z.boolean()),
  customFeatures: z.array(z.string()),
});

type FeaturesData = z.infer<typeof featuresSchema>;
</script>
<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

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
  const { error, data } = validate();
  if (error) {
    $alert.error(String(error));
    return;
  }
  emits("next", data);
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
        <div v-for="(_, feature) in featuresData.features" :key="feature" class="flex items-center space-x-2">
          <Checkbox v-if="featuresData.features" :id="feature" v-model:checked="featuresData.features[feature]" />
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
