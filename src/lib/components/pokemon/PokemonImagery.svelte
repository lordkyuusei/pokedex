<script lang="ts">
	import Card from '$lib/components/barebone/Card.svelte';
	import type { SpritesRef } from '$lib/types/Pokemon';

	export let id: number = 0;
	export let sprites: SpritesRef = null;

	$: console.log(sprites);
</script>

<Card title="Imagerie">
	<section class="pokemon-pictures">
		<header>
			<img src={sprites?.other['official-artwork'].front_default} alt="Official" />
			<img src={sprites?.other.dream_world.front_default} alt="Dream world" />
			<img src={sprites?.other.home.front_default} alt="Home" />
			<img src={sprites?.front_default} alt="Front" />
		</header>
		<section>
			<img src={sprites?.versions['generation-i']['red-blue'].front_default} alt="Red and Blue" />
			<img src={sprites?.versions['generation-i']['yellow'].front_default} alt="Yellow" />
			<img src={sprites?.versions['generation-ii']['crystal'].front_default} alt="Crystal" />
			<img src={sprites?.versions['generation-ii']['gold'].front_default} alt="Gold" />
			<img src={sprites?.versions['generation-ii']['silver'].front_default} alt="Silver" />
			<img src={sprites?.versions['generation-iii']['emerald'].front_default} alt="Emerald" />
			<img
				src={sprites?.versions['generation-iii']['firered-leafgreen'].front_default}
				alt="Fire Red and Leaf Green"
			/>
			<img
				src={sprites?.versions['generation-iii']['ruby-sapphire'].front_default}
				alt="Ruby and Sapphire"
			/>
			<img
				src={sprites?.versions['generation-iv']['diamond-pearl'].front_default}
				alt="Diamond and Pearl"
			/>
			<img
				src={sprites?.versions['generation-iv']['heartgold-soulsilver'].front_default}
				alt="Heart Gold and Soul Silver"
			/>
			<img src={sprites?.versions['generation-iv']['platinum'].front_default} alt="Platinum" />
			<img
				src={sprites?.versions['generation-v']['black-white']['animated'].front_default}
				alt="Animated"
			/>
			<img
				src={sprites?.versions['generation-vi']['omegaruby-alphasapphire'].front_default}
				alt="Omega Ruby"
			/>
			<img src={sprites?.versions['generation-vi']['x-y'].front_default} alt="X and Y" />
			<img
				src={sprites?.versions['generation-vii']['ultra-sun-ultra-moon'].front_default}
				alt="Ultra Sun and Ultra Moon"
			/>
		</section>
		<footer>
			<img src={sprites?.back_default} alt="Back" />
			<img src={sprites?.front_shiny} alt="Front shiny" />
			<img src={sprites?.back_shiny} alt="Back shiny" />
		</footer>
	</section>
</Card>

<style>
	.pokemon-pictures {
		display: flex;
		height: 100%;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		overflow-y: auto;
	}

	.pokemon-pictures img {
		aspect-ratio: 1/1;
		max-height: 105px;
	}
</style>
