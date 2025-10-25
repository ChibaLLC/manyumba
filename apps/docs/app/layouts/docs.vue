<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
import { CONTENT_NAVIGATION_KEY, CONTENT_SURROUND_KEY } from "~/utils/content/navigation";
const navigation = ref<ContentNavigationItem[]>([]);
const saround = ref();
provide(CONTENT_NAVIGATION_KEY, navigation);
provide(CONTENT_SURROUND_KEY, saround);

const props = defineProps<{
  navigation?: ContentNavigationItem[];
  searchFiles?: any;
}>();

const docsNavigation = computed(() => {
  if (!props.navigation) {
    return navigation.value;
  }

  if (!navigation.value) {
    return props.navigation;
  }

  return props.navigation.concat(navigation.value);
});
const NAV_HEIGHT = "64px";
</script>
<template>
  <div class="m-auto">
    <Header />
    <UMain>
      <UContainer>
        <UPage>
          <template #left>
            <UPageAside>
              <UContentNavigation
                :navigation="docsNavigation.flatMap((i) => i.children) as ContentNavigationItem[]"
                highlight
                :defaultOpen="true"
                :ui="{ linkTrailingIcon: 'group-data-[state=open]:rotate-90' }"
                trailing-icon="i-lucide-chevron-right"
              />
            </UPageAside>
          </template>
          <slot>
            <div class="grid">
              <section class="m-auto grid grid-flow-row">
                <h1 class="text-center">404</h1>
                <p class="text-center">There's nothing here.</p>
                <div class="travolta"></div>
                <UButton to="/" class="mt-4 mx-auto"> Go Home </UButton>
              </section>
            </div>
          </slot>
        </UPage>
      </UContainer>
    </UMain>
  </div>
</template>
<style lang="css" scoped>
.nav-container {
  --height: v-bind(NAV_HEIGHT);
}

:deep(.nav) {
  height: var(--height);
}

.aside {
  min-height: calc(90vh - var(--height));
  max-height: 90vh;
  top: calc(var(--height) * 1.15);
  position: sticky;
}

.travolta {
  z-index: -1;
  width: 100vw;
  height: 100vh;
  opacity: 0.3;
  position: absolute;
  top: 0;
  left: 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: black;
  background-image: url("/gifs/404-bg-low.gif");
}

h1 {
  font-size: 775%;
  padding-top: 25vh;
  margin-bottom: 1vh;
  z-index: 2;
}

p {
  font-size: 125%;
}

a {
  text-decoration: none;
  color: white;
  z-index: 2;
}

a:hover {
  text-decoration: underline;
}
</style>
