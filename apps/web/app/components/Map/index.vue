<template>
  <section class="rounded-sm">
    <div ref="map" class="h-full w-full"></div>
    <MapLoadingIndicator :loading />
    <slot />
  </section>
</template>
<script setup lang="ts">
import type { SmartString } from "@chiballc/types";
import { useMounted } from "@vueuse/core";

const mapElement = useTemplateRef("map");
const loading = ref(true);

const props = defineProps<{
  initialLocation?: LocationCoods;
  marker?: google.maps.MarkerLibrary["AdvancedMarkerElement"];
  mapTypeId?: SmartString<"satellite">;
}>();
const emits = defineEmits<{
  click: [google.maps.MapMouseEvent];
  location: [{ isAccurate: boolean; cood: google.maps.LatLngLiteral }];
}>();

const { map, on, initMap } = useGoogleMaps();

const onMapClick = (e: google.maps.MapMouseEvent) => {
  emits("click", e);
};
on("click", onMapClick);

async function setMapCenter(
  pos: google.maps.LatLngLiteral | undefined,
  isAccurate: boolean,
  marker?: InstanceType<google.maps.MarkerLibrary["AdvancedMarkerElement"]>,
) {
  if (!map.value || !pos) {
    console.warn("Map not loaded or pos(arg1) not given");
    return;
  }

  map.value.setCenter(pos);
  if (isAccurate) {
    map.value.setZoom(25);
  }

  if (marker) {
    marker.position = pos;
  }

  loading.value = false;
  emits("location", { isAccurate, cood: pos });
}

const { data: pos } = useCoords(() => ({
  initial: props.initialLocation,
  accurate: false,
  default: {
    //TODO: Our HQ
    lat: -1.258507,
    lng: 36.805931,
  },
}));

const { data, error, execute } = useCoords(
  {
    accurate: true,
    default: pos.value?.cood,
  },
  {
    immediate: false,
  },
);

async function getCurrentLocation() {
  try {
    loading.value = true;
    await execute();
    if (!data.value) {
      loading.value = false;
      throw createError(error.value || "Unable to get your location");
    }
    setMapCenter(pos.value?.cood, !!pos.value?.isAccurate);
  } catch (error: any) {
    console.error(error);
    alert(error.message || "Failed to get location.");
  }

  loading.value = false;
}

const mounted = useMounted();
watch(
  [mapElement, mounted],
  ([el, mounted]) => {
    if (!el || !mounted) {
      return;
    }

    initMap(el, {
      center: pos.value?.cood,
      zoom: pos.value?.isAccurate ? 25 : 15,
      // actually required
      mapId: "DEMO_MAP_ID",
      mapTypeId: props.mapTypeId,
      callback: () => {
        setMapCenter(pos.value?.cood, !!pos.value?.isAccurate);
      },
    });
  },
  { immediate: true },
);

defineExpose({
  loading,
  map,
  setMapCenter,
  getCurrentLocation,
});
</script>
