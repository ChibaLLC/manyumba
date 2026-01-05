<script setup lang="ts">
import { kebabCase } from "scule";
import { copyToClipboard } from "~/utils";

definePageMeta({
  layout: false,
});

const route = useRoute();
const { data: page } = await useAsyncData(`page${kebabCase(route.path)}`, () => {
  return queryCollection("blog").path(route.path).first();
});

useSeoMeta(page.value?.seo || {});
const { data: navigation } = useAsyncData(`blog-navigation`, () => {
  return queryCollectionNavigation("blog");
});

const { data: surround } = useAsyncData(`page${kebabCase(route.path)}-surround`, () => {
  return queryCollectionItemSurroundings("blog", route.path);
});

const articleLink = computed(() => `${window.location}${route.path}`);
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<template>
  <UPage v-if="page" class="mt-20 px-2">
    <UContainer class="flex flex-col items-center gap-3 mt-8">
      <div class="flex items-center gap-2">
        <ULink to="/blog" class="text-sm"> Blog </ULink>
        <span class="text-sm">/</span>
        <span class="text-sm">
          {{ page.word }}
        </span>
      </div>
      <NuxtImg :src="page.image" :alt="page.title" class="rounded-lg w-full h-[250px] object-cover object-center" />
      <div class="flex text-xs text-muted items-center justify-center gap-2">
        <span>
          {{ formatDate(page.date) }}
        </span>
        -
        <span> {{ page.minRead }} MIN READ </span>
      </div>
      <h1 class="text-4xl main-gradient text-center max-w-3xl mx-auto">
        {{ page.title }}
      </h1>
      <p class="text-muted text-center max-w-2xl mx-auto">
        {{ page.description }}
      </p>
      <div class="flex items-center justify-center gap-2 mt-2">
        <UUser
          v-for="(author, index) in page.authors"
          :key="index"
          orientation="vertical"
          color="neutral"
          variant="outline"
          class="justify-center items-center text-center"
          v-bind="author"
        />
      </div>
    </UContainer>
    <UPageBody class="max-w-3xl mx-auto">
      <Divider class="mt-4" />
      <ContentRenderer v-if="page.body" :value="page" />

      <Divider class="my-10">
        <div class="flex items-center gap-2 text-sm text-muted">
          <UButton
            size="sm"
            variant="link"
            color="neutral"
            label="Copy link"
            @click="copyToClipboard(articleLink, 'Article link copied to clipboard')"
          />
        </div>
      </Divider>
      <Surround :surround="surround as any" />
    </UPageBody>
  </UPage>
</template>
