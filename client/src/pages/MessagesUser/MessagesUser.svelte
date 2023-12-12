<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore.js";
  import { io } from "socket.io-client";
  import { topcenterMessageSucces } from "../../components/toastr/toastrMessage.js";

  const socket = io($BASE_URL);

  let uniqueRounds = [];
  let currentRoundShow = "";
  let messages = [];
  let filteredMessages = [];

  $:messages

  onMount(async () => {
    const response = await fetch(`${$BASE_URL}/api/rounds`, {
      credentials: "include",
    });
    const data = await response.json();
    uniqueRounds = data.data;

    const messagesPromise = await fetch(`${$BASE_URL}/api/messages`, {
      credentials: "include",
    });

    const messagesResult = await messagesPromise.json();
    messages = messagesResult.data;
    filteredMessages = messages;
  });

  socket.on("server-admin-message", (data) => {
    messages = [data, ...messages];

    if (currentRoundShow === data.round || currentRoundShow === "") {
        topcenterMessageSucces("Ny besked vedr. " + data.round);
          filteredMessages = [data, ...filteredMessages]
        }
  });



  function filterMessages() {
  if (currentRoundShow === "") {
    filteredMessages = messages;
  } else {
    filteredMessages = messages.filter(msg => msg.round === currentRoundShow);
  }
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
</script>

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
