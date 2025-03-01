<template>
	<ListingContainer class="flex flex-col">
		<div>
			<h1>Location</h1>
			<p>
				Drop a pin to the precise location of the property. You can use your current location if you are on site
				(recommended).
			</p>
			<p>You can use the search to get the general area. Then reposition the pin.</p>
		</div>
		<div class="flex flex-col">
			<Button>Use Current Location</Button>
			<Input>
				<Icon name="local:location" />
			</Input>
		</div>
		<Map />
		<Button class="self-end"></Button>
	</ListingContainer>
</template>
