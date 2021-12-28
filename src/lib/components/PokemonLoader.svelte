<div class="pokemon-loader-container">
	<div class="pokemon-loader">
		<div class="loader-button">
			<div class="button-circle" />
		</div>
	</div>
</div>

<style>
	.pokemon-loader-container {
		height: 75px;
		width: 75px;
		border-radius: 50px;
		box-shadow: var(--theme-shadow);
		background: linear-gradient(225deg, rgba(255, 255, 255, 0.5) 30%, rgba(0, 0, 0, 0.3) 70%);
	}
	.pokemon-loader {
		z-index: -1;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50px;
		height: 100%;
		width: 100%;
		background: linear-gradient(to bottom, #ff0000 47%, #000000 50%, #ffffff 53%);
		animation: rotate 1s ease-in-out infinite;
	}
	.loader-button {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 2px solid #000000;
		border-radius: 20px;
		height: 20%;
		width: 20%;
		background-color: white;
	}
	.button-circle {
		border: 1px solid #454545;
		border-radius: 20px;
		height: 50%;
		width: 50%;
	}
	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		10% {
			transform: rotate(-20deg);
		}
		70% {
			transform: rotate(20deg);
		}
		80% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
