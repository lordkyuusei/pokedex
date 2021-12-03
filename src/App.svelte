<script lang="ts">
    import Router from "./routes/routes.svelte";
    import ThemeContext from "./contextes/ThemeContext.svelte";    
</script>

<ThemeContext>
    <main>
        <Router />
    </main>
</ThemeContext>

<style>
    :global(html) {
        background-color: var(--theme-background);
        color: var(--theme-text);
    }
</style>
