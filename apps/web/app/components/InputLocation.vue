<script lang="ts">
import { computedAsync } from "@vueuse/core";
import clsx from "clsx";
import type { ClassNameValue } from "tailwind-merge";
import type { CommandPaletteGroup, CommandPaletteItem } from "@nuxt/ui";

export type SuggestionResponse = {
  suggestions: Array<{
    placePrediction: {
      placeId: string;
      structuredFormat: {
        mainText: { text: string };
        secondaryText: { text: string };
      };
    };
  }>;
};

export type SuggestionRequest = {
  input: string;
  locationBias?: CircleBias;
};

export type Coordinates = { latitude: number; longitude: number };
export type CircleBias = {
  circle: { center: Coordinates; radius: number };
};
</script>

<script setup lang="ts">
const input = ref<string>("");
const config = useRuntimeConfig();
const data = shallowRef<SuggestionResponse>();
const loading = ref(false);

const emits = defineEmits<{ coordinates: [LocationCoods]; "update:open": [boolean] }>();
const props = defineProps<{
  initialLocation?: LocationCoods;
  ui?: {
    container?: ClassNameValue;
    input?: ClassNameValue;
    leadingIcon?: ClassNameValue;
    empty?: ClassNameValue;
  };
  modal?: boolean;
  open?: boolean;
}>();

async function getPlaceCoordinates(placeID: string): Promise<LocationCoods | undefined> {
  const { result, error } = await execute(
    $fetch<{ location: Coordinates }>(`https://places.googleapis.com/v1/places/${placeID}`, {
      headers: {
        "X-Goog-Api-Key": config.public.google.maps.key,
        "X-Goog-FieldMask": "location",
      },
    }),
  );
  if (error) {
    $alert("A Google Maps error occurred");
    return undefined;
  }
  return { isAccurate: true, cood: { lat: result.location.latitude, lng: result.location.longitude } };
}

async function emitPlaceCoords(placeID: string) {
  if (loading.value) return;
  loading.value = true;
  const coords = await getPlaceCoordinates(placeID);
  loading.value = false;
  if (!coords) {
    $alert.warning("Unable to locate you.");
    return;
  }
  emits("coordinates", coords);
}

const center = computedAsync(() => props.initialLocation ?? useCoords());

const fetchSuggestions = debounce(async (value?: string) => {
  const trimmed = value?.trim();
  if (!trimmed) {
    data.value = undefined;
    return;
  }
  loading.value = true;

  if (value === data.value?.suggestions[0]?.placePrediction?.structuredFormat?.mainText?.text) {
    loading.value = false;
    return;
  }

  const { result, error } = await execute(
    $fetch<SuggestionResponse>("https://places.googleapis.com/v1/places:autocomplete", {
      headers: { "X-Goog-Api-Key": config.public.google.maps.key },
      method: "POST",
      body: {
        input: trimmed,
        locationBias: center.value
          ? {
              circle: {
                center: { latitude: center.value.cood.lat, longitude: center.value.cood.lng },
                radius: 1000,
              },
            }
          : undefined,
      } satisfies SuggestionRequest,
    }),
  );

  loading.value = false;
  if (error) {
    console.error(error);
    return;
  }
  data.value = result;
}, 200);

const locationsSuggestions = computed(() => {
  return (
    data.value?.suggestions?.map((s) => ({
      label: s?.placePrediction?.structuredFormat?.mainText.text,
      id: s.placePrediction.placeId,
      description: s?.placePrediction?.structuredFormat?.secondaryText?.text,
    })) || []
  );
});

const groups = computed<CommandPaletteGroup<CommandPaletteItem>[]>(() => {
  return [
    {
      label: "Locations",
      items: locationsSuggestions.value.map((l) => ({
        label: l.label,
        suffix: l.description,
      })),
    },
  ];
});

watch(input, fetchSuggestions);

function enterSubmit() {
  const prediction = data.value?.suggestions[0];
  if (prediction) {
    input.value = prediction?.placePrediction?.structuredFormat?.mainText?.text;
    emitPlaceCoords(prediction.placePrediction.placeId);
  }
}

const binds = {
  "@update:modelValue": (id: string) => {
    const selected = data.value?.suggestions.find((s) => s.placePrediction.placeId === id);
    if (selected) {
      input.value = selected?.placePrediction?.structuredFormat?.mainText?.text;
      emitPlaceCoords(selected.placePrediction.placeId);
    }
  },
  "@keydown.enter.prevent": enterSubmit(),
  "@input": (val: Event) => {
    input.value = (val.target as HTMLInputElement).value;
  },
};
</script>

<template>
  <UModal :open @update:open="emits('update:open', $event)" v-if="modal">
    <template #content>
      <UCommandPalette :groups="groups" class="flex-1" :loading v-bind="binds" placeholder="Start typing to search" />
    </template>
  </UModal>
  <div class="relative" :class="ui?.container" v-else>
    <UInputMenu
      :items="locationsSuggestions"
      placeholder="Search location..."
      :loading="loading"
      selected-icon="i-lucide-check"
      loading-icon="i-lucide-loader"
      open-on-focus
      value-key="id"
      class="w-full"
      v-bind="binds"
      :ui="{
        item: 'cursor-pointer hover:bg-gray-100',
        group: 'bg-white shadow-md rounded-md w-full p-2',
        content: 'max-h-60 overflow-y-auto',
        base: clsx('bg-white/80 backdrop-blur focus:outline-none input', ui?.input),
        leadingIcon: ui?.leadingIcon,
        empty: clsx('w-full p-2', ui?.empty),
      }"
    >
      <template #item="{ item }">
        <div class="flex flex-col">
          <span class="font-medium">{{ item.label }}</span>
          <span class="text-xs text-gray-500">{{ item.description }}</span>
        </div>
      </template>
      <template #empty> start typing to search </template>
    </UInputMenu>
  </div>
</template>
