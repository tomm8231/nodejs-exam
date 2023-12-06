<script>
    import { BASE_URL } from "../../stores/generalStore.js";

  let roundName = "";
  let file;
  const formData = new FormData();
  let message = ""

function handleFileChange(event) {
  file = event.target.files[0];
}

async function handleSubmit() {
  formData.append('file', file);
  formData.append('roundName', roundName)

  // Send formData to your server using fetch or any other method
  const response = await fetch(`${$BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  })

  const result = await response.json()


  if (response.ok) {
    message = "Godendt" + JSON.stringify(result.data)
  } else {
    message = "Fejl" + JSON.stringify(result.data)
  }
    

}
</script>

<section>
  <h1>Tilføj runde</h1>

  <form on:submit|preventDefault={handleSubmit}>
    <label for="fileInput">Vælg fil:</label>
    <input type="file" id="fileInput" accept=".xlsx, .xls" on:change={handleFileChange} required/>

    <label for="roundNameInput">Round Name:</label>
    <input type="text" id="roundNameInput" bind:value={roundName} required/>

    <button type="submit">Upload</button>
  </form>

  <p>{message}</p>
</section>

<style>
  @import "./addRound.css";
</style>
