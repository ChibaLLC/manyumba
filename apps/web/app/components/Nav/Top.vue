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
    active: route.path.startsWith("/listings"),
  },
  {
    label: "Documentation",
    to: "/",
    icon: "i-lucide-book-open",
    active: route.path.startsWith("/docs/getting-started"),
  },
  {
    label: "Roadmap",
    icon: "i-lucide-map",
    to: "https://github.com/orgs/ChibaLLC/projects/1",
    target: "_blank",
  },
]);
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
          class="font-mulish mt-0.5 font-semibold text-muted text-base hover:text-primary transition-colors"
          variant="ghost"
        >
          Payments
        </Button>
      </div>
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <NuxtLink to="/listings/new">
        <Button variant="outline" class="border">List Property</Button>
      </NuxtLink>
      <div class="font-semibold ml-2"><span>Log In</span> | <span>Sign Up</span></div>
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
