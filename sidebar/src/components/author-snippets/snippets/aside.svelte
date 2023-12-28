<script>
  import { createEventDispatcher } from "svelte";
  import BaseSnippet from "./base.svelte";

  const dispatch = createEventDispatcher();
</script>

<BaseSnippet title="Aside">
  <button
    class="blue"
    on:click={() => dispatch('insertSnippet', { type: 'aside' })}>
    Insert
  </button>
</BaseSnippet>

<!-- <details>
  <summary>Aside</summary>
  <button
    class="blue"
    on:click={() => dispatch('insertSnippet', { type: 'aside' })}>
    Insert
  </button>
</details> -->
