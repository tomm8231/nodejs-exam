<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore.js";

  let showAllOrders = [];
  let headerKeys = [];
  let itemKey = "";
  let quantityValues = {};
  let currentRound = "";

  onMount(async () => {
    await fetchData();
  });

  async function fetchData() {
    const response = await fetch(`${$BASE_URL}/api/orders/${currentRound}`);
    const result = await response.json();
    showAllOrders = result.data[0];
    // Works with aggregate:
    // showAllOrders = result.data[0].orderedItems;
    headerKeys = showAllOrders.length > 0 ? Object.keys(showAllOrders[0]) : [];
    headerKeys.shift()
    console.log(headerKeys)
    itemKey = showAllOrders.length > 0 ? Object.keys(showAllOrders[0])[0] : "";
  };

  // headerKeys = showAllOrders.length > 0 ? Object.keys(showAllOrders[0]) : [];
  // itemKey = showAllOrders.length > 0 ? Object.keys(showAllOrders[0])[0] : "";

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

  function printQuantities() {
    console.log("Quantity Values:", quantityValues);
  }
</script>

<style>
  @import './showItemsAdmin.css';
</style>

<main>
  <h1>Samlet ordre for bestilling {currentRound}</h1>

  <label for="offerRound">Select Offer Round:</label>
  <select id="offerRound" bind:value={currentRound} on:change={handleOfferRoundChange}>
    <option value="fjallraven_feb_24">Fjallraven Feb 24</option>
    <option value="s2s_oct_24">Sea to Summit Nov 24</option>
  </select>

  
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
         </tr
        >
      {/each}
    </tbody>
  </table>

  <!-- <button on:click={printQuantities}>Print Quantities</button> -->
</main>
