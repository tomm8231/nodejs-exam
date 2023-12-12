<script>
    import { onMount } from "svelte";
    import { BASE_URL } from "../../stores/generalStore.js";
    import { io } from "socket.io-client";
    import { topcenterMessageSucces, topcenterMessageFail } from "../../components/toastr/toastrMessage.js";
  
    const socket = io($BASE_URL);

    let round = '';
    let message = '';
    let uniqueRounds = [];
    let currentRoundMessage = "";
    let currentRoundShow = "";
    let messages = []
    let filteredMessages = [];
    let showSidebar = false;


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
    filteredMessages = messages;
  });
  

    function handleSubmit() {
      if (currentRoundMessage === "" || message === "") {
        topcenterMessageFail("Vælg en bestillingsrunde og skriv en besked først");
        return;
      }
      const messageData = {
        round: currentRoundMessage,
        message: `${message}`
      }
        socket.emit("client-admin-message", messageData );
        messageData.date = new Date();
        messages = [ messageData, ...messages]
        message = "";
        topcenterMessageSucces("Besked sendt");

        //skal kunne vises i filtered også
        if (currentRoundShow === currentRoundMessage || currentRoundShow === "") {
          filteredMessages = [messageData, ...filteredMessages]
        }
    }

    function toggleSidebar() {
  showSidebar = !showSidebar;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('dk-DK', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
    });
  }

//make me funktion that filter out the messages that are not in the current round
function filterMessages() {
  if (currentRoundShow === "") {
    filteredMessages = messages;
  } else {
    filteredMessages = messages.filter(msg => msg.round === currentRoundShow);
  }
}


</script>

<button class="write-message" style="left: {showSidebar ? '450px' : '0'};" on:click={toggleSidebar}>
  {#if !showSidebar} Ny besked {/if}
  {#if showSidebar} Luk besked {/if}
</button>

<div class="sidebar-message {showSidebar ? 'show' : ''}">
  <div>
    <label for="offerRound">Vælg bestillingsrunde</label>
    <select
      id="offerRound"
      bind:value={currentRoundMessage}
    >
      {#each uniqueRounds as round}
        <option value={round}>{round}</option>
      {/each}
    </select>
    <form id="messageForm" on:submit|preventDefault={handleSubmit}>
    
      <label for="message">Message:</label>
      <textarea id="message" bind:value={message} />
      
  
      <button type="submit">Submit</button>
  </form>
  </div>
</div>


<label for="offerRound">Vælg bestillingsrunde</label>
<select
  id="offerRound"
  bind:value={currentRoundShow}
  on:change={filterMessages}
>
  <option value="">Vis alle</option>
  {#each uniqueRounds as round}
    <option value={round}>{round}</option>
  {/each}
</select>

{#if filteredMessages.length > 0}

<div class="messages">
    <table>
      <thead>
        <tr>
          <th>Bestillingsrunde</th>
          <th>Besked</th>
          <th>Dato</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredMessages as msg}
          <tr>
            <td class="info">{msg.round}</td>
            <td class="message-text">{msg.message}</td>
            <td class="info">{formatDate(msg.date)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
<h3>Ingen beskeder</h3>
{/if}

<style>
    @import "./messagesAdmin.css";
</style>