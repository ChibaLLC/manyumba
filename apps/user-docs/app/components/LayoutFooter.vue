<script setup lang="ts">
import type { FooterColumn } from "@nuxt/ui";

const email = ref("");
const columns: FooterColumn[] = [
  {
    label: "Product",
    children: [
      {
        label: "Roadmap",
        to: "/docs/roadmap",
      },
    ],
  },
  {
    label: "Resources",
    children: [
      {
        label: "Documentation",
        to: "/docs/getting-started",
      },
      {
        label: "Blog",
        to: "/blog",
      },
      {
        label: "Brand Assets",
        to: "/",
      },
      {
        label: "LLM.txt",
        to: "/llms.txt",
        target: "_blank",
        external: true,
      },
    ],
  },
  {
    label: "Legal",
    children: [
      {
        label: "Privacy Policy",
        to: "/legal/privacy",
      },
      {
        label: "Terms of Service",
        to: "/legal/terms",
      },
    ],
  },
];
</script>

<template>
  <USeparator icon="local:logo" class="h-px z-20" />

  <UFooter :ui="{ top: 'border-b border-default', root: 'bg-default z-10' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns>
          <template #right>
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <h3 class="text-sm font-semibold text-highlighted">Stay Updated</h3>
                <p class="text-xs text-muted">Follow our development and get the latest updates</p>
              </div>
              <div class="flex flex-col gap-2">
                <UFormField>
                  <UTooltip text="Coming soon">
                    <UInput
                      v-model="email"
                      placeholder="Email"
                      type="email"
                      class="w-full"
                      disabled
                      :ui="{ base: 'rounded-none' }"
                    />
                  </UTooltip>
                </UFormField>
                <div style="color-scheme: none" class="w-full">
                  <iframe
                    src="https://status.finueva.com/badge?theme=dark"
                    height="30"
                    width="100%"
                    class="rounded border-none"
                  />
                </div>
              </div>
            </div>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <div class="text-xs font-mono italic tracking-tight">
        <span class="text-muted"> © {{ new Date().getFullYear() }} - </span>
        <ULink to="mailto:contact@finueva.com" class="hover:underline"> Finueva </ULink>
      </div>
    </template>

    <template #right>
      <UButton
        color="neutral"
        variant="ghost"
        to="https://x.com/finueva"
        target="_blank"
        icon="i-simple-icons-x"
        size="sm"
      >
        <span class="sr-only">Finueva on X</span>
      </UButton>
      <UButton
        color="neutral"
        variant="ghost"
        to="https://discord.gg/finueva"
        target="_blank"
        icon="i-simple-icons-discord"
        size="sm"
      >
        <span class="sr-only">Finueva on Discord</span>
      </UButton>
      <UColorModeButton size="sm" />
    </template>
  </UFooter>
</template>
