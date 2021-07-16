<script>
	export let mainColor

	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
</script>

<main>
	<Header {mainColor}></Header>



	<Footer {mainColor}></Footer>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
	}
</style>