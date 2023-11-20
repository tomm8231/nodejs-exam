<script>
    import { onMount } from "svelte";
    import { BASE_URL } from "../stores/generalStore.js";

    let items = [];
    let headerKeys = [];
    let itemKey = "";
    let quantityValues = {};


    onMount( async () => {
        const response = await fetch(`${$BASE_URL}products/fjallraven_feb_24`);
        const result = await response.json();
        items = result.data

        headerKeys = items.length > 0 ? Object.keys(items[0]) : [];
    
        itemKey = items.length > 0 ? Object.keys(items[0])[0] : '';
    })

     
    function handleQuantityChange(sku, event) {
      const value = parseInt(event.target.value) || 0;
      quantityValues = {
        ...quantityValues,
        [sku]: value,
    };
      console.log(quantityValues);
    }
    
    async function submitChanges() {
      console.log(items[0]);
      const orderedItems = items.map((item) => {
        if (item && Object.keys(item).length > 0 && quantityValues.hasOwnProperty(item[itemKey])) {
          console.log(quantityValues[item[itemKey]]);
          item.quantity = quantityValues[item[itemKey]]
          console.log("Der er et antal");
        } else {
          item.quantity = 0
        }
        return item
      })

      console.log(orderedItems);
      /*
      const response = await fetch(`${$BASE_URL}orderedProducts`)

      console.log("Quantity Values:", quantityValues);
      */
    }
    </script>
    
    <main>
      <h1>List of Items</h1>
    
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
                  value={quantityValues[item[itemKey]] || ''}
                  on:input={(event) => handleQuantityChange(item[itemKey], event)}
                />
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    
      <button on:click={submitChanges}>Gem ændringer</button>
    </main>