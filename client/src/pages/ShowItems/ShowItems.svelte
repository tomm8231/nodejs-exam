<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore.js";
  import { user } from "../../stores/userStore.js"

  let orderedItems = [];
  let headerKeys = [];
  let itemKey = "";
  let currentRound = "";
  
  //test

  async function fetchData() {
    let response = await fetch(`${$BASE_URL}/api/orders/${currentRound}/${$user.uid}`);

    if (!response.ok) {
      response = await fetch(`${$BASE_URL}/api/products/${currentRound}`);
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

      console.log($user.uid);
      //Toastr
    } catch (error) {
      console.error("Error: " + error);
      //Toastr
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
    <option value="fjallraven_feb_24">Fjallraven Feb 24</option>
    <option value="s2s_oct_24">Sea to Summit okt 24</option>
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
                value={item.quantity || 0}
                on:input={(event) => handleQuantityChange(item[itemKey], event)}
              />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <button on:click={submitChanges}>Gem ændringer</button>
  {/if}
</main>

<style>
  @import "./showItems.css";
</style>
