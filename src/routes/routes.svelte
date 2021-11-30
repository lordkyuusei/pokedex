<script lang="ts">
    import { Route, Router } from 'svelte-routing';
    import PokemonList from '../views/PokemonList.svelte';
    import PokemonPage from '../views/PokemonPage.svelte';

    export let url = '';
</script>

<Router {url}>
    <div>
        <Route path="/" component={PokemonList} />
        <Route path="/pokemon/:order" component={PokemonPage} />
    </div>
</Router>