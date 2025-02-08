<template>
	<div>
		<Title>Home</Title>
		<Button @click="cheers">Test</Button>
		<Toaster />
	</div>
</template>
<script setup lang="ts">
import Button from "~/components/ui/button/Button.vue";
import { useToast } from "~/components/ui/toast";
import Toaster from "~/components/ui/toast/Toaster.vue";
const { toast } = useToast();

function cheers() {
	toast({
		title: "Hello World",
		description: "A test notification",
	});
}
</script>
