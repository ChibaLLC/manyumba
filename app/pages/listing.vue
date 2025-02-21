<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b">
      <div
        class="container mx-auto px-4 py-3 flex items-center justify-between"
      >
        <div class="flex items-center gap-8">
          <h1 class="text-xl font-semibold">Manyumba</h1>
          <nav class="hidden md:flex gap-4">
            <Button variant="ghost">Payments</Button>
            <Button variant="ghost">Properties</Button>
          </nav>
        </div>

        <div class="flex items-center gap-4">
          <Button variant="outline" class="hidden md:flex gap-2">
            <MapPin class="h-4 w-4" />
            Nairobi, Kenya
          </Button>
          <Button variant="outline" size="icon" class="rounded-full">
            <UserCircle class="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>

    <main class="container mx-auto p-4">
      <div class="grid lg:grid-cols-[1fr,1fr] gap-4">
        <!-- Listings Section -->
        <div>
          <!-- Filters -->
          <div class="flex flex-wrap gap-2 mb-4">
            <Select>
              <SelectTrigger class="w-[100px]">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low to High</SelectItem>
                <SelectItem value="high">High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger class="w-[100px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger class="w-[100px]">
                <SelectValue placeholder="Beds" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger class="w-[100px]">
                <SelectValue placeholder="Baths" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Property Cards -->
          <div class="grid md:grid-cols-2 gap-4">
            <div
              v-for="property in properties"
              :key="property.id"
              class="rounded-lg border bg-card"
            >
              <div class="relative">
                <img
                  :src="property.image"
                  :alt="property.title"
                  class="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge
                  :variant="property.type === 'rent' ? 'default' : 'secondary'"
                  class="absolute top-2 right-2"
                >
                  {{ property.type === "rent" ? "RENT" : "SALE" }}
                </Badge>
              </div>

              <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <p class="text-lg font-semibold">
                      KES {{ property.price.toLocaleString() }}
                    </p>
                    <p class="text-sm text-muted-foreground">
                      {{ property.location }}
                    </p>
                  </div>
                </div>

                <div class="flex gap-4 text-sm text-muted-foreground mb-4">
                  <span class="flex items-center gap-1">
                    <Bed class="h-4 w-4" />
                    {{ property.beds }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Bath class="h-4 w-4" />
                    {{ property.baths }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Square class="h-4 w-4" />
                    {{ property.area }} m²
                  </span>
                </div>

                <div class="flex justify-between items-center">
                  <Button variant="outline">View Listing</Button>
                  <Button variant="ghost" size="icon">
                    <Heart class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Map Section -->
        <div
          class="hidden lg:block h-[calc(100vh-6rem)] rounded-lg overflow-hidden"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15955.277444357772!2d36.8219462!3d-1.2920659!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1645451234567!5m2!1sen!2s"
            width="100%"
            height="100%"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

import { MapPin, UserCircle, Bed, Bath, Square, Heart } from "lucide-vue-next";

const properties = ref([
  {
    id: 1,
    title: "Modern House",
    price: 50000,
    location: "Nairobi - Kinoo, Rungiri",
    beds: 2,
    baths: 2,
    area: 500,
    type: "rent",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20From%202025-02-21%2003-15-47-rMuZI5ETuSFFDTqCKva6NO4Ma0ZSBs.png",
  },
  {
    id: 2,
    title: "Luxury Villa",
    price: 5000000,
    location: "Nairobi - Kinoo, Rungiri",
    beds: 2,
    baths: 2,
    area: 500,
    type: "sale",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20From%202025-02-21%2003-15-47-rMuZI5ETuSFFDTqCKva6NO4Ma0ZSBs.png",
  },
  // Add more properties as needed
]);
</script>

<style>
/* Add any custom styles here */
</style>
