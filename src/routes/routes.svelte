<script lang="ts">
    import { Route, Router } from 'svelte-routing';
    import PokemonList from '../views/PokemonList.svelte';
    import PokemonPage from '../views/PokemonPage.svelte';
    import Pokemon404 from '../views/Pokemon404.svelte';

    export let url = '';
</script>

<Router {url}>
    <div>
        <Route path="/" component={PokemonList} />
        <Route path="/pokemon/:name" component={PokemonPage} />
        <Route path="*" component={Pokemon404} />
    </div>
</Router>