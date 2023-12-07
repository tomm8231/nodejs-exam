<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore.js";
  import { user } from "../../stores/userStore.js"
  import { topcenterMessageSucces, topcenterMessageFail } from "../../components/toastr/toastrMessage.js";
  import { io } from "socket.io-client";
  
  const socket = io($BASE_URL);

  let orderedItems = [];
  let headerKeys = [];
  let itemKey = "";
  let currentRound = "";
  let uniqueRounds = []

  onMount(async () => {
    const response = await fetch(`${$BASE_URL}/api/rounds`, {
        credentials: "include"
      })
    const data = await response.json();
    uniqueRounds = data.data
  });
  let isOpen = true;

  socket.on("server-sent-round-message", (data) => {
             topcenterMessageSucces(data.message)
         });
  
  async function fetchData() {
    let response = await fetch(`${$BASE_URL}/api/orders/${currentRound}/${$user.uid}`, { credentials: "include" });

    if (!response.ok) {
      response = await fetch(`${$BASE_URL}/api/products/${currentRound}`, { credentials: "include" });
    }


    const roundStatus = await fetch(`${$BASE_URL}/api/orders/status/${currentRound}`, { credentials: "include" });
    const statusResult = await roundStatus.json();
    if (statusResult.data !== undefined) {
      isOpen = statusResult.data;
    }

    const result = await response.json();
    orderedItems = result.data;

    headerKeys = orderedItems.length > 0 ? Object.keys(orderedItems[0]) : [];
    headerKeys.shift(); // removes/hides the _id from the user
    headerKeys.pop(); // removes/hides the quantity from the user
    itemKey = orderedItems.length > 0 ? Object.keys(orderedItems[0])[0] : "";
  }

  function handleQuantityChange(itemId, event) {
    const value = parseInt(event.target.value);
    const foundItem = orderedItems.find(item => item._id === itemId)
    foundItem.quantity = value
  }

  function handleOfferRoundChange(event) {
    currentRound = event.target.value;
    fetchData();
  }

  async function submitChanges() {

    try {
      await fetch(`${$BASE_URL}/api/orders`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderedItems,
          staffNumber: $user.uid,
          round: currentRound,
        })
      });

      topcenterMessageSucces("Din bestilling er gemt");
    } catch (error) {
      console.error("Error: " + error);
      topcenterMessageFail("Der skete en fejl. Prøv igen senere")
    }
  }
</script>

<main>
  {#if currentRound}
    <h1>Din bestellings seddel for {currentRound}</h1>
  {:else}
    <h1>Bestillingsrunder</h1>
  {/if}

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

  {#if currentRound}
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
        {#each orderedItems as item (item[itemKey])}
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
    <div class="button-container">
    {#if isOpen}
    <button class="open-button" on:click={submitChanges}>Gem ændringer</button>
    {:else}
    <button disabled class="close-button">Lukket for bestillinger</button>
    {/if}
    </div>
  {/if}
</main>

<style>
  @import "./showItems.css";
</style>
