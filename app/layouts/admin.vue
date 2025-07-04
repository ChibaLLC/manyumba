<template>
  <div class="min-h-screen bg-gray-50">
    <SidebarProvider>
      <Sidebar class="fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-lg">
        <SidebarContent>
          <SidebarHeader class="p-4 border-b">
            <h1 class="text-xl font-bold text-gray-800">Manyumba Admin</h1>
          </SidebarHeader>

          <div class="p-4">
            <SidebarMenu>
              <!-- Dashboard -->
              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <NuxtLink to="/admin" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                    <Icon name="bxs:dashboard" class="w-5 h-5 text-gray-600" />
                    <span>Dashboard</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <!-- Properties -->
              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <NuxtLink to="/admin/properties" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                    <Icon name="bxs:building-house" class="w-5 h-5 text-gray-600" />
                    <span>Properties</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <!-- Users -->
              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <NuxtLink to="/admin/users" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                    <Icon name="bxs:user" class="w-5 h-5 text-gray-600" />
                    <span>Users</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <!-- Appointments -->
              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <NuxtLink
                    to="/admin/appointments"
                    class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Icon name="bxs:calendar" class="w-5 h-5 text-gray-600" />
                    <span>Appointments</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <!-- Reviews -->
              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <NuxtLink to="/admin/reviews" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                    <Icon name="bxs:star" class="w-5 h-5 text-gray-600" />
                    <span>Reviews</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <!-- Messages -->
              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <NuxtLink to="/admin/messages" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                    <Icon name="bxs:message" class="w-5 h-5 text-gray-600" />
                    <span>Messages</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <!-- Analytics -->
              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <NuxtLink to="/admin/analytics" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                    <Icon name="bxs:bar-chart-alt-2" class="w-5 h-5 text-gray-600" />
                    <span>Analytics</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <!-- Settings -->
              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <NuxtLink to="/admin/settings" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                    <Icon name="bxs:cog" class="w-5 h-5 text-gray-600" />
                    <span>Settings</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>

          <SidebarFooter class="p-4 border-t">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <Icon name="bxs:user" class="w-4 h-4 text-white" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-800">Admin User</p>
                <p class="text-xs text-gray-500">Administrator</p>
              </div>
              <Button variant="ghost" size="sm" @click="logout">
                <Icon name="bxs:log-out" class="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div>
          <!-- Top Bar -->
          <header class="bg-white shadow-sm border-b px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-semibold text-gray-800">{{ pageTitle }}</h2>
                <p class="text-sm text-gray-600 mt-1">{{ pageDescription }}</p>
              </div>

              <div class="flex items-center space-x-4">
                <!-- Notifications -->
                <Button variant="ghost" size="sm" class="relative">
                  <Icon name="bxs:bell" class="w-5 h-5" />
                  <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                <!-- Quick Actions -->
                <Button as-child>
                  <NuxtLink to="/listings/new">
                    <Icon name="bxs:plus" class="w-4 h-4 mr-2" />
                    Add Property
                  </NuxtLink>
                </Button>
              </div>
            </div>
          </header>

          <!-- Page Content -->
          <main class="p-6">
            <slot />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
    <!-- Navigation Sidebar -->

    <!-- Main Content -->
  </div>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "~/components/ui/sidebar";

// Layout meta
definePageMeta({
  layout: false,
});

// Reactive page title
const route = useRoute();
const pageTitle = computed(() => {
  const pathSegments = route.path.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
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

  const pathSegments = route.path.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  return descriptions[lastSegment] || "Manage your property platform";
});

// Authentication check (you'll need to implement this)
const isAuthenticated = ref(true); // Mock authentication
const isAdmin = ref(true); // Mock admin check

// Redirect if not authenticated or not admin
if (!isAuthenticated.value || !isAdmin.value) {
  // await navigateTo('/login');
}

function logout() {
  // Implement logout logic
  console.log("Logging out...");
  // await navigateTo('/login');
}
</script>

<style scoped></style>
