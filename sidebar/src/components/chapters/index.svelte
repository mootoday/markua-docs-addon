<script>
  import { onMount } from "svelte";

  let chaptersLoader;

  onMount(() => {
    chaptersLoader = new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((chapters) => {
          resolve(chapters);
        })
        .withFailureHandler((errorMessage) => {
          reject("Couldn't fetch chapters:", errorMessage);
        })
        .fetchChapters();
    });
  });
</script>

<h3>Navigate to book chapters</h3>

<p>
  Below is a list of chapters in your book. Click on one to open it in a new
  browser tab.
</p>

<div>
  {#await chaptersLoader}
    <p>Loading chapters, please wait...</p>
  {:then chapters}
    <p>Chapters: {JSON.stringify(chapters)}</p>
  {:catch error}
    <p>Error: {error.message}</p>
  {/await}
</div>
