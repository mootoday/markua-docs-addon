<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const classes = [
    {
      value: "center"
    },
    {
      value: "discussion"
    },
    {
      value: "error"
    },
    {
      value: "information"
    },
    {
      value: "tip"
    },
    {
      value: "warning"
    }
  ];
  let clazz = "";
</script>

<details>
  <summary>Blurb</summary>
  <form>
    {#each classes as classItem, i}
      {#if i % 3 === 0}
        <br />
      {/if}
      <label>
        <input type="radio" bind:group={clazz} value={classItem.value} />
        {classItem.value[0].toUpperCase() + classItem.value.substr(1)}
      </label>
    {/each}
  </form>
  <button
    class="blue"
    on:click={() => dispatch('insertSnippet', { type: 'blurb', attributes: {clazz} })}>
    Insert
  </button>
  <button on:click={() => {clazz = "";}}>Reset</button>
</details>
