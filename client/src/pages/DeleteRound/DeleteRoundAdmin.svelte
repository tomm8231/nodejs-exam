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
    });

    if (response.ok){
        showModal = false;
        uniqueRounds = uniqueRounds.filter(round => round !== currentRound);
        topcenterMessageSucces(`${currentRound} er nu slettet`);

    } else {
        topcenterMessageFail("Noget gik galt, prøv igen senere");
    }

    };

  function showTheModal() {
    if(currentRound !== ""){
        showModal = true;
    };
  };
</script>

<style>
        @import "./deleteRoundAdmin.css";
</style>

<h1 id="title">Slet bestillingsrunde</h1>

<div id="select-container">
    <label for="offerRound" id="offerRoundLabel">Vælg bestillingsrunde</label>
    <select
        id="offerRound"
        bind:value={currentRound} >
        {#each uniqueRounds as round}
            <option value={round} id={`option-${round}`}>{round}</option>
        {/each}
    </select>
    <button id="deleteRoundButton" on:click={showTheModal}>Slet runde</button>
</div>
<Modal bind:showModal bind:selectedUser={currentRound}>
    <div id="modalText">Slet bestillingsrunde {currentRound} og alt tilhørende</div>
        <div class="options" id="modalOptions">
        <button id="confirmDeleteButton" on:click={deleteRound}>Ja</button>
        <button id="cancelDeleteButton" on:click={() => showModal = false}>Nej</button>
      </div>
</Modal>


