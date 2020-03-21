<script>
  let markuaText = "";
  let isConvertingInProgress = false;

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
</script>

<style>
  .branding-below {
    bottom: 56px;
    top: 0;
  }
  .branding-text {
    left: 7px;
    position: relative;
    top: 3px;
  }
  .col-contain {
    overflow: hidden;
  }
</style>

<main>
  <div class="sidebar branding-below">
    <form>
      <div class="block col-contain">
        <b>What is this?</b>
        <p>
          Convert this Google Doc to Markua as it's used on Leanpub. Learn more
          about the specification
          <a href="https://leanpub.com/markua/read" target="_blank">here</a>
          .
        </p>
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
        <textarea bind:value={markuaText} class="width-100" rows="10" cols="30" />
      </div>
      <div class="block" id="button-bar">
        <button class="blue" on:click|preventDefault={runConversion} disabled={isConvertingInProgress}>
          Convert
        </button>
      </div>
    </form>
  </div>

  <div class="sidebar bottom">
    <span class="gray branding-text">
      Markua Docs Add-on by
      <a href="https://www.twitter.com/@mikenikles" target="_blank">
        @mikenikles
      </a>
    </span>
  </div>
</main>
