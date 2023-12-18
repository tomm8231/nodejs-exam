<script>
import { onMount } from "svelte";
import { BASE_URL } from "../../stores/generalStore.js";
import { topcenterMessageSucces, topcenterMessageFail } from "../../components/toastr/toastrMessage.js";
import Modal from "../../components/Modal/Modal.svelte";

let uniqueRounds = [];
let currentRound = "";
let showModal = false;

onMount(async () => {
    const response = await fetch(`${$BASE_URL}/api/rounds`, {
      credentials: "include",
    });
    const data = await response.json();
    uniqueRounds = data.data;
  });

  async function deleteRound() {
    const response = await fetch(`${$BASE_URL}/api/rounds/${currentRound}`, {
      method: "DELETE",
      credentials: "include",
    })

    if (response.ok){
        showModal = false;
        uniqueRounds = uniqueRounds.filter(round => round !== currentRound);
        topcenterMessageSucces(`${currentRound} er nu slettet`);

    } else {
        topcenterMessageFail("Noget gik galt, prøv igen senere");
    }

    }

  function showTheModal() {
    if(currentRound !== ""){
        showModal = true;
    }
  }

</script>

<style>
    @import "./deleteRoundAdmin.css";
</style>

<h1>Bestillingsrunder</h1>

<div>
  <label for="offerRound">Vælg bestillingsrunde</label>
  <select
    id="offerRound"
    bind:value={currentRound} >
    {#each uniqueRounds as round}
      <option value={round}>{round}</option>
    {/each}
  </select>
</div>
<button on:click={showTheModal}>Slet runde</button>
<Modal bind:showModal bind:selectedUser={currentRound}>
    <div class="options">
        <div>Slet bestillingsrunde {currentRound} og alt tilhørende</div>
        <button on:click={deleteRound}>Ja</button>
        <button on:click={() => showModal = false}>Nej</button>
    </div>
  </Modal>

