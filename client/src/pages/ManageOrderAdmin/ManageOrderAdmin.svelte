<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore.js";

  let currentRound = "";
  let uniqueRounds = [];
  let users = [];

  let orderedItems = [];
  let headerKeys = [];
  let itemKey = "";
  let currentName = "";
  let currentStaffNumber = "";

  let filteredUsers;
  let searchQuery = ""


  onMount(async () => {
    const response = await fetch(`${$BASE_URL}/api/rounds`, {
        credentials: "include"
      })
    const data = await response.json();
    uniqueRounds = data.data
  });
 
 async function handleOfferRoundChange(event) {

  currentRound = event.target[event.target.selectedIndex].text;

  orderedItems = []


  showSidebar = true;

    const response = await fetch(`${$BASE_URL}/api/orders/${currentRound}/users`, {
      credentials: "include",
    });
    
    const result = await response.json();
    users = result.data;

    filteredUsers = users
  }

  let showSidebar = false;

function toggleSidebar() {
  showSidebar = !showSidebar;
}


function handleSearchChange(event) {
    searchQuery = event.target.value.toLowerCase();
    filterUsers();
  }

  function filterUsers() {
  if (searchQuery.trim() === "") {
    filteredUsers = users;
  } else {
    filteredUsers = users.filter(user =>
      user.staffNumber.toLowerCase().includes(searchQuery) ||
      user.name.toLowerCase().includes(searchQuery)
    );
  }
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
  @import './manageOrderAdmin.css';
</style>

<h1>Find bestillinger</h1>

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

{#if currentRound && users.length > 0}
<button class="show-members" style="left: {showSidebar ? '195px' : '0'};" on:click={toggleSidebar}>
  {#if !showSidebar} Vis medlemmer {/if}
  {#if showSidebar} Skjul medlemmer {/if}
</button>

<div class="sidebar {showSidebar ? 'show' : ''}">
  <h3>{currentRound}</h3>
  <h3>klik for ordre</h3>

  <input type="text" placeholder="Søg efter bruger" bind:value={searchQuery} on:input={handleSearchChange} />

  {#each filteredUsers as user}
    <button class="person-link" on:click={() => fetchOrderForUser(user)}>
      <p>{user.staffNumber}</p>
      <p>{user.name}</p>
    </button>
  {/each}
</div>
{/if}

{#if currentRound}
<h3>Runde: {currentRound}</h3>
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
{:else}
<!-- <button on:click={submitChanges}>Gem ændringer</button> -->
{/if}
