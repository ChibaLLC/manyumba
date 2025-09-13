<script lang="ts">
export const { data, validate } = useZodState(BasicSchema);
</script>
<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BasicSchema, homeTypes, landTypes } from "utils";
import type { AssetType, BasicInfoData, ListingType, PropertyType } from "types";
import { toast } from "vue-sonner";

const assetTypeSearch = ref<string>();

const filteredAssetTypes = computed(() => {
  if (!data.propertyType) {
    return undefined;
  }
  const properties = data.propertyType === "home" ? homeTypes : landTypes;
  if (!assetTypeSearch.value?.trim()) {
    return properties;
  }

  return properties.filter((p) => {
    if (!assetTypeSearch.value) {
      return false;
    }

    return p.toLocaleLowerCase().includes(assetTypeSearch.value.trim().toLocaleLowerCase());
  });
});

function next() {
  const { error, data: validated } = validate({ prettifyError: true });
  if (!error) {
    emits("next", validated);
  } else {
    console.log(error);
    console.log(data);
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
  data.propertyType = type;
}

function setAssetType(type: AssetType) {
  data.assetType = type;
}
</script>

<template>
  <ListingContainer>
    <div>
      <h1 class="font-dm-serif text-4xl">Basic Information</h1>
      <p class="font-mulish">Put in as much details as needed.</p>
    </div>

    <div class="mt-6">
      <h2 class="font-newton font-semibold text-lg mb-2">Lease Type</h2>
      <div class="flex gap-3">
        <Button
          class="text-navy bg-sky-100 border-sky-200 border"
          :class="{
            'bg-navy text-white': data.listingType === 'sale',
          }"
          @click="setListingType('sale')"
        >
          <Icon name="local:heart-home" class="mr-2" />
          Sale
        </Button>
        <Button
          class="text-navy bg-sky-100 border-sky-200 border"
          :class="{
            'bg-navy text-white': data.listingType === 'rent',
          }"
          @click="setListingType('rent')"
        >
          <Icon name="local:smile-home" class="mr-2" />
          Rent
        </Button>
      </div>
    </div>

    <div class="mt-6">
      <h2 class="font-newton font-semibold text-lg mb-2">Property Type</h2>
      <div class="flex gap-3">
        <Button
          class="text-navy bg-sky-100 border-sky-200 border"
          :class="{
            'bg-navy text-white': data.propertyType === 'home',
          }"
          @click="setPropertyType('home')"
        >
          <Icon name="local:shroom-home" class="mr-2" />
          Home
        </Button>
        <Button
          class="text-navy bg-sky-100 border-sky-200 border plop"
          @click="setPropertyType('land')"
          :class="{
            'bg-navy text-white': data.propertyType === 'land',
          }"
        >
          <Icon name="local:land" class="mr-2" />
          Land
        </Button>
      </div>
    </div>

    <div class="mt-6" v-if="filteredAssetTypes">
      <h2 class="font-newton font-semibold text-lg mb-2">{{ data.propertyType === "home" ? "Home" : "Land" }} Type</h2>
      <div class="relative flex items-center mb-4">
        <span class="absolute left-3 text-gray-400">
          <Icon name="local:search" class="w-4 h-4" />
        </span>
        <Input
          v-model="assetTypeSearch"
          type="search"
          placeholder="Search..."
          aria-label="Search"
          class="bg-white rounded-lg border border-gray-300 w-full pl-9 pr-4 py-2 focus:border-transparent transition duration-200 ease-in-out hover:border-gray-400 placeholder-gray-400"
          autocomplete="off"
        />
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 relative" v-if="filteredAssetTypes">
        <TransitionGroup name="choices">
          <Button
            v-for="type of filteredAssetTypes"
            :key="type"
            variant="outline"
            class="bg-white"
            :class="{
              'bg-navy text-white': data.assetType === type,
            }"
            @click="setAssetType(type)"
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
