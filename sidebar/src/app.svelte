<script>
  import AddonIntro from "./components/addon-intro.svelte";
  import AuthorSnippets from "./components/author-snippets/index.svelte";
  import Chapters from "./components/chapters/index.svelte";
  import DocsToMarkua from "./components/docs-to-markua/index.svelte";
  import Footer from "./components/footer.svelte";

  let openDialog;

  const navButtons = [{
    action: "snippets",
    label: "Snippets"
  }, {
    action: "convert",
    label: "Convert"
  // }, {
  //   action: "chapters",
  //   label: "Chapters"
  }];
</script>

<style>
  .branding-below {
    bottom: 0px;
    top: 0;
  }
</style>

<main class="sidebar branding-below">
  <AddonIntro />

  {#each navButtons as navButton}
    <button
      class:action={openDialog === navButton.action}
      disabled={openDialog === navButton.action}
      on:click={() => (openDialog = navButton.action)}>
      {navButton.label}
    </button>
  {/each}

  {#if openDialog === 'snippets'}
    <AuthorSnippets />
  {:else if openDialog === 'convert'}
    <DocsToMarkua />
  {:else if openDialog === 'chapters'}
    <Chapters />
  {/if}
  <Footer />
</main>
