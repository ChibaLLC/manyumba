<script lang="ts">
import { z } from "zod/v4/mini";
import type { PropertyType } from "./Basic.vue";

const basicInfoSchema = z.object({
  title: z.string().check(z.minLength(5, "Title must be at least 5 characters")),
  description: z.string().check(z.minLength(20, "Description must be at least 20 characters")),
  propertyType: z.enum(["apartment", "house", "commercial", "plot", "land"]),
  listingType: z.enum(["rent", "sale"]),
  price: z.number().check(z.positive("Price must be positive")),
  bedrooms: z.number().check(z.int()),
  bathrooms: z.number().check(z.int()),
  area: z.number().check(z.positive("Area must be positive")),
  yearBuilt: z.number().check(z.int()),
});

export type BasicInfoData = z.infer<typeof basicInfoSchema>;
</script>
<script setup lang="ts">
import { Textarea } from "@/components/ui/textarea";

const basicInfo = reactive<BasicInfoData>({
  title: "",
  description: "",
  propertyType: "house",
  listingType: "sale",
  price: 0,
});

defineProps<{
  propertyType: PropertyType;
}>();
</script>
<template>
  <section>
    <div class="mt-6">
      <h2 class="newton font-semibold text-lg mb-2">Property Details</h2>
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
            <Input v-model.number="basicInfo.price" type="number" placeholder="0.00" class="w-full pl-8" />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6" v-if="propertyType === 'house'">
      <h2 class="newton font-semibold text-lg mb-2">Home Features</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Bedrooms</label>
          <Input v-model.number="basicInfo.bedrooms" type="number" placeholder="0" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Bathrooms</label>
          <Input v-model.number="basicInfo.bathrooms" type="number" placeholder="0" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Area (sq ft)</label>
          <Input v-model.number="basicInfo.area" type="number" placeholder="0" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Year Built</label>
          <Input v-model.number="basicInfo.yearBuilt" type="number" placeholder="2023" class="w-full" />
        </div>
      </div>
    </div>
  </section>
</template>
