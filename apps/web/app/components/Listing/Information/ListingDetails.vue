<script lang="ts">
import { DetailsSchema } from "utils";
import type { BasicInfoData, DetailedInfoData } from "types";

const { data, validate } = useZodState(DetailsSchema);
</script>
<script setup lang="ts">
import { Textarea } from "@/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

defineProps<{
  basicInfo: BasicInfoData | undefined;
}>();

const emits = defineEmits<{
  back: [];
  next: [DetailedInfoData];
}>();

const next = () => {
  const { error, data } = validate({ prettifyError: true });
  if (!error) {
    emits("next", data);
  } else {
    console.error(error);
    $alert.error(String(error));
  }
};

const back = () => {
  emits("back");
};
</script>
<template>
  <ListingContainer>
    <div>
      <h1 class="font-dm-serif text-4xl">Property Details</h1>
      <p class="font-mulish">Property Details</p> 
    </div>
    <div class="mt-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Title</label>
          <Input v-model="data.title" placeholder="Enter property title" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <Textarea v-model="data.description" placeholder="Describe your property" class="w-full min-h-[120px]" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Price</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">KES</span>
            <Input v-model="data.price" type="number" placeholder="0.00" class="w-full pl-[42px]" />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6" v-if="basicInfo?.propertyType === 'home'">
      <h2 class="font-newton font-semibold text-lg mb-2">Home Features</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Bedrooms</label>
          <Input v-model="data.bedrooms" type="number" placeholder="0" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Bathrooms</label>
          <Input v-model="data.bathrooms" type="number" placeholder="0" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Area (sq ft)</label>
          <Input v-model="data.area" type="number" placeholder="0" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Year Built</label>
          <Input v-model="data.yearBuilt" type="number" placeholder="2023" class="w-full" />
        </div>
      </div>
    </div>
    <div class="mt-8 flex justify-between">
      <Button variant="outline" @click="back">Back</Button>
      <Button class="bg-navy text-white" @click="next">Next</Button>
    </div>
  </ListingContainer>
</template>
