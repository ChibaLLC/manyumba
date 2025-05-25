<script setup lang="ts">
import { MapPinIcon } from "lucide-vue-next";

// You would typically integrate with a maps API here
// For example, using the Google Maps API or Mapbox
const useCurrentLocation = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				console.log("Current location:", latitude, longitude);
				// Here you would update the map with these coordinates
			},
			(error) => {
				console.error("Error getting location:", error);
			},
		);
	} else {
		console.error("Geolocation is not supported by this browser");
	}
};
</script>
<template>
	<main class="container mx-auto py-12 px-4">
		<div class="max-w-3xl mx-auto bg-gray-50 rounded-lg border border-border p-8">
			<h2 class="text-3xl font-bold mb-2">Location</h2>
			<p class="text-muted-foreground mb-1">
				Drop a pin to the precise location of the property. You can use your current location if you are on site
				(recommended).
			</p>
			<p class="text-muted-foreground mb-6">
				You can use the search to get the general area. Then reposition the pin.
			</p>

			<div class="flex flex-col md:flex-row gap-4 mb-6">
				<Button
					@click.prevent="useCurrentLocation()"
					class="bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer"
				>
					Use Current Location
				</Button>

				<div class="relative flex-1">
					<div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
						<MapPinIcon class="h-5 w-5 text-muted-foreground" />
					</div>
					<Input
						type="text"
						placeholder="Enter a city, town or location to start"
						class="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-white"
					/>
				</div>
			</div>

			<!-- Map Container -->
			<div class="w-full h-80 bg-gray-200 rounded-md mb-6 overflow-hidden">
				<img
					src="https://www.kpmindustries.com/wp-content/uploads/2018/08/Placeholder-Map-Image.png"
					alt="Map"
					class="w-full h-full object-cover"
				/>
			</div>

			<div class="flex justify-end">
				<NuxtLink
					to="/listing"
					class="border border-input bg-white hover:bg-muted px-6 py-2 rounded-md transition-colors"
				>
					Next
				</NuxtLink>
			</div>
		</div>
	</main>
</template>
