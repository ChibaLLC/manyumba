<script setup lang="ts">
// Scroll to top function
const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
};

// Virtual tour modal
const showVirtualTour = ref(false);
const toggleVirtualTour = () => {
	showVirtualTour.value = !showVirtualTour.value;
};

// Image gallery
const currentImageIndex = ref(0);
const images = [
	"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80",
	"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
	"https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
	"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
	"https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
];

// Property saved state
const isSaved = ref(false);
const toggleSave = () => {
	isSaved.value = !isSaved.value;
};

// Property data
const property = {
	id: 1,
	title: "Modern Family Home",
	price: 1500000,
	currency: "KES",
	location: "Nairobi - Kinoo, Rungiri",
	beds: 3,
	baths: 2,
	area: 100,
	built: 2003,
	garage: 2,
	hoa: 5000,
};
</script>
<template>
	<div>
		<main class="container mx-auto py-6 px-4">
			<!-- Image Gallery -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
				<div class="md:col-span-2 relative group rounded-lg overflow-hidden">
					<img
						src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80"
						alt="Modern house exterior"
						class="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					></div>
				</div>

				<div class="grid grid-cols-2 gap-2">
					<div class="relative group rounded-lg overflow-hidden">
						<img
							src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80"
							alt="Living room"
							class="w-full h-[196px] object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					</div>
					<div class="relative group rounded-lg overflow-hidden">
						<img
							src="https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
							alt="Kitchen"
							class="w-full h-[196px] object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					</div>
					<div class="relative group rounded-lg overflow-hidden">
						<img
							src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
							alt="Backyard"
							class="w-full h-[196px] object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					</div>
					<div class="relative group rounded-lg overflow-hidden">
						<img
							src="https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
							alt="Bedroom"
							class="w-full h-[196px] object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div
							class="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/60 transition-colors"
						>
							<span class="text-white text-sm font-medium">See all 11 photos</span>
							<Icon name="ph:grid-four" class="h-4 w-4 text-white ml-2" />
						</div>
					</div>
				</div>
			</div>

			<!-- Property Details -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div class="lg:col-span-2">
					<!-- Main Details -->
					<div class="mb-8">
						<h2 class="text-2xl font-bold mb-1">KES 1,500,000</h2>
						<div class="flex items-center mb-4">
							<Icon name="ph:map-pin" class="h-5 w-5 text-muted-foreground mr-2" />
							<span class="text-muted-foreground">Nairobi - Kinoo, Rungiri</span>
						</div>

						<div class="flex items-center mb-6">
							<button
								class="flex items-center gap-2 bg-muted hover:bg-muted/80 px-4 py-2 rounded-md text-sm transition-colors"
							>
								<Icon name="ph:calendar" class="h-4 w-4" />
								<span>Schedule Tour</span>
								<img
									src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3_hdpi.png"
									alt="Google Maps"
									class="h-5 ml-1"
								/>
							</button>
						</div>

						<div class="grid grid-cols-3 gap-4 mb-6">
							<div class="text-center">
								<div class="text-xl font-bold">3</div>
								<div class="text-sm text-muted-foreground">bds</div>
							</div>
							<div class="text-center">
								<div class="text-xl font-bold">2</div>
								<div class="text-sm text-muted-foreground">bts</div>
							</div>
							<div class="text-center">
								<div class="text-xl font-bold">100</div>
								<div class="text-sm text-muted-foreground">m²</div>
							</div>
						</div>

						<div class="flex flex-col gap-2 mb-8">
							<button
								class="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-md font-medium transition-colors"
							>
								Apply for lease
							</button>
							<button
								class="w-full bg-white border border-input hover:bg-muted py-3 rounded-md font-medium transition-colors"
							>
								Contact realtor
							</button>
						</div>

						<!-- Property Features -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
							<div class="flex items-center gap-3">
								<Icon name="ph:house" class="h-5 w-5 text-muted-foreground" />
								<span>Single Family Home</span>
							</div>
							<div class="flex items-center gap-3">
								<Icon name="ph:calendar" class="h-5 w-5 text-muted-foreground" />
								<span>Built in 2003</span>
							</div>
							<div class="flex items-center gap-3">
								<Icon name="ph:ruler" class="h-5 w-5 text-muted-foreground" />
								<span>100 square metres</span>
							</div>
							<div class="flex items-center gap-3">
								<Icon name="ph:car" class="h-5 w-5 text-muted-foreground" />
								<span>2 car garage</span>
							</div>
							<div class="flex items-center gap-3">
								<Icon name="ph:currency-circle-dollar" class="h-5 w-5 text-muted-foreground" />
								<span>KES 5,000 HOA</span>
							</div>
						</div>

						<!-- Map -->
						<div class="mb-8 rounded-lg overflow-hidden border border-border">
							<img
								src="https://maps.googleapis.com/maps/api/staticmap?center=Kinoo,Rungiri,Nairobi&zoom=14&size=800x400&maptype=roadmap&markers=color:red%7CKinoo,Rungiri,Nairobi&key=YOUR_API_KEY"
								alt="Map"
								class="w-full h-[400px] object-cover"
							/>
							<div class="bg-white p-2 flex justify-end">
								<div
									class="flex items-center gap-2 bg-muted hover:bg-muted/80 px-3 py-1.5 rounded text-sm transition-colors cursor-pointer"
								>
									<Icon name="ph:school" class="h-4 w-4" />
									<span>Schools</span>
									<Icon name="ph:caret-down" class="h-4 w-4" />
								</div>
							</div>
						</div>

						<!-- About -->
						<div class="mb-8">
							<h3 class="text-xl font-bold mb-4">About</h3>
							<p class="text-muted-foreground mb-4">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam commodo risus ut magna
								pharetra, eu ultricies justo placerat. Suspendisse potenti. Aenean feugiat, diam at
								lacinia facilisis, dolor arcu laoreet dolor, vehicula mattis lectus est in erat. Nunc
								sit amet nulla vitae dui commodo vulputate quam et augue. Donec et turpis lacinia,
								dapibus lacus ac, ornare diam. Nulla pharetra magna ac urna blandit, id tristique nunc
								tempus. Pellentesque id felis euismod. Primus eros ante, rutrum nec risus nisi
								venenatis.
							</p>
							<p class="text-muted-foreground">
								Fusce cursus efficitur quam sed bibendum. Nullam fringilla aliquam quam. Nulla at
								posuere arcu. Etiam nec sapien et ipsum venenatis finibus in ut lorem.
							</p>
						</div>

						<!-- Facts & Features -->
						<div class="mb-8">
							<h3 class="text-xl font-bold mb-4">Facts & features</h3>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
								<!-- Interior -->
								<div>
									<h4 class="font-bold mb-2">Interior</h4>

									<div class="mb-4">
										<h5 class="text-sm font-medium mb-2">Rooms</h5>
										<ul class="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
											<li>Bedrooms: 3</li>
											<li>Bathrooms: 2</li>
											<li>Kitchen: 1</li>
											<li>Basement</li>
											<li>Attic</li>
										</ul>
									</div>

									<div>
										<h5 class="text-sm font-medium mb-2">Utilities</h5>
										<ul class="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
											<li>Electricity: KPLC, Token, Solar</li>
											<li>Sewer: Public Sewer, On Premises</li>
											<li>Water: Public, Borehole</li>
											<li>Internet: Fiber, Safaricom, KES/mo monthly</li>
											<li>TV: Cable (Free)</li>
										</ul>
									</div>
								</div>

								<!-- Features -->
								<div>
									<h4 class="font-bold mb-2">Features</h4>

									<div class="mb-4">
										<ul class="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
											<li>Flooring: Carpet, Tile, Vinyl, Wood</li>
											<li>Windows: Double Pane Windows</li>
										</ul>
									</div>

									<div class="mb-4">
										<h5 class="text-sm font-medium mb-2">Appliances</h5>
										<ul class="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
											<li>Refrigerator</li>
											<li>Dish Washer</li>
											<li>Dryer</li>
											<li>Hot Water Heater</li>
											<li>Oven</li>
											<li>HVAC</li>
										</ul>
									</div>
								</div>
							</div>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
								<!-- Property -->
								<div>
									<h4 class="font-bold mb-2">Property</h4>

									<div class="mb-4">
										<h5 class="text-sm font-medium mb-2">Parking</h5>
										<ul class="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
											<li>Garage (Attached): 2 space</li>
										</ul>
									</div>

									<div>
										<h5 class="text-sm font-medium mb-2">Construction</h5>
										<ul class="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
											<li>Materials:</li>
											<li class="ml-4">Frame: Steel and Concrete</li>
											<li class="ml-4">Roof: Slate</li>
											<li class="ml-4">Walls: Concrete</li>
											<li>Year Built</li>
											<li class="ml-4">2003</li>
										</ul>
									</div>
								</div>

								<!-- Yard -->
								<div>
									<h4 class="font-bold mb-2">Yard</h4>
									<ul class="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
										<li>Balcony: 1</li>
										<li>Porch/Patio</li>
										<li>Back Yard</li>
										<li>Front Yard</li>
									</ul>

									<div class="mt-4">
										<h5 class="text-sm font-medium mb-2">Community</h5>
										<ul class="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
											<li>Gated Community</li>
											<li>HOA: Yes (KES/mo monthly)</li>
										</ul>
									</div>
								</div>
							</div>
						</div>

						<!-- Price History -->
						<div>
							<h3 class="text-xl font-bold mb-4">Price History</h3>

							<div class="flex items-center gap-4 mb-4 border-b border-border pb-4">
								<button class="px-3 py-1 text-sm rounded-full bg-primary text-primary-foreground">
									Studio
								</button>
								<button class="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground">
									1 bed
								</button>
								<button class="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground">
									2 bed
								</button>
								<button class="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground">
									3 bed
								</button>
								<button class="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground">
									4+ bed
								</button>

								<div class="ml-auto flex items-center gap-2 text-sm text-primary">
									<Icon name="ph:list-bullets" class="h-4 w-4" />
									<span>Show as List</span>
								</div>
							</div>

							<div class="h-[200px] relative mb-4">
								<!-- Price chart - In a real app, you would use a charting library -->
								<div class="absolute inset-0">
									<svg viewBox="0 0 500 200" class="w-full h-full">
										<defs>
											<linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
												<stop offset="0%" stop-color="rgb(147, 51, 234)" stop-opacity="0.5" />
												<stop offset="100%" stop-color="rgb(147, 51, 234)" stop-opacity="0" />
											</linearGradient>
										</defs>
										<path
											d="M0,50 L100,30 L200,70 L300,10 L400,40 L500,20"
											fill="none"
											stroke="rgb(147, 51, 234)"
											stroke-width="3"
										/>
										<path
											d="M0,50 L100,30 L200,70 L300,10 L400,40 L500,20 L500,200 L0,200 Z"
											fill="url(#gradient)"
										/>
									</svg>
								</div>

								<!-- Y-axis labels -->
								<div
									class="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground py-2"
								>
									<div>€1,500</div>
									<div>€1,450</div>
									<div>€1,400</div>
									<div>€1,350</div>
									<div>€1,300</div>
									<div>€1,250</div>
								</div>
							</div>

							<!-- X-axis labels -->
							<div class="flex justify-between text-xs text-muted-foreground px-10">
								<div class="text-center">
									<div>Aug</div>
									<div>2024</div>
								</div>
								<div class="text-center">
									<div>Sep</div>
									<div>2024</div>
								</div>
								<div class="text-center">
									<div>Oct</div>
									<div>2024</div>
								</div>
								<div class="text-center">
									<div>Nov</div>
									<div>2024</div>
								</div>
								<div class="text-center">
									<div>Dec</div>
									<div>2024</div>
								</div>
								<div class="text-center">
									<div>Jan</div>
									<div>2025</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Amenities Sidebar -->
				<div class="lg:col-span-1">
					<div class="sticky top-24">
						<div class="bg-muted/30 rounded-lg p-6 border border-border mb-6">
							<h3 class="text-xl font-bold mb-4">Amenities</h3>
							<ul class="space-y-2">
								<li class="flex items-center gap-2">
									<Icon name="ph:check-circle-fill" class="h-5 w-5 text-emerald-500" />
									<span>Dishwasher</span>
								</li>
								<li class="flex items-center gap-2">
									<Icon name="ph:check-circle-fill" class="h-5 w-5 text-emerald-500" />
									<span>Tiled Floors</span>
								</li>
								<li class="flex items-center gap-2">
									<Icon name="ph:check-circle-fill" class="h-5 w-5 text-emerald-500" />
									<span>Bath Tubs</span>
								</li>
								<li class="flex items-center gap-2">
									<Icon name="ph:check-circle-fill" class="h-5 w-5 text-emerald-500" />
									<span>Air Conditioning</span>
								</li>
								<li class="flex items-center gap-2">
									<Icon name="ph:check-circle-fill" class="h-5 w-5 text-emerald-500" />
									<span>Swimming Pool</span>
								</li>
								<li class="flex items-center gap-2">
									<Icon name="ph:check-circle-fill" class="h-5 w-5 text-emerald-500" />
									<span>Garden</span>
								</li>
								<li class="flex items-center gap-2">
									<Icon name="ph:check-circle-fill" class="h-5 w-5 text-emerald-500" />
									<span>Security System</span>
								</li>
							</ul>
						</div>

						<div class="bg-muted/30 rounded-lg p-6 border border-border">
							<h3 class="text-lg font-bold mb-4">Contact Agent</h3>
							<div class="flex items-center gap-4 mb-4">
								<div class="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
									<Icon name="ph:user" class="h-6 w-6 text-primary" />
								</div>
								<div>
									<div class="font-medium">Jane Doe</div>
									<div class="text-sm text-muted-foreground">Premium Agent</div>
								</div>
							</div>

							<div class="space-y-3">
								<button
									class="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
								>
									<Icon name="ph:phone" class="h-4 w-4" />
									<span>Call</span>
								</button>
								<button
									class="w-full bg-white border border-input hover:bg-muted py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
								>
									<Icon name="ph:chat-text" class="h-4 w-4" />
									<span>Chat</span>
								</button>
								<button
									class="w-full bg-white border border-input hover:bg-muted py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
								>
									<Icon name="ph:envelope-simple" class="h-4 w-4" />
									<span>Email</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
		<!-- Footer -->
		<footer class="bg-muted/30 border-t border-border py-8 mt-12">
			<div class="container mx-auto px-4">
				<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<h4 class="font-bold mb-4">Manyumba</h4>
						<p class="text-sm text-muted-foreground">
							The premier real estate platform in Kenya, connecting buyers, sellers, and renters with the
							perfect properties.
						</p>
					</div>

					<div>
						<h4 class="font-bold mb-4">Quick Links</h4>
						<ul class="space-y-2 text-sm">
							<li>
								<a href="#" class="text-muted-foreground hover:text-foreground transition-colors"
									>Home</a
								>
							</li>
							<li>
								<a href="#" class="text-muted-foreground hover:text-foreground transition-colors"
									>Properties</a
								>
							</li>
							<li>
								<a href="#" class="text-muted-foreground hover:text-foreground transition-colors"
									>Agents</a
								>
							</li>
							<li>
								<a href="#" class="text-muted-foreground hover:text-foreground transition-colors"
									>Blog</a
								>
							</li>
						</ul>
					</div>

					<div>
						<h4 class="font-bold mb-4">Contact</h4>
						<ul class="space-y-2 text-sm">
							<li class="flex items-center gap-2 text-muted-foreground">
								<Icon name="ph:map-pin" class="h-4 w-4" />
								<span>Nairobi, Kenya</span>
							</li>
							<li class="flex items-center gap-2 text-muted-foreground">
								<Icon name="ph:phone" class="h-4 w-4" />
								<span>+254 123 456 789</span>
							</li>
							<li class="flex items-center gap-2 text-muted-foreground">
								<Icon name="ph:envelope-simple" class="h-4 w-4" />
								<span>info@manyumba.co.ke</span>
							</li>
						</ul>
					</div>

					<div>
						<h4 class="font-bold mb-4">Follow Us</h4>
						<div class="flex gap-4">
							<a
								href="#"
								class="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
							>
								<Icon name="ph:facebook-logo" class="h-5 w-5" />
							</a>
							<a
								href="#"
								class="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
							>
								<Icon name="ph:twitter-logo" class="h-5 w-5" />
							</a>
							<a
								href="#"
								class="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
							>
								<Icon name="ph:instagram-logo" class="h-5 w-5" />
							</a>
							<a
								href="#"
								class="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
							>
								<Icon name="ph:linkedin-logo" class="h-5 w-5" />
							</a>
						</div>

						<div class="mt-6">
							<h4 class="font-bold mb-2">Download Our App</h4>
							<div class="flex gap-2">
								<a
									href="#"
									class="bg-black text-white px-3 py-2 rounded-md flex items-center gap-2 hover:bg-black/80 transition-colors"
								>
									<Icon name="ph:apple-logo" class="h-5 w-5" />
									<div class="text-xs">
										<div class="text-[10px]">Download on the</div>
										<div>App Store</div>
									</div>
								</a>
								<a
									href="#"
									class="bg-black text-white px-3 py-2 rounded-md flex items-center gap-2 hover:bg-black/80 transition-colors"
								>
									<Icon name="ph:google-play-logo" class="h-5 w-5" />
									<div class="text-xs">
										<div class="text-[10px]">Get it on</div>
										<div>Google Play</div>
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>

				<div class="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
					<p>© 2024 Manyumba. All rights reserved.</p>
				</div>
			</div>
		</footer>

		<!-- Floating Action Buttons -->
		<div class="fixed bottom-6 right-6 flex flex-col gap-3">
			<button
				class="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
			>
				<Icon name="ph:chat-text-fill" class="h-6 w-6" />
			</button>
			<button
				class="h-12 w-12 rounded-full bg-white border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
				@click="scrollToTop"
			>
				<Icon name="ph:arrow-up" class="h-6 w-6" />
			</button>
		</div>
	</div>
</template>
<style scoped>
/* Add any custom styles here if needed */
.image-gallery-transition {
	transition: transform 0.3s ease-in-out;
}

/* Add smooth scrolling to the whole page */
html {
	scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
	width: 8px;
}

::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 10px;
}

::-webkit-scrollbar-thumb {
	background: #888;
	border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
	background: #555;
}
</style>
