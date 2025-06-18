<script lang="ts">
import { z } from "zod/v4/mini";
import type { PropertyType } from "./Basic.vue";

const basicInfoSchema = z.object({
  title: z.string().check(z.minLength(5, "Title must be at least 5 characters")),
  description: z.string().check(z.minLength(20, "Description must be at least 20 characters")),
  propertyType: z.enum(["apartment", "house", "commercial", "plot", "land"]),
  listingType: z.enum(["rent", "sale"]),
  price: z.optional(z.number().check(z.positive("Price must be positive"))),
  bedrooms: z.optional(z.number().check(z.int())),
  bathrooms: z.optional(z.number().check(z.int())),
  area: z.optional(z.number().check(z.positive("Area must be positive"))),
  yearBuilt: z.optional(z.number().check(z.int())),
});

export type BasicInfoData = z.infer<typeof basicInfoSchema>;
</script>
<script setup lang="ts">
import { Textarea } from "@/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { BasicInfoData } from "~~/shared/schemas/listing";
const props = defineProps<{
  basicInfo: BasicInfoData;
}>();

const basicInfo = reactive<BasicInfoData>({
  ...props.basicInfo,
});

const emits = defineEmits<{
  back: [];
  next: [BasicInfoData];
}>();

const next = () => {
  emits("next", basicInfo);
};
const back = () => {
  emits("back");
};
</script>
<template>
  <ListingContainer>
    <div>
      <h1 class="dm-serif-text text-4xl">Property Details</h1>
      <p class="mulish">Property Details</p>
    </div>
    <div class="mt-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Title</label>
          <Input v-model="basicInfo.title" placeholder="Enter property title" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <Textarea v-model="basicInfo.description" placeholder="Describe your property" class="w-full min-h-[120px]" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Price</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input v-model="basicInfo.price" type="number" placeholder="0.00" class="w-full pl-8" />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6" v-if="basicInfo.propertyType === 'house'">
      <h2 class="newton font-semibold text-lg mb-2">Home Features</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Bedrooms</label>
          <Input v-model="basicInfo.bedrooms" type="number" placeholder="0" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Bathrooms</label>
          <Input v-model="basicInfo.bathrooms" type="number" placeholder="0" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Area (sq ft)</label>
          <Input v-model="basicInfo.area" type="number" placeholder="0" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Year Built</label>
          <Input v-model="basicInfo.yearBuilt" type="number" placeholder="2023" class="w-full" />
        </div>
      </div>
    </div>
    <div class="mt-8 flex justify-between">
      <Button variant="outline" @click="back">Back</Button>
      <Button class="bg-navy text-white" @click="next">Next</Button>
    </div>
  </ListingContainer>
</template>
