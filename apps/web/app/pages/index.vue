<script setup lang="ts">
type Query = {
  lease?: "buy" | "rent";
};
const query = reactive<Query>({
  lease: undefined,
});

function variant(expected: typeof query.lease) {
  if (query.lease === expected) return undefined;
  return "outline";
}
</script>
<template>
  <section>
    <Title>Home</Title>
    <main class="w-full grid place-items-center">
      <div style="margin-top: 25vh">
        <div class="flex gap-2 items-center mb-1.5">
          <UButton class="gap-1" :variant="variant('rent')" @click="query.lease = 'rent'">
            <Icon name="local:smile-home" class="w-4 h-4" /> Rent
          </UButton>
          <UButton class="gap-1" :variant="variant('buy')" @click="query.lease = 'buy'">
            <Icon name="local:heart-home" class="w-5 h-5" /> Buy
          </UButton>
        </div>
        <InputLocation
          class="w-[600px] h-14 rounded-lg focus:outline-none focus:ring-1 ring-purple-400 text-nm font-mulish lg:w-[700px]"
          placeholder="Enter a city, town or location to search"
          @keydown.enter="navigateTo('./listings')"
          :ui="{
            input: 'py-3'
          }"
        />
      </div>
    </main>
  </section>
</template>
