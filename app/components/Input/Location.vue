<script lang="ts">
import { computedAsync } from "@vueuse/core";
export type SuggestionResponse = {
  suggestions: Array<{
    placePrediction: {
      place: string;
      placeId: string;
      text: {
        text: string;
        matches: Array<{
          startOffset?: number;
          endOffset: number;
        }>;
      };
      structuredFormat: {
        mainText: {
          text: string;
          matches: Array<{
            startOffset?: number;
            endOffset: number;
          }>;
        };
        secondaryText: {
          text: string;
        };
      };
      types: string[];
    };
  }>;
};

export type SuggestionRequest = {
  input: string;
  locationBias?: CircleBias;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type CircleBias = {
  circle: {
    center: {
      latitude: number;
      longitude: number;
    };
    // in meters
    radius: number;
  };
};
</script>
<script setup lang="ts">
const input = ref<string>();
const config = useRuntimeConfig();
const data = shallowRef<SuggestionResponse>();

const props = defineProps<{
  initialLocation?: LocationCoods;
}>();

async function getPlaceCoordinates(placeID: string): Promise<LocationCoods | undefined> {
  const { result, error } = await execute(
    $fetch<{ location: Coordinates }>(`https://places.googleapis.com/v1/places/${placeID}`, {
      headers: {
        "X-Goog-Api-Key": config.public.google.maps.key,
        "X-Goog-FieldMask": "location",
      },
    })
  );

  if (error) {
    $alert("A Google Maps error occurred");
    return undefined;
  }

  return {
    isAccurate: true,
    cood: {
      lat: result.location.latitude,
      lng: result.location.longitude,
    },
  };
}

async function emitPlaceCoords(placeID: string) {
  const coords = await getPlaceCoordinates(placeID);
  if (!coords) {
    alert("We are unable to locate you. Please check your location settings.");
    return;
  }

  emits("coordinates", coords);
}

const center = computedAsync(() => {
  if (props.initialLocation) {
    return props.initialLocation;
  }

  return useCoords();
});

const fetchSuggestions = debounce(async (value?: string) => {
  value = value?.trim();
  if (!value) return;

  const prediction = data.value?.suggestions.at(0);
  if (value === prediction?.placePrediction.text.text) {
    emitPlaceCoords(prediction.placePrediction.placeId);
    return;
  }
  const { result, error } = await execute(
    $fetch<SuggestionResponse>("https://places.googleapis.com/v1/places:autocomplete", {
      headers: {
        "X-Goog-Api-Key": config.public.google.maps.key,
      },
      method: "POST",
      body: {
        input: value,
        locationBias: center.value
          ? {
              circle: {
                center: {
                  latitude: center.value.cood.lat,
                  longitude: center.value.cood.lng,
                },
                radius: 1000,
              },
            }
          : undefined,
      } satisfies SuggestionRequest,
    })
  );

  if (error) {
    console.error(error);
    return;
  }

  data.value = result;
}, 200);

watch(input, fetchSuggestions);

const emits = defineEmits<{
  coordinates: [LocationCoods];
}>();

defineOptions({
  inheritAttrs: false,
});
</script>
<template>
  <div>
    <Input
      class="p-2 rounded-md w-full focus:ring"
      list="locations"
      v-model="input"
      v-bind="$attrs"
      autocomplete="street-address"
    >
      <Icon name="local:location" />
    </Input>
    <datalist id="locations">
      <option v-for="item of data?.suggestions" :value="item.placePrediction.text.text" />
    </datalist>
  </div>
</template>
