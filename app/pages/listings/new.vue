<script lang="ts">
export const schema = z.object({
  location: z.object({
    cood: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    isAccurate: z.boolean(),
  }),
});
export type UserData = Partial<z.infer<typeof schema>>;
</script>
<script setup lang="ts">
import { z } from "zod/v4-mini";

const steps = ref(0);
const data = reactive<UserData>({});
</script>
<template>
  <section class="h-full grid place-items-center grow">
    <Title>New Listing</Title>
    <ListingLocation
      v-if="steps === 0"
      @location="
        data.location = $event;
        steps++;
      "
    />
    <ListingInformationBasic v-if="steps === 1" />
  </section>
</template>
