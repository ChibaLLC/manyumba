<script setup lang="ts">
import { Button } from "@/components/ui/button";
const locator = useTemplateRef("locator");

type SuggestionResponse = {
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

type SuggestionRequest = {
  input: string;
  locationBias?: CircleBias;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

type CircleBias = {
  circle: {
    center: {
      latitude: number;
      longitude: number;
    };
    // in meters
    radius: number;
  };
};

const input = ref<string>();
const config = useRuntimeConfig();

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
    $alert("A Google Maps error occurred")
    return undefined
  }

  return {
    isAccurate: true,
    cood: {
      lat: result.location.latitude,
      lng: result.location.longitude,
    },
  };
}

const fetchSuggestions = debounce(async (value?: string) => {
  value = value?.trim();
  if (!value) return;

  const prediction = data.value?.suggestions.at(0);
  if (value === prediction?.placePrediction.text.text) {
    setPlaceCoords(prediction.placePrediction.placeId);
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
        locationBias: location.value
          ? {
              circle: {
                center: {
                  latitude: location.value.cood.lat,
                  longitude: location.value.cood.lng,
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

const data = shallowRef<SuggestionResponse>();
watch(input, fetchSuggestions);
const location = shallowRef<LocationCoods>();

async function setPlaceCoords(placeID: string) {
  const coords = await getPlaceCoordinates(placeID);
  if(!coords) return
  locator.value?.setMapCenter(coords.cood, coords.isAccurate)
}
</script>
<template>
  <ListingContainer class="flex flex-col">
    <div>
      <h1 class="dm-serif-text text-4xl">Location</h1>
      <p class="mulish">
        Drop a pin to the precise location of the property. You can use your current location if you are on site
        (recommended).
      </p>
      <p>You can use the search to get the general area. Then reposition the pin.</p>
    </div>
    <div class="flex w-full justify-between mt-4">
      <Button class="w-fit bg-emerald-900 text-white" @click="locator?.getCurrentLocation">Use Current Location</Button>
      <Input class="p-2 rounded-md w-52 focus:ring" list="locations" v-model="input">
        <Icon name="local:location" />
      </Input>
      <datalist id="locations">
        <option
          v-for="item of data?.suggestions"
          :value="item.placePrediction.text.text"
          @click="setPlaceCoords(item.placePrediction.placeId)"
        />
      </datalist>
    </div>
    <MapLocator class="my-2" ref="locator" @location="location = $event" />
    <Button class="self-end">Next</Button>
  </ListingContainer>
</template>
