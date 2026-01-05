<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
import type { NavigationMenuItem } from "@nuxt/ui";

const { links = [] } = defineProps<{
  links?: NavigationMenuItem[];
}>();

const navigation = inject<Ref<ContentNavigationItem[]>>("navigation", ref([]));
const docsNavigation = computed(() => navigation.value.find((item) => item.path === "/docs")?.children || []);

defineShortcuts({
  meta_k(e) {
    console.log(e);
  },
  handler(_) {},
});
</script>

<template>
  <UHeader :ui="{ left: 'min-w-0' }" mode="drawer" :menu="{ shouldScaleBackground: true }">
    <template #left>
      <NuxtLink to="/" class="flex items-center">
        <Logo lp />
        <span class="text-xs font-mono text-muted"><span class="mx-2">|</span>v{{ $config.public.version }}</span>
      </NuxtLink>
    </template>

    <UContentSearchButton :collapsed="false" class="w-[300px]" />

    <template #right>
      <CustomButton label="Get Started" size="xs" to="https://app.finueva.com" />
      <UContentSearchButton class="lg:hidden" />
      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu orientation="vertical" :items="links" class="-mx-2.5" />
      <USeparator type="dashed" class="mt-4 mb-6" />
      <UContentNavigation :navigation="docsNavigation" highlight />
    </template>
  </UHeader>
</template>
