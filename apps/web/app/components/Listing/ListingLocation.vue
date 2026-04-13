<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { execute } from "@chiballc/utils";

const locator = useTemplateRef("locator");
async function setPlaceCoords(coords: LocationCoods) {
  execute(locator.value?.setMapCenter, coords.cood, coords.isAccurate);
  setTimeout(() => {
    if (!location.value) {
      consola.warn("Force setting location because maps had a problem");
      location.value = coords;
    }
  });
}

const location = shallowRef<LocationCoods>();
const emits = defineEmits<{
  location: [LocationCoods];
}>();

function next() {
  if (!location.value) {
    $alert("We couldn't get your location, please retry");
    return;
  }

  emits("location", location.value);
}
</script>
<template>
  <ListingContainer class="flex flex-col h-full">
    <div>
      <h1 class="font-dm-serif text-4xl">Location</h1>
      <p class="font-mulish">
        Drop a pin to the precise location of the property. You can use your current location if you are on site
        (recommended).
      </p>
      <p>You can use the search to get the general area. Then reposition the pin.</p>
    </div>
    <div class="flex w-full justify-between mt-4">
      <Button class="w-fit bg-emerald-900 text-white hover:bg-emerald-800" @click="locator?.getCurrentLocation"
        >Use Current Location</Button
      >
      <InputLocation :initial-location="location" @coordinates="setPlaceCoords" />
    </div>
    <MapLocator ref="locator" class="my-2" @location="location = $event" />
    <Button class="self-end" @click="next()">Next</Button>
  </ListingContainer>
</template>
