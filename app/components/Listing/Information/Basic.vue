<script lang="ts">
export type PropertyType = "house" | "land";
export type ListingType = "sale" | "rent";
</script>
<script setup lang="ts">
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const listingType = ref<ListingType>("sale");
const propertyType = ref<PropertyType>("house");

const homeType = ref<string>("");
const homeTypes = ["Single Family", "Townhouse", "Condo", "Apartment", "Duplex", "Mobile Home", "Cabin", "Loft"];
const landTypes = ["Residential", "Commercial", "Agricultural", "Industrial", "Recreational"];

const filteredTypes = computed(() => {
  return propertyType.value === "house" ? homeTypes : landTypes;
});

function next() {
  try {
    // const validated = basicInfoSchema.parse(basicInfo);
    // emits("next", validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      $alert(error.message);
    } else {
      $alert("Please fill all required fields");
    }
  }
}

function back() {
  emits("back");
}

const emits = defineEmits<{
  next: [BasicInfoData];
  back: [];
}>();

function setListingType(type: ListingType) {
  listingType.value = type;
}

function setPropertyType(type: PropertyType) {
  propertyType.value = type;
}
</script>

<template>
  <ListingContainer>
    <div>
      <h1 class="dm-serif-text text-4xl">Basic Information</h1>
      <p class="mulish">Put in as much details as needed.</p>
    </div>

    <div class="mt-6">
      <h2 class="newton font-semibold text-lg mb-2">Lease Type</h2>
      <div class="flex gap-3">
        <Button
          :class="listingType === 'sale' ? 'bg-navy text-white' : 'text-navy bg-sky-100 border-sky-200 border'"
          @click="setListingType('sale')"
        >
          <Icon name="local:heart-home" class="mr-2" />
          Sale
        </Button>
        <Button
          :class="listingType === 'rent' ? 'bg-navy text-white' : 'text-navy bg-sky-100 border-sky-200 border'"
          @click="setListingType('rent')"
        >
          <Icon name="local:smile-home" class="mr-2" />
          Rent
        </Button>
      </div>
    </div>

    <div class="mt-6">
      <h2 class="newton font-semibold text-lg mb-2">Property Type</h2>
      <div class="flex gap-3">
        <Button
          :class="propertyType === 'house' ? 'bg-navy text-white' : 'text-navy bg-sky-100 border-sky-200 border'"
          @click="setPropertyType('house')"
        >
          <Icon name="local:shroom-home" class="mr-2" />
          Home
        </Button>
        <Button
          :class="propertyType === 'land' ? 'bg-navy text-white' : 'text-navy bg-sky-100 border-sky-200 border'"
          @click="setPropertyType('land')"
        >
          <Icon name="local:land" class="mr-2" />
          Land
        </Button>
      </div>
    </div>

    <div class="mt-6">
      <h2 class="newton font-semibold text-lg mb-2">{{ propertyType === "house" ? "Home" : "Land" }} Type</h2>
      <div class="relative flex items-center mb-4">
        <span class="absolute left-3 text-gray-400">
          <Icon name="local:search" class="w-4 h-4" />
        </span>
        <Input
          v-model="homeType"
          type="search"
          placeholder="Search..."
          aria-label="Search"
          class="bg-white rounded-lg border border-gray-300 w-full pl-9 pr-4 py-2 focus:border-transparent transition duration-200 ease-in-out hover:border-gray-400 placeholder-gray-400"
        />
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Button
          v-for="type in filteredTypes"
          :key="type"
          variant="outline"
          :class="homeType === type ? 'bg-navy text-white' : 'bg-white'"
          @click="homeType = type"
        >
          {{ type }}
        </Button>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <Button variant="outline" @click="back">Back</Button>
      <Button class="bg-navy text-white" @click="next">Next</Button>
    </div>
  </ListingContainer>
</template>
