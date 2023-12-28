<script>
  import Aside from "./snippets/aside.svelte";
  import Blurb from "./snippets/blurb.svelte";

  const insertSnippet = (event) => {
    google.script.run.insertSnippet(event.detail);
  }
</script>

<h3>Author snippets</h3>
<p>
  Use this section to insert Markua-specific elements, such as
  <span>asides</span>
  ,
  <span>blurbs</span>
  ,
  <span>blockquotes</span>
  , etc. No need to remember the exact syntax!
</p>
<p>
  <strong>Note:</strong>
  Place your cursor where you want the snippet to be inserted.
</p>

<Aside on:insertSnippet={insertSnippet}/>
<Blurb on:insertSnippet={insertSnippet}/>