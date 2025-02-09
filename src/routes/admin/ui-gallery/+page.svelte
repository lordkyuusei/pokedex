<script lang="ts">
	import Book from "$lib/components/fragments/Book.svelte";

</script>

<section id="ui-gallery">
	<Book id={196} landscape={false} name="Mentali" types={['psychic']}></Book>
	<Book id={196} landscape={false} name="Mentalili" types={['psychic']}></Book>
	<Book id={196} landscape={false} name="Mentalilili" types={['psychic']}></Book>
	<Book id={196} landscape={false} name="Mentalililili" types={['psychic']}></Book>
	<Book id={196} landscape={false} name="Mentalilililili" types={['psychic']}></Book>
	<Book id={470} landscape={true} name="Phyllali" types={['grass']}></Book>
	<Book id={470} landscape={true} name="Phyllalili" types={['grass']}></Book>
	<Book id={470} landscape={true} name="Phyllalilili" types={['grass']}></Book>
	<Book id={470} landscape={true} name="Phyllalililili" types={['grass']}></Book>
	<Book id={470} landscape={true} name="Phyllalilililili" types={['grass']}></Book>
	<Book id={470} landscape={true} name="Phyllalililililili" types={['grass']}></Book>
</section>

<style>
	section#ui-gallery {
		height: calc(100% - var(--small-gap) * 2);
		margin: var(--small-gap);
		border-radius: var(--border-r-50);
		background-color: var(--background-second-color);
		box-shadow: var(--box-shadow);
	}
</style>
