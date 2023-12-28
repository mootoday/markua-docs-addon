<script>
  import AddonIntro from "./components/addon-intro.svelte";
  import AuthorSnippets from "./components/author-snippets/index.svelte";
  import DocsToMarkua from "./components/docs-to-markua/index.svelte";
  import Footer from "./components/footer.svelte";

  let openDialog;
</script>

<main>
  <AddonIntro />

  <button
    class:action={openDialog === 'snippets'}
    disabled={openDialog === 'snippets'}
    on:click={() => (openDialog = 'snippets')}>
    Author Snippets
  </button>
  <button
    class:action={openDialog === 'convert'}
    disabled={openDialog === 'convert'}
    on:click={() => (openDialog = 'convert')}>
    Convert to Markua
  </button>

  {#if openDialog === 'snippets'}
    <AuthorSnippets />
  {:else if openDialog === 'convert'}
    <DocsToMarkua />
  {/if}
  <Footer />
</main>
