<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore.js";
  import {
    topcenterMessageSucces,
    topcenterMessageFail,
  } from "../../components/toastr/toastrMessage.js";
  import { io } from "socket.io-client";

  const socket = io($BASE_URL);

  let showAllOrders = [];
  let headerKeys = [];
  let itemKey = "";
  let currentRound = "";
  let uniqueRounds = [];
  let showOnlyOrderedItems;
  let displayedItems = [];
  let isOpen = true;

  $: if (showOnlyOrderedItems) {
    displayedItems = showAllOrders.filter((item) => item.quantity > 0);
  } else {
    displayedItems = showAllOrders;
  }

  onMount(async () => {
    const response = await fetch(`${$BASE_URL}/api/rounds`, {
      credentials: "include",
    });
    const data = await response.json();
    uniqueRounds = data.data;
  });

  async function fetchData() {
    const response = await fetch(`${$BASE_URL}/api/orders/${currentRound}`, {
      credentials: "include",
    });

    const roundStatus = await fetch(
      `${$BASE_URL}/api/orders/status/${currentRound}`,
      { credentials: "include" }
    );
    const statusResult = await roundStatus.json();
    if (statusResult.data !== undefined) {
      isOpen = statusResult.data;
    };

    const result = await response.json();

    if (result.data[0].hasOwnProperty("orderedItems")) {
      showAllOrders = result.data[0];
      displayedItems = showAllOrders;
    } else {
      showAllOrders = result.data;
      displayedItems = showAllOrders;
    };

    headerKeys = displayedItems.length > 0 ? Object.keys(displayedItems[0]) : [];
    headerKeys.shift();
    itemKey = displayedItems.length > 0 ? Object.keys(displayedItems[0])[0] : "";
  };

  function handleOfferRoundChange(event) {
    currentRound = event.target.value;
    displayedItems = [];
    showOnlyOrderedItems = false;
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
      topcenterMessageSucces("Runden er lukket for bestillinger");
      socket.emit("client-admin-order-status", {
        message: `${currentRound} er lukket for bestillinger`,
        round: currentRound,
        date: new Date(),
        isOpen,
      });
    };
  };

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
        round: currentRound,
        message: `${currentRound} er genåbnet for bestillinger`,
        date: new Date(),
        isOpen,
      });
    };
  };

  async function downloadExcel() {

    try {
      const response = await fetch(`${$BASE_URL}/download-excel/${currentRound}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        const message = await response.json();
        topcenterMessageFail("Der skete en fejl: " + message.data);

      } else {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${currentRound}-stafforders.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    };
  };
  
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
    {#each uniqueRounds as round}
      <option value={round}>{round}</option>
    {/each}
  </select>

  {#if (displayedItems && displayedItems.length > 0) || showAllOrders.length > 0}
    <div id="orderedItemsCheckbox">
      <label for="showOnlyOrderedItems">Vis kun bestilte varer</label>
      <input
        type="checkbox"
        id="showOnlyOrderedItems"
        bind:checked={showOnlyOrderedItems}
      />
    </div>

    <div class="button-container">
      {#if isOpen}
        <h3>Denne bestilling er åben</h3>
        <button class="closeOrder" on:click={closeOrder}
          >Luk for bestilling</button
        >
      {:else}
        <h3>Denne bestilling er lukket</h3>
        <button class="openOrder" on:click={openOrder}
          >Genåben for bestilling</button
        >
      {/if}
      {#if !isOpen}
        <button id="button-download" on:click={downloadExcel}
          >Download Excel</button
        >
      {/if}
    </div>
    {#if displayedItems.length > 0}
      <table>
        <thead>
          <tr>
            {#each headerKeys as key (key)}
              <th>{key}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each displayedItems as item (item[itemKey])}
            <tr>
              {#each headerKeys as key (key)}
                <td>{item[key]}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  {/if}
</main>

<style>
  @import "./finishOrderAdmin.css";
</style>
