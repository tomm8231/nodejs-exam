<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore.js";

  let items = [];
  let headerKeys = [];
  let itemKey = "";
  let quantityValues = {};

  onMount(async () => {
    const response = await fetch(`${$BASE_URL}/api/products/fjallraven_feb_24`);
    const result = await response.json();
    items = result.data;

    headerKeys = items.length > 0 ? Object.keys(items[0]) : [];
    headerKeys.shift() // removes/hides the _id from the user
    itemKey = items.length > 0 ? Object.keys(items[0])[0] : "";
  });

  function handleQuantityChange(sku, event) {
    const value = parseInt(event.target.value) || 0;
    quantityValues = {
      ...quantityValues,
      [sku]: value,
    };
  }

  async function submitChanges() {
    const orderedItems = items.map((item) => {
      if (
        item &&
        Object.keys(item).length > 0 &&
        quantityValues.hasOwnProperty(item[itemKey])
      ) {
        item.quantity = quantityValues[item[itemKey]];
      } else {
        item.quantity = 0;
      }
      return item;
    });

    try {
      const response = await fetch(`${$BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderedItems,
          username: "user1",
          round: "fjallraven_feb_24"
        }),
      });

      //Toastr
    } catch (error) {
      console.error("Error: " + error);
      //Toastr
    }
  }
</script>
<style>
  @import './showItems.css';
</style>

<main>
  <h1>Din bestellings seddel for PLACEHOLDER</h1>

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
              value={quantityValues[item[itemKey]] || ""}
              on:input={(event) => handleQuantityChange(item[itemKey], event)}
            />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <button on:click={submitChanges}>Gem ændringer</button>
</main>
