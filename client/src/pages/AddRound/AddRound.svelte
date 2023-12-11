<script>
  import { BASE_URL } from "../../stores/generalStore.js";
  import {
    topcenterMessageSucces,
    topcenterMessageFail,
  } from "../../components/toastr/toastrMessage.js";

  let roundName = "";
  let softDeadline = ""
  let file;
  const formData = new FormData();
  let message = "";
  let minDate = getMinDate();

  $: file;

  function handleFileChange(event) {
    file = event.target.files[0];
  }

  function getMinDate() {
    const now = new Date();

    const month =
      now.getMonth() + 1 < 10 ? "0" + now.getMonth() + 1 : now.getMonth() + 1;
    const day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
    const year = now.getFullYear();
    return year + "-" + month + "-" + day;
  }

  async function handleSubmit() {
    formData.append("file", file);
    formData.append("roundName", roundName);
    formData.append("softDeadline", softDeadline);

    try {
      const response = await fetch(`${$BASE_URL}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        topcenterMessageSucces("Bestillingsrunden blev oprettet");

        deleteFile()
        roundName = ""
        softDeadline = ""
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      topcenterMessageFail("Bestillingsrunden blev ikke oprettet: " + err.message);
    }
  }

  function deleteFile() {
    file = null;
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

    <label for="roundNameInput">Navn på bestillingsrunde:</label>
    <input type="text" id="roundNameInput" bind:value={roundName} required />

    <label for="softDeadline">Forventet sidste frist:</label>
    <input
      type="date"
      id="softDeadline"
      min={minDate}
      bind:value={softDeadline}
      required
    />

    <button type="submit">Upload</button>
  </form>

  <p>{message}</p>
</section>

<style>
  @import "./addRound.css";
</style>
