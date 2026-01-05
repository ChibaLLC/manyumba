<template>
  <div class="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 animate-pulse">
    <!-- Image Skeleton -->
    <div class="h-48 w-full bg-gray-300"></div>
    
    <!-- Content Skeleton -->
    <div class="p-4 space-y-3">
      <!-- Title -->
      <div class="space-y-2">
        <div class="h-5 bg-gray-300 rounded w-3/4"></div>
        <div class="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
      
      <!-- Details -->
      <div class="flex space-x-4">
        <div class="h-4 bg-gray-300 rounded w-16"></div>
        <div class="h-4 bg-gray-300 rounded w-16"></div>
        <div class="h-4 bg-gray-300 rounded w-20"></div>
      </div>
      
      <!-- Badge -->
      <div class="h-6 bg-gray-300 rounded w-20"></div>
      
      <!-- Footer -->
      <div class="flex items-center justify-between pt-2">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div class="space-y-1">
            <div class="h-3 bg-gray-300 rounded w-16"></div>
            <div class="h-3 bg-gray-300 rounded w-12"></div>
          </div>
        </div>
        <div class="h-8 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for skeleton
</script>
