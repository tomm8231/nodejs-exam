<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore.js";
  import { topcenterMessageSucces, topcenterMessageFail } from "../../components/toastr/toastrMessage.js";
  import { io } from "socket.io-client";
  
  const socket = io($BASE_URL);

  let showAllOrders = [];
  let headerKeys = [];
  let itemKey = "";
  let currentRound = "";
  let uniqueRounds = [];

  onMount(async () => {
    const response = await fetch(`${$BASE_URL}/api/rounds`, {
      credentials: "include",
    });
    const data = await response.json();
    uniqueRounds = data.data;
  });
  let isOpen = true;

  async function fetchData() {
    const response = await fetch(`${$BASE_URL}/api/orders/${currentRound}`, {
      credentials: "include",
    });
    
    const roundStatus = await fetch(`${$BASE_URL}/api/orders/status/${currentRound}`, { credentials: "include" });
    const statusResult = await roundStatus.json();
    if (statusResult.data !== undefined) {
      isOpen = statusResult.data;
    }

    const result = await response.json();

    if (result.data[0].hasOwnProperty("orderedItems")) {
      showAllOrders = result.data[0]
    } else {
      showAllOrders = result.data
    }

    headerKeys = showAllOrders.length > 0 ? Object.keys(showAllOrders[0]) : [];
    headerKeys.shift()
    itemKey = showAllOrders.length > 0 ? Object.keys(showAllOrders[0])[0] : "";
  };

  function handleOfferRoundChange(event) {
    currentRound = event.target.value;
    showAllOrders = []
    fetchData();
  }

  async function closeOrder() {
    isOpen = false;
    const response = await fetch(`${$BASE_URL}/api/orders/${currentRound}`, {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isOpen }),
    });
    if (!response.ok) {
      const result = await response.json();
      const message = result.data;
      topcenterMessageFail("Der skete en fejl: " + message);
    } else {
      topcenterMessageSucces("Runden er lukket for flere bestillinger");

      socket.emit("client-admin-order-status", {
            message: `${currentRound} er lukket for flere bestillinger`
      });
     }
  }

  async function openOrder() {
    isOpen = true;
    const response = await fetch(`${$BASE_URL}/api/orders/${currentRound}`, {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isOpen }),
    });
    if (!response.ok) {
      const result = await response.json();
      const message = result.data;
      topcenterMessageFail("Der skete en fejl: " + message);
    } else {
      topcenterMessageSucces("Runden er åbnet for flere bestillinger");
      socket.emit("client-admin-order-status", {
            message: `${currentRound} er genåbnet for bestillinger`
        });
    }
  }

</script>

<main>
  {#if currentRound}
    <h1>Samlet ordre for bestilling {currentRound}</h1>
  {:else}
    <h1>Se samlet ordrer</h1>
  {/if}

  <label for="offerRound">Vælg bestillingsrunde:</label>
  <select
    id="offerRound"
    bind:value={currentRound}
    on:change={handleOfferRoundChange}
  >
    <!-- <option value="fjallraven_feb_24">Fjallraven Feb 24</option>
    <option value="s2s_oct_24">Sea to Summit okt 24</option>
    <option value="arc'teryx_december_2023_2">arc</option> -->
    {#each uniqueRounds as round}
      <option value={round}>{round}</option>
    {/each}
  </select>

  {#if showAllOrders && showAllOrders.length > 0}
    <table>
      <thead>
        <tr>
          {#each headerKeys as key (key)}
            <th>{key}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each showAllOrders as item (item[itemKey])}
          <tr>
            {#each headerKeys as key (key)}
              <td>{item[key]}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
    <div class="button-container">
      {#if isOpen}
        <h1>Denne bestilling er åben</h1>
        <button class="closeOrder" on:click={closeOrder}>Luk for bestilling</button>
      {:else}
        <h1>Denne bestilling er lukket</h1>
        <button class="openOrder" on:click={openOrder}>Genåben for bestilling</button>
      {/if}
  </div>
{/if}
</main>

<style>
  @import "./showItemsAdmin.css";
</style>
