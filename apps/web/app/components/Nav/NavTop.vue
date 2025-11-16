<style>
.logo {
  font-weight: bold;
  font-size: 20px;
}
</style>
<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { Button } from "@/components/ui/button";

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Properties",
    to: "/listings",
    icon: "i-lucide-map-pin-house",
  },
  {
    label: "Roadmap",
    icon: "i-lucide-map",
    to: "https://github.com/orgs/ChibaLLC/projects/1",
    target: "_blank",
  },
]);

const mobileInput = ref(false);
function showMobileInput() {
  mobileInput.value = true;
}

const inListing = computed(() => route.path.startsWith("/listings"));
</script>

<template>
  <UHeader
    :ui="{
      container: 'px-10 py-4 bg-white/80 backdrop-blur nav',
    }"
  >
    <template #left>
      <div class="flex items-center">
        <NuxtLink to="/" class="logo font-inknut">Manyumba</NuxtLink>
        <Button
          class="font-mulish mt-0.5 font-semibold text-muted text-base hover:text-primary transition-colors max-sm:hidden"
          variant="ghost"
        >
          Payments
        </Button>
      </div>
    </template>

    <UInput
      v-if="inListing"
      leading-icon="i-lucide-search"
      :ui="{
        base: 'md:w-96',
      }"
      icon="i-lucide-map-pin"
    />
    <UNavigationMenu :items="items" v-else />
    <InputLocation modal :open="mobileInput" @update:open="mobileInput = $event" />
    <template #right>
      <UIcon
        class="lg:hidden mr-1 text-navy/80 hover:text-navy p-1 rounded-md w-7.5 h-7.5 shadow-xs"
        name="i-lucide-search"
        @click="showMobileInput"
        v-if="inListing"
      />
      <div class="flex items-center max-sm:hidden">
        <NuxtLink to="/listings/new">
          <Button variant="outline" class="border">List Property</Button>
        </NuxtLink>
        <div class="font-semibold ml-2 max-lg:hidden"><span>Log In</span> | <span>Sign Up</span></div>
      </div>
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>
<style scoped>
.nav {
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.1);
}
.logo {
  font-weight: bold;
  font-size: 20px;
}
</style>
