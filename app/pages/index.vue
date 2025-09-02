<script setup lang="ts">
import { Button } from "@/components/ui/button";

type Query = {
  lease?: "buy" | "rent";
};
const query = reactive<Query>({
  lease: undefined,
});

function variant(expected: typeof query.lease) {
  if (query.lease === expected) return "default";
  return "outline";
}
</script>
<template>
  <section>
    <Title>Home</Title>
    <main class="w-full grid place-items-center">
      <div style="margin-top: 25vh">
        <div class="flex gap-2 items-center mb-1.5">
          <Button class="gap-1" :variant="variant('rent')" @click="query.lease = 'rent'">
            <Icon name="local:smile-home" class="w-4 h-4" /> Rent
          </Button>
          <Button class="gap-1" :variant="variant('buy')" @click="query.lease = 'buy'">
            <Icon name="local:heart-home" class="w-5 h-5" /> Buy
          </Button>
        </div>
        <InputLocation
          class="w-[600px] h-14 rounded-lg focus:outline-none focus:ring-1 ring-purple-400 px-4 text-nm font-mulish lg:w-[700px]"
          placeholder="Enter a city, town or location to search"
          @keydown.enter="navigateTo('./listing')"
        />
      </div>
    </main>
  </section>
</template>
