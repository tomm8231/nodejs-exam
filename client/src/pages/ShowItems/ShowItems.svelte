<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore.js";

  let items = [];
  let headerKeys = [];
  let itemKey = "";
  let quantityValues = {};
  let currentRound = "";
  

  async function fetchData() {
    let response = await fetch(`${$BASE_URL}/api/orders/${currentRound}/user2`);

    if (!response.ok) {
      response = await fetch(`${$BASE_URL}/api/products/${currentRound}`);
    }

    const result = await response.json();
    items = result.data;

    headerKeys = items.length > 0 ? Object.keys(items[0]) : [];
    headerKeys.shift(); // removes/hides the _id from the user
    headerKeys.pop(); // removes/hides the quantity from the user
    itemKey = items.length > 0 ? Object.keys(items[0])[0] : "";
  }

  function handleQuantityChange(sku, event) {
    const value = parseInt(event.target.value) || 0;
    quantityValues = {
      ...quantityValues,
      [sku]: value,
    };
  }

  function handleOfferRoundChange(event) {
    currentRound = event.target.value;
    fetchData();
  }

  async function submitChanges() {
    const orderedItems = items.map((item) => {
      if (item && Object.keys(item).length > 0 && quantityValues.hasOwnProperty(item[itemKey])) {
        item.quantity = quantityValues[item[itemKey]];
      } else {
        item.quantity = 0;
      }
      return item;
    });

    try {
      await fetch(`${$BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderedItems,
          username: "user2",
          round: currentRound,
        }),
      });

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
        {#each items as item (item[itemKey])}
          <tr>
            {#each headerKeys as key (key)}
              <td>{item[key]}</td>
            {/each}
            <td>
              <input
                type="number"
                value={quantityValues[item[itemKey]] || item.quantity}
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
