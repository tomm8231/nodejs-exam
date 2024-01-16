<script>svelte';
  import { io } from "socket.io-client";
  import { BASE_URL } from "../../stores/generalStore.js";
  import { user } from "../../stores/userStore.js";
  import {
    topcenterMessageSucces,
    topcenterMessageFail,
  } from "../../components/toastr/toastrMessage.js";
  
  let $user;let $BASE_URL;

  const socket = io($BASE_URL);

  let orderedItems = [];
  let headerKeys = [];
  let itemKey = '';
  let currentRound = '';
  let uniqueRounds = [];

  let filteredItems = [];
  let searchQuery = '';
  let isOpen = true;

  onMount(async () => {
    const response = await fetch(`${$BASE_URL}/api/rounds`, {
      credentials: 'include',
    });
    const data = await response.json();
    uniqueRounds = data.data;
  });

  socket.on('server-sent-round-message', (data) => {
  if (data.round === currentRound) {
      isOpen = data.isOpen;
    }
    topcenterMessageSucces(data.message);
  });

  async function fetchData() {
    try {
      let response = await fetch(
        `${$BASE_URL}/api/orders/${currentRound}/${$user.uid}`,
        { credentials: 'include' },
      );

      if (!response.ok) {
        response = await fetch(`${$BASE_URL}/api/products/${currentRound}`, {
          credentials: 'include',
        });
      }

      const roundStatus = await fetch(
        `${$BASE_URL}/api/orders/status/${currentRound}`,
        { credentials: 'include' },
      );
      const statusResult = await roundStatus.json();
      if (statusResult.data !== undefined) {
        isOpen = statusResult.data;
      }

      const result = await response.json();
      orderedItems = result.data;
      filteredItems = orderedItems;

      headerKeys = orderedItems.length > 0 ? Object.keys(orderedItems[0]) : [];
      headerKeys.shift(); // removes/hides the _id from the user
      headerKeys.pop(); // removes/hides the quantity from the user
      itemKey = orderedItems.length > 0 ? Object.keys(orderedItems[0])[0] : '';
    } catch (error) {
      console.log(`Fejl: ${  error}`);
    }
  }

  function handleQuantityChange(itemId, event) {
    const value = parseInt(event.target.value);
    const foundItem = orderedItems.find((item) => item._id === itemId);
    foundItem.quantity = value;
  }

  function handleOfferRoundChange(event) {
    currentRound = event.target.value;
    filteredItems = [];
    searchQuery = '';
    fetchData();
  }

  function handleSearchChange(event) {
    searchQuery = event.target.value.toLowerCase();
    filterItems();
  }

  function filterItems() {
    filteredItems = orderedItems.filter((item) => Object.values(item).some((value) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchQuery);
        } if (typeof value === 'number') {
          return value.toString().includes(searchQuery);
        }
        return false;
      }),
    );
  }

  async function submitChanges() {
    try {
      await fetch(`${$BASE_URL}/api/orders`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderedItems,
          staffNumber: $user.uid,
          round: currentRound,
        }),
      });

      topcenterMessageSucces('Din bestilling er gemt');
    } catch (error) {
      console.error(`Error: ${  error}`);
      topcenterMessageFail('Der skete en fejl. Prøv igen senere');
    }
  }
</script>

<main>
  {#if currentRound}
    <h1>Din bestellings seddel for {currentRound}</h1>
  {:else}
    <h1>Bestillingsrunder</h1>
  {/if}
  <div>
    <label for="offerRound">Vælg bestillingsrunde</label>
    <select
      id="offerRound"
      bind:value={currentRound}
      on:change={handleOfferRoundChange}
    >
      {#each uniqueRounds as round}
        <option value={round}>{round}</option>
      {/each}
    </select>
  </div>

  {#if orderedItems.length > 0}
    <div id="search-bar">
      <input
        id="search-input"
        type="text"
        placeholder="Søg på vare"
        bind:value={searchQuery}
        on:input={handleSearchChange}
      />
    </div>
    {#if filteredItems.length > 0}
    <div class="button-container">
      {#if isOpen}
        <button class="open-button" on:click={submitChanges}
          >Gem ændringer</button
        >
      {:else}
        <button disabled class="close-button">Lukket for bestillinger</button>
      {/if}
    </div>
      <table>
        <thead>
          <tr>
            {#each headerKeys as key (key)}
              <th>{key}</th>
            {/each}
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredItems as item (item[itemKey])}
            <tr>
              {#each headerKeys as key (key)}
                <td>{item[key]}</td>
              {/each}
              <td>
                <input
                  type="number"
                  min="0"
                  value={item.quantity || 0}
                  on:input={(event) => handleQuantityChange(item[itemKey], event)}
                />
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

    {:else}
      <p>Din søgning gav intet resultat</p>
    {/if}
  {/if}
</main>

<style>
  @import "./showAvailableItemsUser.css";
</style>
