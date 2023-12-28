<script>
  export let title;
</script>

<style>
  summary {
    margin: 10px 0 10px 0;
  }
</style>

<details>
  <summary>{title}</summary>
  <slot />
</details>
