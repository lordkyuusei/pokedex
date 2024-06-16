<script lang="ts">
	import { theme, variant } from '$lib/store/theme';
	import { browser } from '$app/environment';
	import variants, { type VariantInfo } from '$lib/constants/themeVariants';

	let boundVariant: VariantInfo | null = null;
	let themeMatchingVariants: VariantInfo[] = [];

	const updateMatchingVariants = (theme: Theme) => variants[theme];
	const updateBoundVariant = () =>
		themeMatchingVariants.find((x) => x.variant === $variant) ?? null;

	$: if (browser && $theme) {
		themeMatchingVariants = updateMatchingVariants($theme);
		boundVariant = updateBoundVariant();
	}

	$: if (browser && boundVariant) {
		$variant = boundVariant.variant;
		localStorage.setItem('variantPreference', $variant);
	}
</script>

<ul>
	{#each themeMatchingVariants as variant}
		<li>
			<input
				style:--color={variant.color}
				type="radio"
				name="variant"
				value={variant}
				bind:group={boundVariant}
			/>
		</li>
	{/each}
</ul>

<style>
	ul {
		width: 100%;
		display: flex;
		justify-content: space-evenly;

		& > li {
			& > input {
				cursor: pointer;
				-webkit-appearance: none;
				-moz-appearance: none;
				appearance: none;

				border-radius: var(--border-r-200);
				aspect-ratio: 1;
				height: 1rem;

				border: 0.25rem solid var(--background-color);
				outline: 0.125rem solid var(--color);

				transition: all var(--transition-duration) var(--transition-function);

				&:not(:checked):hover {
					border: 0.3rem solid var(--background-color);
					background-color: var(--color);
				}

				&:checked {
					background-color: var(--color);
				}
			}
		}
	}
</style>
