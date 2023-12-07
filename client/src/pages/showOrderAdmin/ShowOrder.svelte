<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore.js";

  let currentRound = "";
  let list = [];
  let users = [];

  let orderedItems = [];
  let headerKeys = [];
  let itemKey = "";
  let currentName = "";
  let currentStaffNumber = "";

  onMount(async () => {
    const response = await fetch(`${$BASE_URL}/api/orders`, {
        credentials: "include"
      })
    const data = await response.json();
    list = data.data;
  });

 async function handleOfferRoundChange(event) {

  currentRound = event.target[event.target.selectedIndex].text;

  showSidebar = true;

    const response = await fetch(`${$BASE_URL}/api/orders/${currentRound}/users`, {
      credentials: "include",
    });
    
    const result = await response.json();
    users = result.data;
  }

  let showSidebar = false;

function toggleSidebar() {
  showSidebar = !showSidebar;
}



async function fetchOrderForUser(user) {
  showSidebar = false;
  currentName = user.name
  currentStaffNumber = user.staffNumber

  let response = await fetch(`${$BASE_URL}/api/orders/${currentRound}/${user.staffNumber}`, { credentials: "include" });

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

</script>


<style>
  @import './showOrder.css';
</style>

<h1>Find bestillinger</h1>

<label for="offerRound">Vælg bestillingsrunde</label>
<select
  id="offerRound"
  bind:value={currentRound}
  on:change={handleOfferRoundChange}
>
  {#each list as name, index (index)}
    <option value={index}>{name}</option>
  {/each}
</select>

{#if currentRound && users.length > 0}
<button class="show-members" style="left: {showSidebar ? '195px' : '0'};" on:click={toggleSidebar}>
  {#if !showSidebar} Vis medlemmer {/if}
  {#if showSidebar} Skjul medlemmer {/if}
</button>

<div class="sidebar {showSidebar ? 'show' : ''}">
  <h3>{currentRound}</h3>
  <h3>klik for ordre</h3>
    {#each users as user}
      <button class="person-link" on:click={() => fetchOrderForUser(user)}>
        <p>{user.staffNumber}</p>
        <p>{user.name}</p>
      </button>
    {/each}
</div>
{/if}

{#if orderedItems && orderedItems.length > 0}
<h3>Medlemsnummer: {currentStaffNumber}</h3>
<h3>Navn: {currentName}</h3>
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
            readonly
            type="number"
            value={item.quantity || 0}
            on:input={(event) => handleQuantityChange(item[itemKey], event)}
          />
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<!-- <button on:click={submitChanges}>Gem ændringer</button> -->
{/if}
