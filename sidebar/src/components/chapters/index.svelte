<script>
  import { onMount } from "svelte";

  let chaptersLoader;

  onMount(() => {
    chaptersLoader = new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((chapters) => {
          resolve(chapters);
        })
        .withFailureHandler((error) => {
          console.log(error)
          reject(error);
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
    <!-- `error.message` looks like "Error: invalid-environment". We only care about the end of that string. -->
    {#if error.message.endsWith("invalid-environment")}
      <p>To see a list of your book's chapters, you must adhere to the following structure when you create folders and files in Google Drive:</p>
      <pre>
1 - Part One (folder)
├── 1 - Title of the first chapter in part one (document)
├── 2 - Title of the second chapter in part one (document)
2 - Part Two (folder)
├── 1 - Title of the first chapter in part two (document)
├── 2 - Title of the second chapter in part two (document)
3 - Part Three (same pattern applies as above)
      </pre>
    {/if}
  {/await}
</div>
