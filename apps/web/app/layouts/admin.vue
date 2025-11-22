<template>
  <UPage class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <UAside
      class="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white shadow-lg"
      collapsible
    >
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold text-gray-800">Manyumba Admin</h1>
      </div>

      <UNavigationMenu
        :links="navLinks"
        class="p-4"
        :active="route.path"
        orientation="vertical"
      />

      <div class="p-4 border-t mt-auto">
        <div class="flex items-center gap-3">
          <UAvatar size="sm" color="primary">
            <Icon name="bxs:user" class="w-4 h-4 text-white" />
          </UAvatar>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-800">Admin User</p>
            <p class="text-xs text-gray-500">Administrator</p>
          </div>
          <UButton
            color="secondary"
            variant="ghost"
            size="sm"
            @click="logout"
            icon="bxs:log-out"
          />
        </div>
      </div>
    </UAside>

    <!-- Main Content -->
    <UPageBody class="ml-64">
      <!-- Top Bar -->
      <header class="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-gray-800">{{ pageTitle }}</h2>
          <p class="text-sm text-gray-600 mt-1">{{ pageDescription }}</p>
        </div>

        <div class="flex items-center gap-4">
          <!-- Notifications -->
          <UButton
            color="secondary"
            variant="ghost"
            icon="bxs:bell"
            size="sm"
            class="relative"
          >
            <span
              class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
            ></span>
          </UButton>

          <!-- Add Property -->
          <UButton to="/listings/new" icon="bxs:plus" color="primary">
            Add Property
          </UButton>
        </div>
      </header>

      <!-- Page Slot -->
      <main class="p-6">
        <slot />
      </main>
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Layout meta
definePageMeta({ layout: false });

const route = useRoute();

// Sidebar navigation links
const navLinks = [
  {
    label: "Dashboard",
    icon: "bxs:dashboard",
    to: "/admin",
  },
  {
    label: "Properties",
    icon: "bxs:building-house",
    to: "/admin/properties",
  },
  {
    label: "Users",
    icon: "bxs:user",
    to: "/admin/users",
  },
  {
    label: "Appointments",
    icon: "bxs:calendar",
    to: "/admin/appointments",
  },
  {
    label: "Reviews",
    icon: "bxs:star",
    to: "/admin/reviews",
  },
  {
    label: "Messages",
    icon: "bxs:message",
    to: "/admin/messages",
  },
  {
    label: "Analytics",
    icon: "bxs:bar-chart-alt-2",
    to: "/admin/analytics",
  },
  {
    label: "Settings",
    icon: "bxs:cog",
    to: "/admin/settings",
  },
];

const pageTitle = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  return lastSegment ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) : "Dashboard";
});

const pageDescription = computed(() => {
  const descriptions: Record<string, string> = {
    admin: "Overview of your property management system",
    properties: "Manage all property listings",
    users: "Manage users and their permissions",
    appointments: "View and manage property viewings",
    reviews: "Moderate property reviews",
    messages: "Handle user communications",
    analytics: "View detailed analytics and reports",
    settings: "Configure system settings",
  };

  const segments = route.path.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1]!;
  return descriptions[lastSegment] || "Manage your property platform";
});

const isAuthenticated = ref(true);
const isAdmin = ref(true);

if (!isAuthenticated.value || !isAdmin.value) {
  // await navigateTo('/login');
}

function logout() {
  console.log("Logging out...");
  // await navigateTo('/login');
}
</script>
