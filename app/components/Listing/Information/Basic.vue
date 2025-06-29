<script lang="ts">
import { z } from "zod/v4-mini";

export const propertyType = ["apartment", "house", "commercial", "plot", "land"] as const;
export const listingType = ["rent", "sale"] as const;
export type ListingType = (typeof listingType)[number];
export type PropertyType = (typeof propertyType)[number];

export const homeTypes = [
  "Single Family",
  "Townhouse",
  "Condo",
  "Apartment",
  "Duplex",
  "Mobile Home",
  "Cabin",
  "Loft",
] as const;
export const landTypes = ["Residential", "Commercial", "Agricultural", "Industrial", "Recreational"] as const;

export const { data, schema, validate } = useZodState({
  assetType: z.enum(["apartment", "house", "commercial", "plot", "land"]),
  listingType: z.enum(["rent", "sale"]),
  propertyType: z.union([z.enum(homeTypes), z.enum(landTypes)]),
});

export type BasicInfoData = z.infer<typeof schema>;
</script>
<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "vue-sonner";

const homeType = ref<string>("");

const filteredTypes = computed(() => {
  if (!data.assetType) {
    return undefined;
  }
  return data.assetType === "house" ? homeTypes : landTypes;
});

function next() {
  const { error, data } = validate({ prettifyError: true });
  if (!error) {
    emits("next", data);
  } else {
    console.log(error);
    toast.error(String(error));
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
  data.listingType = type;
}

function setPropertyType(type: PropertyType) {
  data.assetType = type;
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
          :class="data.listingType === 'sale' ? 'bg-navy text-white' : 'text-navy bg-sky-100 border-sky-200 border'"
          @click="setListingType('sale')"
        >
          <Icon name="local:heart-home" class="mr-2" />
          Sale
        </Button>
        <Button
          :class="data.listingType === 'rent' ? 'bg-navy text-white' : 'text-navy bg-sky-100 border-sky-200 border'"
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
          :class="data.assetType === 'house' ? 'bg-navy text-white' : 'text-navy bg-sky-100 border-sky-200 border'"
          @click="setPropertyType('house')"
        >
          <Icon name="local:shroom-home" class="mr-2" />
          Home
        </Button>
        <Button
          :class="data.assetType === 'land' ? 'bg-navy text-white' : 'text-navy bg-sky-100 border-sky-200 border'"
          @click="setPropertyType('land')"
        >
          <Icon name="local:land" class="mr-2" />
          Land
        </Button>
      </div>
    </div>

    <div class="mt-6" v-if="filteredTypes">
      <h2 class="newton font-semibold text-lg mb-2">{{ data.assetType === "house" ? "Home" : "Land" }} Type</h2>
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
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 relative">
        <TransitionGroup name="choices">
          <Button
            v-for="type in filteredTypes"
            :key="type"
            variant="outline"
            :class="homeType === type ? 'bg-navy text-white' : 'bg-white'"
            @click="homeType = type"
          >
            {{ type }}
          </Button>
        </TransitionGroup>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <Button variant="outline" @click="back">Back</Button>
      <Button class="bg-navy text-white" @click="next">Next</Button>
    </div>
  </ListingContainer>
</template>
<style scoped>
/* TODO: Improve animation */
.choices-enter-active,
.choices-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.choices-enter-from,
.choices-leave-to {
  opacity: 0;
  transform: scale(0.95);
  position: absolute;
  height: 100%;
  width: 100%;
}
.choices-enter-to,
.choices-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
