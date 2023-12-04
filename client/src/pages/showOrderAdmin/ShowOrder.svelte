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

  onMount(async () => {
    const response = await fetch("http://localhost:8080/api/orders");
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

  let response = await fetch(`${$BASE_URL}/api/orders/${currentRound}/${user.staffNumber}`);

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
  .sidebar {
    width: 200px;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #f4f4f4;
    transform: translateX(-100%);
    transition: transform 0.3s ease-out;
    padding-top: 70px;

  }

  .sidebar.show {
    transform: translateX(0);
  }

  .person-link {
    display: block;
    width: 100%;
    text-align: left;
    padding: 10px;
    margin: 5px 0;
    background-color: #f4f4f4;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    color: black;

  }

  .show-members{
    width: 20 px;
    text-align: center;
    padding: 10px;
    margin: 5px 0;
    background-color: #f4f4f4;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    color: black;
  }

  .person-link:hover {
    background-color: #e0e0e0;
  }

  .person-link p {
    margin: 0;
  }
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

<button class="show-members" on:click={toggleSidebar}>
  {#if !showSidebar} Vis medlemmer {/if}
  {#if showSidebar} Skjul medlemmer {/if}
</button>

<div class="sidebar {showSidebar ? 'show' : ''}">
  <h3>{currentRound}</h3>
  <h3>klik for ordre</h3>
    {#each users as user}
      <button class="person-link" on:click={() => fetchOrderForUser(user)}>
        <p>{user.staffNumber} - {user.name}</p>
      </button>
    {/each}
</div>
{/if}

{#if orderedItems && orderedItems.length > 0}
<h3>{currentRound}</h3>
<h3>{currentName}</h3>
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
