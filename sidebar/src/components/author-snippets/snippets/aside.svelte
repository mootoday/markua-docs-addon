<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
</script>

<details>
  <summary>Aside</summary>
  <button
    class="blue"
    on:click={() => dispatch('insertSnippet', { type: 'aside' })}>
    Insert
  </button>
</details>
