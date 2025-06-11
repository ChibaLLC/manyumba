<template>
  <section class="h-60 rounded-sm">
    <div ref="map" class="h-full w-full"></div>
    <MapLoadingIndicator :loading />
    <div ref="pin">
      <Icon name="bxs:pin" class="text-red-500 w-8 h-8 pin-glow" v-if="!loading" />
    </div>
  </section>
</template>

<script setup lang="ts">
/// <reference types="@types/google.maps" />
const props = defineProps<{
  initialLocation?: LocationCoods;
}>();

const emits = defineEmits<{
  (e: "location", payload: { isAccurate: boolean; cood: google.maps.LatLngLiteral }): void;
}>();

const mapEl = useTemplateRef("map");
const Map = shallowRef<google.maps.Map>();
const marker = shallowRef<google.maps.marker.AdvancedMarkerElement>();
const config = useRuntimeConfig();
const loading = ref(true);
const pin = useTemplateRef("pin");

const { onLoaded, status } = useScript(
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
  }
);

function toCoord(
  pos: google.maps.LatLngLiteral | google.maps.LatLng | google.maps.LatLngAltitudeLiteral | null | undefined
): Partial<LocationCoods["cood"]> {
  return {
    lat: typeof pos?.lat === "function" ? pos.lat() : pos?.lat,
    lng: typeof pos?.lng === "function" ? pos.lng() : pos?.lng,
  };
}

async function setMapCenter(pos: google.maps.LatLngLiteral | undefined, isAccurate = false) {
  if (!Map.value || !pos) return;

  Map.value.setCenter(pos);
  if(isAccurate) {
    Map.value.setZoom(25)
  }

  if (!marker.value) {
    loading.value = true;
    const { AdvancedMarkerElement } = (await window.google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
    marker.value = new AdvancedMarkerElement({
      map: Map.value,
      position: pos,
      content: pin.value,
      gmpDraggable: true,
    });

    marker.value.addListener("dragend", (_: Event) => {
      if (!marker.value) return console.warn("Marker val is undefined");

      const newPos = marker.value.position;
      if (newPos) {
        emits("location", {
          isAccurate: false,
          cood: toCoord(newPos) as LocationCoods["cood"],
        });
      }
    });
  } else {
    marker.value.position = pos;
  }

  loading.value = false;
  emits("location", { isAccurate, cood: pos });
}

// 🗺️ Click handler to place a pin
function enableMapClickSelection() {
  Map.value?.addListener("click", (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const coords = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMapCenter(coords, false);      
    }
  });
}

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

defineExpose({ getCurrentLocation, setMapCenter });

let setUp = false;
function setUpMap(maps?: typeof google.maps) {
  if (setUp) return;
  setUp = true;
  setTimeout(() => {
    const watching = mapEl.value ? () => props.initialLocation : [mapEl, () => props.initialLocation];
    watch(
      watching,
      async () => {
        if (!mapEl.value) return;

        const pos = await useCoords({
          initial: props.initialLocation,
          accurate: false,
          default: {
            // Our HQ
            lat: -1.258507,
            lng: 36.805931,
          },
        });

        if (!Map.value) {
          const _Map = maps?.Map || google.maps.Map;
          Map.value = new _Map(mapEl.value, {
            center: pos.cood,
            zoom: pos.isAccurate ? 25 : 15,
            // actually required
            mapId: "DEMO_MAP_ID",
            mapTypeId: "satellite"
          });
        }

        setMapCenter(pos.cood, pos.isAccurate);
        enableMapClickSelection();
        loading.value = false;
      },
      { immediate: true }
    );
  });
}

onLoaded((maps) => {
  if (maps.Map) {
    setUpMap(maps);
  }
});

onMounted(() => {
  if (status.value === "loaded") {
    setUpMap();
  } else {
    // sth dumb I have to do because useScript is unstable
    let w = watch(
      status,
      (state) => {
        if (state === "loaded") {
          setUpMap();
          w.stop();
        }

        if (state === "error") {
          $alert("Unable to load google maps");
          w.stop();
        }
      },
      {
        immediate: true,
      }
    );
  }
});
</script>
<style>
.pin-glow svg {
  box-shadow: 0px 0px 248px 19px var(--color-red-300);
}
</style>
