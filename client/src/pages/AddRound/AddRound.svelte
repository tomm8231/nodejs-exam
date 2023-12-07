<script>
  import { BASE_URL } from "../../stores/generalStore.js";

  let roundName = "";
  let file;
  const formData = new FormData();
  let message = "";

  $: file;

  function handleFileChange(event) {
    file = event.target.files[0];
  }

  async function handleSubmit() {
    formData.append("file", file);
    formData.append("roundName", roundName);

    // Send formData to your server using fetch or any other method
    const response = await fetch(`${$BASE_URL}/api/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      message = "Filen blev uploadet" + JSON.stringify(result.data);
    } else {
      message = "Filen blev ikke uploadet" + JSON.stringify(result.data);
    }
  }

  function deleteFile() {
    file = null
  }
</script>

<section>
  <h1>Tilføj runde</h1>

  <form on:submit|preventDefault={handleSubmit}>
    {#if !file}
    <input
      type="file"
      id="fileInput"
      accept=".xlsx, .xls"
      on:change={handleFileChange}
      required
    />
    {:else}
    <h3>Valgt fil</h3>
    <p>{file.name} ({file.size} bytes)</p>
    <button on:click={deleteFile}>Slet fil</button>
  {/if}

    <label for="roundNameInput">Round Name:</label>
    <input type="text" id="roundNameInput" bind:value={roundName} required />

    <button type="submit">Upload</button>
  </form>

 

  <p>{message}</p>
</section>

<style>
  @import "./addRound.css";
</style>
