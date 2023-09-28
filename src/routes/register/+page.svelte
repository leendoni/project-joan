<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(async () => {
		redirect();
	});

	function redirect() {
		goto('/register/student');
	}
</script>