<template>
  <section class="rounded-sm">
    <div ref="map" class="h-full w-full"></div>
    <MapLoadingIndicator :loading />
    <slot />
  </section>
</template>
<script setup lang="ts">
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
function setUpMap(maps: typeof google.maps) {
  const watching = mapEl.value ? () => props.initialLocation : [mapEl, () => props.initialLocation];
  mapWatch?.stop();
  mapWatch = watch(
    watching,
    async () => {
      if (!mapEl.value) return;
      const pos = await useCoords({
        initial: props.initialLocation,
        accurate: false,
        default: {
          //TODO: Our HQ
          lat: -1.258507,
          lng: 36.805931,
        },
      });

      if (!Map.value) {
        Map.value = new maps.Map(mapEl.value, {
          center: pos.cood,
          zoom: pos.isAccurate ? 25 : 15,
          // actually required
          mapId: "DEMO_MAP_ID",
          mapTypeId: props.mapTypeId,
        });
      }

      setMapCenter(pos.cood, pos.isAccurate);
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
    const pos = await useCoords({
      accurate: true,
    });

    if (!pos) {
      loading.value = false;
      throw createError("Unable to get your location");
    }
    setMapCenter(pos.cood, true);
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
