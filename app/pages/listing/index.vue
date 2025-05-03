<script setup lang="ts">
import {
	MapPinIcon,
	PencilIcon,
	CircleDollarSignIcon,
	HomeIcon,
	BedIcon,
	ShowerHeadIcon,
	SlidersHorizontalIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronDownIcon,
	HeartIcon,
	SquareIcon,
} from "lucide-vue-next";
import { ref } from "vue";

// Define property data
const properties = [
	{
		id: 1,
		price: 50000,
		type: "RENT",
		beds: 2,
		baths: 2,
		area: 500,
		location: "Nairobi - Kinoo, Rungiri",
		images: ["/placeholder.svg?height=200&width=300"],
	},
	{
		id: 2,
		price: 5000000,
		type: "SALE",
		beds: 2,
		baths: 2,
		area: 500,
		location: "Nairobi - Kinoo, Rungiri",
		images: ["/placeholder.svg?height=200&width=300"],
	},
	{
		id: 3,
		price: 50000,
		type: "RENT",
		beds: 2,
		baths: 2,
		area: 500,
		location: "Nairobi - Kinoo, Rungiri",
		images: ["/placeholder.svg?height=200&width=300"],
	},
	{
		id: 4,
		price: 50000,
		type: "RENT",
		beds: 2,
		baths: 2,
		area: 500,
		location: "Nairobi - Kinoo, Rungiri",
		images: ["/placeholder.svg?height=200&width=300"],
	},
];

// Format price with commas
const formatPrice = (price: number): string => {
	return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Toggle favorite
const favorites = ref<Set<number>>(new Set());
const toggleFavorite = (id: number) => {
	if (favorites.value.has(id)) {
		favorites.value.delete(id);
	} else {
		favorites.value.add(id);
	}
};
</script>
<template>
	<!-- Main Content -->
	<main class="container mx-auto py-6 px-4">
		<div class="flex flex-col lg:flex-row gap-6">
			<!-- Left Column - Filters and Listings -->
			<div class="w-full lg:w-1/2">
				<!-- Filters -->
				<div class="flex flex-wrap gap-2 mb-6">
					<div class="bg-muted rounded-md flex items-center px-4 py-2">
						<CircleDollarSignIcon class="h-4 w-4 mr-2" />
						<span>Price</span>
						<ChevronDownIcon class="h-4 w-4 ml-2" />
					</div>

					<div class="bg-muted rounded-md flex items-center px-4 py-2">
						<HomeIcon class="h-4 w-4 mr-2" />
						<span>Type</span>
						<ChevronDownIcon class="h-4 w-4 ml-2" />
					</div>

					<div class="bg-muted rounded-md flex items-center px-4 py-2">
						<BedIcon class="h-4 w-4 mr-2" />
						<span>Beds</span>
						<ChevronDownIcon class="h-4 w-4 ml-2" />
					</div>

					<div class="bg-muted rounded-md flex items-center px-4 py-2">
						<ShowerHeadIcon class="h-4 w-4 mr-2" />
						<span>Baths</span>
						<ChevronDownIcon class="h-4 w-4 ml-2" />
					</div>

					<div class="bg-muted rounded-md flex items-center px-4 py-2">
						<SlidersHorizontalIcon class="h-4 w-4" />
					</div>
				</div>

				<!-- Property Listings -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Property Card 1 -->
					<div class="bg-white border border-border rounded-md overflow-hidden">
						<div class="relative">
							<img
								src="https://www.kpmindustries.com/wp-content/uploads/2018/08/Placeholder-Map-Image.png"
								alt="Property"
								class="w-full h-48 object-cover"
							/>
							<div class="absolute top-0 left-0 right-0 flex justify-between p-2">
								<button class="bg-white rounded-full p-1 shadow-sm">
									<ChevronLeftIcon class="h-5 w-5" />
								</button>
								<button class="bg-white rounded-full p-1 shadow-sm">
									<ChevronRightIcon class="h-5 w-5" />
								</button>
							</div>
						</div>

						<div class="p-4">
							<div class="flex justify-between items-start mb-2">
								<div>
									<span class="text-muted-foreground text-sm">KES</span>
									<span class="font-bold text-lg">50,000</span>
								</div>
								<div class="bg-gray-200 px-2 py-0.5 rounded text-xs font-medium">RENT</div>
							</div>

							<div class="flex gap-4 mb-3">
								<div class="flex items-center">
									<BedIcon class="h-4 w-4 mr-1 text-muted-foreground" />
									<span class="text-sm">2 bds</span>
								</div>
								<div class="flex items-center">
									<ShowerHeadIcon class="h-4 w-4 mr-1 text-muted-foreground" />
									<span class="text-sm">2 ba</span>
								</div>
								<div class="flex items-center">
									<SquareIcon class="h-4 w-4 mr-1 text-muted-foreground" />
									<span class="text-sm">500 m²</span>
								</div>
							</div>

							<div class="flex items-center mb-4">
								<MapPinIcon class="h-4 w-4 mr-1 text-muted-foreground" />
								<span class="text-sm text-muted-foreground">Nairobi - Kinoo, Rungiri</span>
							</div>

							<div class="flex justify-between">
								<NuxtLink
									to="/listing/1"
									class="bg-muted hover:bg-muted/80 px-4 py-2 rounded-md text-sm w-3/4 text-center"
								>
									View Listing
								</NuxtLink>
								<button class="border border-muted rounded-md p-2">
									<HeartIcon class="h-5 w-5 text-muted-foreground" />
								</button>
							</div>
						</div>
					</div>

					<!-- Property Card 2 -->
					<div class="bg-white border border-border rounded-md overflow-hidden">
						<div class="relative">
							<img
								src="https://www.kpmindustries.com/wp-content/uploads/2018/08/Placeholder-Map-Image.png"
								alt="Property"
								class="w-full h-48 object-cover"
							/>
							<div class="absolute top-0 left-0 right-0 flex justify-between p-2">
								<button class="bg-white rounded-full p-1 shadow-sm">
									<ChevronLeftIcon class="h-5 w-5" />
								</button>
								<button class="bg-white rounded-full p-1 shadow-sm">
									<ChevronRightIcon class="h-5 w-5" />
								</button>
							</div>
						</div>

						<div class="p-4">
							<div class="flex justify-between items-start mb-2">
								<div>
									<span class="text-muted-foreground text-sm">KES</span>
									<span class="font-bold text-lg">5,000,000</span>
								</div>
								<div class="bg-gray-200 px-2 py-0.5 rounded text-xs font-medium">SALE</div>
							</div>

							<div class="flex gap-4 mb-3">
								<div class="flex items-center">
									<BedIcon class="h-4 w-4 mr-1 text-muted-foreground" />
									<span class="text-sm">2 bds</span>
								</div>
								<div class="flex items-center">
									<ShowerHeadIcon class="h-4 w-4 mr-1 text-muted-foreground" />
									<span class="text-sm">2 ba</span>
								</div>
								<div class="flex items-center">
									<SquareIcon class="h-4 w-4 mr-1 text-muted-foreground" />
									<span class="text-sm">500 m²</span>
								</div>
							</div>

							<div class="flex items-center mb-4">
								<MapPinIcon class="h-4 w-4 mr-1 text-muted-foreground" />
								<span class="text-sm text-muted-foreground">Nairobi - Kinoo, Rungiri</span>
							</div>

							<div class="flex justify-between">
								<button class="bg-muted hover:bg-muted/80 px-4 py-2 rounded-md text-sm w-3/4">
									View Listing
								</button>
								<button class="border border-muted rounded-md p-2">
									<HeartIcon class="h-5 w-5 text-muted-foreground" />
								</button>
							</div>
						</div>
					</div>

					<!-- Property Card 3 -->
					<div class="bg-white border border-border rounded-md overflow-hidden">
						<div class="relative">
							<img
								src="https://www.kpmindustries.com/wp-content/uploads/2018/08/Placeholder-Map-Image.png"
								alt="Property"
								class="w-full h-48 object-cover"
							/>
							<div class="absolute top-0 left-0 right-0 flex justify-between p-2">
								<button class="bg-white rounded-full p-1 shadow-sm">
									<ChevronLeftIcon class="h-5 w-5" />
								</button>
								<button class="bg-white rounded-full p-1 shadow-sm">
									<ChevronRightIcon class="h-5 w-5" />
								</button>
							</div>
						</div>

						<div class="p-4">
							<div class="flex justify-between items-start mb-2">
								<div>
									<span class="text-muted-foreground text-sm">KES</span>
									<span class="font-bold text-lg">50,000</span>
								</div>
								<div class="bg-gray-200 px-2 py-0.5 rounded text-xs font-medium">RENT</div>
							</div>

							<div class="flex gap-4 mb-3">
								<div class="flex items-center">
									<BedIcon class="h-4 w-4 mr-1 text-muted-foreground" />
									<span class="text-sm">2 bds</span>
								</div>
								<div class="flex items-center">
									<ShowerHeadIcon class="h-4 w-4 mr-1 text-muted-foreground" />
									<span class="text-sm">2 ba</span>
								</div>
								<div class="flex items-center">
									<SquareIcon class="h-4 w-4 mr-1 text-muted-foreground" />
									<span class="text-sm">500 m²</span>
								</div>
							</div>

							<div class="flex items-center mb-4">
								<MapPinIcon class="h-4 w-4 mr-1 text-muted-foreground" />
								<span class="text-sm text-muted-foreground">Nairobi - Kinoo, Rungiri</span>
							</div>

							<div class="flex justify-between">
								<button class="bg-muted hover:bg-muted/80 px-4 py-2 rounded-md text-sm w-3/4">
									View Listing
								</button>
								<button class="border border-muted rounded-md p-2">
									<HeartIcon class="h-5 w-5 text-muted-foreground" />
								</button>
							</div>
						</div>
					</div>

					<!-- Property Card 4 -->
					<div class="bg-white border border-border rounded-md overflow-hidden">
						<div class="relative">
							<img
								src="https://www.kpmindustries.com/wp-content/uploads/2018/08/Placeholder-Map-Image.png"
								alt="Property"
								class="w-full h-48 object-cover"
							/>
							<div class="absolute top-0 left-0 right-0 flex justify-between p-2">
								<button class="bg-white rounded-full p-1 shadow-sm">
									<ChevronLeftIcon class="h-5 w-5" />
								</button>
								<button class="bg-white rounded-full p-1 shadow-sm">
									<ChevronRightIcon class="h-5 w-5" />
								</button>
							</div>
						</div>

						<div class="p-4">
							<div class="flex justify-between items-start mb-2">
								<div>
									<span class="text-muted-foreground text-sm">KES</span>
									<span class="font-bold text-lg">50,000</span>
								</div>
								<div class="bg-gray-200 px-2 py-0.5 rounded text-xs font-medium">RENT</div>
							</div>

							<div class="flex gap-4 mb-3">
								<div class="flex items-center">
									<BedIcon class="h-4 w-4 mr-1 text-muted-foreground" />
									<span class="text-sm">2 bds</span>
								</div>
								<div class="flex items-center">
									<ShowerHeadIcon class="h-4 w-4 mr-1 text-muted-foreground" />
									<span class="text-sm">2 ba</span>
								</div>
								<div class="flex items-center">
									<SquareIcon class="h-4 w-4 mr-1 text-muted-foreground" />
									<span class="text-sm">500 m²</span>
								</div>
							</div>

							<div class="flex items-center mb-4">
								<MapPinIcon class="h-4 w-4 mr-1 text-muted-foreground" />
								<span class="text-sm text-muted-foreground">Nairobi - Kinoo, Rungiri</span>
							</div>

							<div class="flex justify-between">
								<button class="bg-muted hover:bg-muted/80 px-4 py-2 rounded-md text-sm w-3/4">
									View Listing
								</button>
								<button class="border border-muted rounded-md p-2">
									<HeartIcon class="h-5 w-5 text-muted-foreground" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Column - Map -->
			<div class="w-full lg:w-1/2 h-[600px] bg-muted rounded-md overflow-hidden">
				<!-- Map placeholder - In a real app, you would integrate with a maps API -->
				<img
					src="https://www.kpmindustries.com/wp-content/uploads/2018/08/Placeholder-Map-Image.png"
					alt="Map"
					class="w-full h-full object-cover"
				/>
			</div>
		</div>
	</main>
</template>
