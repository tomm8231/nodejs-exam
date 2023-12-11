<script>
    import { onMount } from "svelte";
    import { BASE_URL } from "../../stores/generalStore.js";
    import { io } from "socket.io-client";
    import { topcenterMessageSucces } from "../../components/toastr/toastrMessage.js";
  
    const socket = io($BASE_URL);

    let round = '';
    let message = '';
    let uniqueRounds = [];
    let currentRound = "";


    onMount(async () => {
    const response = await fetch(`${$BASE_URL}/api/rounds`, {
      credentials: "include",
    });
    const data = await response.json();
    uniqueRounds = data.data;
  });
  

    function handleSubmit() {
        socket.emit("client-admin-message", { round: currentRound, message });
        message = "";
        topcenterMessageSucces("Besked sendt");
    }
</script>

<section id="container">
<form id="messageForm" on:submit|preventDefault={handleSubmit}>
    <div>
        <label for="offerRound">Vælg bestillingsrunde</label>
        <select
          id="offerRound"
          bind:value={currentRound}
        >
          {#each uniqueRounds as round}
            <option value={round}>{round}</option>
          {/each}
        </select>
      </div>
    <label for="message">Message:</label>
    <textarea id="message" bind:value={message} />
    

    <button type="submit">Submit</button>
</form>

<div class="messages">
    <p>Test</p>
</div>

</section>

<style>
    @import "./messagesAdmin.css";
</style>