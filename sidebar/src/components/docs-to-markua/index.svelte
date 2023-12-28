<script>
  let markuaText = "";
  let markuaTextarea;
  let notificationMessage = "";
  let isConvertingInProgress = false;
  $: isCopyToClipboardDisabled = markuaText === "";

  /**
   * Runs a server-side function to convert the entire document to Markua and update
   * the sidebar UI with the result.
   */
  const runConversion = () => {
    isConvertingInProgress = true;
    google.script.run
      .withSuccessHandler(function(markuaResult) {
        markuaText = markuaResult;
        console.log("Markua result", markuaResult);
        isConvertingInProgress = false;
      })
      .withFailureHandler(function(msg, element) {
        console.log("Error in convertDocToMarkua:", msg);
        // showError(msg, $("#button-bar"));
        isConvertingInProgress = false;
      })
      .withUserObject(this)
      .convertDocToMarkua();
  };

  const copyToClipboard = () => {
    markuaTextarea.select();
    document.execCommand("copy");

    notificationMessage = "Copied to clipboard.";
    setTimeout(() => {
      notificationMessage = "";
    }, 1500);
  };
</script>

<style>
  .col-contain {
    overflow: hidden;
  }
</style>

<h3>Convert to Markua</h3>
<p>
  This section allows you to convert the entire document to Markua. You can
  simply copy & paste the Markua output to your Leanpub editor input field and
  preview or publish your book.
</p>

<details>
  <summary>Open</summary>
  <form>
    <div class="block col-contain">
      <p>
        Click
        <b>Convert</b>
        below and copy the output from the text field to your Leanpub book
        editor input field.
      </p>
    </div>
    <div class="block form-group">
      <label for="markua-text">
        <b>Markua</b>
      </label>
      <textarea
        bind:this={markuaTextarea}
        bind:value={markuaText}
        class="width-100"
        rows="10"
        cols="30" />
    </div>
    <div class="block" id="button-bar">
      <button
        class="blue"
        on:click|preventDefault={runConversion}
        disabled={isConvertingInProgress}>
        Convert
      </button>
      <button
        on:click|preventDefault={copyToClipboard}
        disabled={isCopyToClipboardDisabled}>
        Copy to clipboard
      </button>
    </div>
    {#if notificationMessage}
      <p>{notificationMessage}</p>
    {/if}
  </form>
</details>
