<script>
  import { createEventDispatcher } from "svelte";
  import BaseSnippet from "./base.svelte";

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

<style>
  form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  label {
    flex: 0 50%;
  }

  button {
    margin-top: 10px;
  }
</style>

<BaseSnippet title="Blurb">
  <form>
    {#each classes as classItem, i}
      <label>
        <input type="radio" bind:group={clazz} value={classItem.value} />
        {classItem.value[0].toUpperCase() + classItem.value.substr(1)}
      </label>
    {/each}
  </form>
  <button
    class="blue"
    disabled={clazz === ""}
    on:click={() => dispatch('insertSnippet', {
        type: 'blurb',
        attributes: { clazz }
      })}>
    Insert
  </button>
  <button
    on:click={() => {
      clazz = '';
    }}>
    Reset
  </button>
</BaseSnippet>
