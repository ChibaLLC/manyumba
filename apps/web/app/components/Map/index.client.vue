<template>
  <section class="rounded-sm">
    <div ref="map" class="h-full w-full"></div>
    <MapLoadingIndicator :loading />
    <slot />
  </section>
</template>
<script setup lang="ts">
import type { SmartString } from "@chiballc/types";
import type { WatchHandle } from "vue";

const mapEl = useTemplateRef("map");
const Map = shallowRef<google.maps.Map>();
const loading = ref(true);

const config = useRuntimeConfig();
const { onLoaded } = useScript(
  {
    src: `https://maps.googleapis.com/maps/api/js?key=${config.public.google.maps.key}&v=weekly&solution_channel=GMP_CCS_geolocation_v2&loading=async`,
    async: true,
    defer: true,
  },
  {
    use() {
      return window.google && window.google.maps;
    },
    bundle: true,
  },
);

const props = defineProps<{
  initialLocation?: LocationCoods;
  marker?: google.maps.MarkerLibrary["AdvancedMarkerElement"];
  mapTypeId?: SmartString<"satellite">;
}>();
const emits = defineEmits<{
  click: [google.maps.MapMouseEvent];
  location: [{ isAccurate: boolean; cood: google.maps.LatLngLiteral }];
}>();

function enableMapClickSelection() {
  Map.value?.addListener("click", (e: google.maps.MapMouseEvent) => {
    emits("click", e);
  });
}

async function setMapCenter(
  pos: google.maps.LatLngLiteral | undefined,
  isAccurate: boolean,
  marker?: InstanceType<google.maps.MarkerLibrary["AdvancedMarkerElement"]>,
) {
  if (!Map.value || !pos) return;

  Map.value.setCenter(pos);
  if (isAccurate) {
    Map.value.setZoom(25);
  }

  if (marker) {
    marker.position = pos;
  }

  loading.value = false;
  emits("location", { isAccurate, cood: pos });
}

let mapWatch: WatchHandle | undefined;
const { data: pos, refresh } = useCoords(() => ({
  initial: props.initialLocation,
  accurate: false,
  default: {
    //TODO: Our HQ
    lat: -1.258507,
    lng: 36.805931,
  },
}));

function setUpMap(maps: typeof google.maps | undefined) {
  const watching = mapEl.value ? () => props.initialLocation : [mapEl, () => props.initialLocation];
  console.log(maps)
  mapWatch?.stop();
  mapWatch = watch(
    watching,
    async () => {
      if (!maps) {
        consola.fatal("Google Maps API failed to load.");
        return;
      }
      if (!mapEl.value) return;

      if (!Map.value) {
        Map.value = new maps.Map(mapEl.value, {
          center: pos.value?.cood,
          zoom: pos.value?.isAccurate ? 25 : 15,
          // actually required
          mapId: "DEMO_MAP_ID",
          mapTypeId: props.mapTypeId,
        });
      }

      setMapCenter(pos.value?.cood, !!pos.value?.isAccurate);
      enableMapClickSelection();
      loading.value = false;
    },
    { immediate: true },
  );
}

onMounted(() => {
  onLoaded((maps) => {
    setUpMap(maps);
  });
});

async function getCurrentLocation() {
  try {
    loading.value = true;
    await refresh();
    if (!pos.value) {
      loading.value = false;
      throw createError("Unable to get your location");
    }
    setMapCenter(pos.value?.cood, !!pos.value?.isAccurate);
  } catch (error: any) {
    console.error(error);
    alert(error.message || "Failed to get location.");
  }

  loading.value = false;
}

defineExpose({
  loading,
  map: Map,
  setMapCenter,
  getCurrentLocation,
});
</script>
