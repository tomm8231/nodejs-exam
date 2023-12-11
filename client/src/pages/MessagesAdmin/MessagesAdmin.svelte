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
    let messages = []

    $:messages


    onMount(async () => {
    const response = await fetch(`${$BASE_URL}/api/rounds`, {
      credentials: "include",
    });
    const data = await response.json();
    uniqueRounds = data.data;


    const messagesPromise = await fetch(`${$BASE_URL}/api/messages`, {
      credentials: "include"
    })
    
    const messagesResult = await messagesPromise.json()
    messages = messagesResult.data
  });
  

    function handleSubmit() {
      const messageData = {
        round: currentRound,
        message
      }
        socket.emit("client-admin-message", messageData );

        messages.push(messageData)
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
  {#each messages as msg}
  <p>{msg.round}</p>
  <p>{msg.message}</p>
{/each}
</div>

</section>

<style>
    @import "./messagesAdmin.css";
</style>