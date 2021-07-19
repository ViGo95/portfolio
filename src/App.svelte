<script>
	export let mainColor

	import Main from './Main.svelte'
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
</script>

<main>
	<Header {mainColor}></Header>

	<Main {mainColor}></Main>

	<Footer {mainColor}></Footer>
</main>

<style global>
	main {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
	}

	@tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>