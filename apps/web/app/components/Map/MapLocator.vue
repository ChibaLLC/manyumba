<template>
  <Map ref="map" :initial-location="initialLocation" class="h-60" map-type-id="satellite">
    <div ref="pin">
      <Icon name="bxs:pin" class="text-red-500 w-8 h-8 pin-glow" v-if="map && !map?.loading" />
    </div>
  </Map>
</template>

<script setup lang="ts">
/// <reference types="@types/google.maps" />
const props = defineProps<{
  initialLocation?: LocationCoods;
}>();

const emits = defineEmits<{
  location: [{ isAccurate: boolean; cood: google.maps.LatLngLiteral }];
}>();

const map = useTemplateRef("map");
const pin = useTemplateRef("pin");

defineExpose({
  getCurrentLocation: () => map.value?.getCurrentLocation(),
  setMapCenter: (...args: Parameters<NonNullable<typeof map.value>["setMapCenter"]>) => {
    return map.value?.setMapCenter(...args);
  },
});

function toCoord(
  pos: google.maps.LatLngLiteral | google.maps.LatLng | google.maps.LatLngAltitudeLiteral | null | undefined,
): Partial<LocationCoods["cood"]> {
  return {
    lat: typeof pos?.lat === "function" ? pos.lat() : pos?.lat,
    lng: typeof pos?.lng === "function" ? pos.lng() : pos?.lng,
  };
}

async function createMarker(initialCoordinates?: LocationCoods) {
  if (!initialCoordinates) {
    initialCoordinates = await useCoords({
      initial: props.initialLocation,
      accurate: false,
      default: {
        //TODO: Our HQ
        lat: -1.258507,
        lng: 36.805931,
      },
    });
  }

  if (!map.value) {
    consola.warn("Map Value Component Not Found");
  }

  const { AdvancedMarkerElement } = (await window.google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
  return new AdvancedMarkerElement({
    map: map.value?.map,
    position: initialCoordinates.cood,
    content: pin.value,
    gmpDraggable: true,
  });
}

watch(
  [() => map.value?.loading, props.initialLocation],
  async ([loading]) => {
    if (!map.value) {
      console.warn("Map Component Not Found");
      return;
    }

    if (loading) {
      console.info("Loading Map");
      return;
    }

    const marker = await createMarker(props.initialLocation);
    marker.addListener("dragend", (_: Event) => {
      const newPos = marker.position;
      if (newPos) {
        emits("location", {
          isAccurate: false,
          cood: toCoord(newPos) as LocationCoods["cood"],
        });
      }
    });
  },
  {
    immediate: true,
  },
);
</script>
<style>
.pin-glow svg {
  box-shadow: 0px 0px 248px 19px var(--color-red-300);
}
</style>
