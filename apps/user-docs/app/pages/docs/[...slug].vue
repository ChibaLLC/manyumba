<script setup lang="ts">
import type { LayoutKey } from "#build/types/layouts";
import { kebabCase } from "scule";

definePageMeta({
  layout: false,
});

const route = useRoute();
const { data: page } = await useAsyncData(`page${kebabCase(route.path)}`, () => {
  return queryCollection("docs").path(route.path).first();
});

useSeoMeta(page.value?.seo || {});
const { data: navigation } = useAsyncData(`docs-navigation`, () => {
  return queryCollectionNavigation("docs");
});

const { data: surround } = useAsyncData(`page${kebabCase(route.path)}-surround`, () => {
  return queryCollectionItemSurroundings("docs", route.path);
});

function getLayout(layout?: string | false): LayoutKey | false {
  if (layout === false || !layout || !layout.trim()) {
    return "docs";
  }

  if (layout === "default") {
    return "docs";
  }

  return layout as LayoutKey | false;
}
</script>

<template>
  <div>
    <NuxtLayout :name="getLayout(page?.layout)" :navigation>
      <UPage v-if="page">
        <UPageBody>
          <ContentRenderer v-if="page" :value="page" />

          <USeparator v-if="surround?.filter(Boolean).length" />

          <UContentSurround :surround="surround as any" />
        </UPageBody>

        <template v-if="page?.body?.toc?.links?.length" #right>
          <UContentToc :links="page.body.toc.links" />
        </template>
      </UPage>
    </NuxtLayout>
  </div>
</template>
