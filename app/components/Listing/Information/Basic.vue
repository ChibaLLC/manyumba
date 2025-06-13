<script setup lang="ts">
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the schema for basic information
const basicInfoSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  propertyType: z.enum(["apartment", "house", "commercial", "plot", "land"]),
  listingType: z.enum(["rent", "sale"]),
  price: z.number().positive("Price must be positive"),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  area: z.number().positive("Area must be positive").optional(),
  yearBuilt: z.number().int().optional(),
});

export type BasicInfoData = z.infer<typeof basicInfoSchema>;

const basicInfo = reactive<BasicInfoData>({
  title: "",
  description: "",
  propertyType: "house",
  listingType: "sale",
  price: 0,
});

const emits = defineEmits<{
  next: [BasicInfoData];
  back: [];
}>();

const listingType = ref<"sale" | "rent">("sale");
const propertyType = ref<"house" | "land">("house");
const homeType = ref<string>("");

const homeTypes = ["Single Family", "Townhouse", "Condo", "Apartment", "Duplex", "Mobile Home", "Cabin", "Loft"];

const landTypes = ["Residential", "Commercial", "Agricultural", "Industrial", "Recreational"];

const filteredTypes = computed(() => {
  return propertyType.value === "house" ? homeTypes : landTypes;
});

function setListingType(type: "sale" | "rent") {
  listingType.value = type;
  basicInfo.listingType = type;
}

function setPropertyType(type: "house" | "land") {
  propertyType.value = type;
  basicInfo.propertyType = type === "house" ? "house" : "land";
}

function next() {
  try {
    const validated = basicInfoSchema.parse(basicInfo);
    emits("next", validated);
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

    <div class="mt-8 flex justify-between">
      <Button variant="outline" @click="back">Back</Button>
      <Button class="bg-navy text-white" @click="next">Next</Button>
    </div>
  </ListingContainer>
</template>
