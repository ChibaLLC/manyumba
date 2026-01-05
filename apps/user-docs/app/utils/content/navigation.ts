import type { ContentNavigationItem } from "@nuxt/content";
import type { InjectionKey } from "vue";

export const CONTENT_NAVIGATION_KEY = Symbol("CONTENT_NAVIGATION_KEY") as InjectionKey<Ref<ContentNavigationItem[]>>;
export const CONTENT_SURROUND_KEY = Symbol("CONTENT_SURROUND_KEY") as InjectionKey<Ref<any>>;
