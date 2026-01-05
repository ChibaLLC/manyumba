<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items = [
  {
    label: "Features",
    slot: "features",
    children: [
      {
        label: "Roadmap",
        icon: "heroicons:map-solid",
        description: "See what's coming next",
        to: "/docs/roadmap",
      },
    ],
  },
  {
    label: "Docs",
    to: "/docs/getting-started",
    children: [
      {
        label: "Getting Started",
        icon: "heroicons:book-open-solid",
        description: "Learn how to use Finueva",
        to: "/docs/getting-started",
      },
      {
        label: "Quickstart",
        icon: "heroicons:inbox-arrow-down-solid",
        description: "Install Finueva on your machine",
        to: "/docs/getting-started/quickstart",
      },
    ],
  },
  {
    label: "Blog",
    to: "/blog",
  },
  {
    label: "Company",
    children: [
      {
        label: "About",
        icon: "heroicons:question-mark-circle-solid",
        description: "Meet the team behind Finueva",
        to: "/",
      },
      {
        label: "Brand",
        icon: "heroicons:photo-solid",
        description: "Assets and guidelines",
        to: "/",
      },
      {
        label: "Contact",
        icon: "heroicons:envelope-solid",
        description: "Get in touch with us",
        to: "mailto:contact@finueva.com",
      },
    ],
  },
];

const ui = computed(() => ({
  // item: 'py-0',
  childLink: "hover:bg-default/50",
  childLinkLabel: "",
  linkTrailingIcon: "hidden",
  viewport: "bg-muted ring ring-offset-6 ring-offset-(--ui-bg) ring-default border border-default",
  viewportWrapper: "w-[700px] transition-all duration-500 left-1/2 -translate-x-1/2",
}));
</script>

<template>
  <Blur position="both" class="z-10" />
  <UHeader :ui="{ root: 'shadow-xs bg-transparent border-transparent' }">
    <template #left>
      <Logo lp size="size-6" />
    </template>

    <UNavigationMenu variant="link" color="neutral" :items :ui>
      <template #features-content="{ item }">
        <div class="flex flex-row p-2 gap-2">
          <div class="w-1/2">
            <NuxtImg preload format="webp" src="/og.png" alt="Finueva" class="rounded-md size-full object-cover" />
          </div>
          <ul class="flex flex-col gap-1 w-1/2">
            <li v-for="child in item.children" :key="child.label">
              <ULink
                class="text-sm cursor-pointer w-full text-left rounded-md p-3 transition-colors hover:bg-elevated/50"
                @click="navigateTo(child.to)"
              >
                <p class="font-medium text-highlighted">
                  {{ child.label }}
                </p>
                <p class="text-muted line-clamp-2">
                  {{ child.description }}
                </p>
              </ULink>
            </li>
          </ul>
        </div>
      </template>
    </UNavigationMenu>

    <template #right>
      <div class="flex items-center gap-2">
        <CustomButton to="https://app.finueva.com/login" size="xs">
          Open App
          <UKbd value="S" />
        </CustomButton>
        <UColorModeButton />
      </div>
    </template>

    <template #body>
      <UNavigationMenu :items orientation="vertical" class="-m-2.5" />
    </template>
  </UHeader>
</template>
