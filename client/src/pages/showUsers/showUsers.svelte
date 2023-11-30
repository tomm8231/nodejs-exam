<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore.js";
  import {
    topcenterMessageSucces,
    topcenterMessageFail,
  } from "../../components/toastr/toastrMessage.js";
  import { navigate } from "svelte-navigator";

  let users = [];
  let selectedUserId = null;
  let userOrders = [];
  let currentRound = ""
  let headerKeys = []
  let itemKey = ""

  onMount(async () => {
    try {
      const response = await fetch($BASE_URL + "/api/users");
      const data = await response.json();
      users = data.data;
    } catch (error) {
      console.error("Error: " + error);
    }
  });

  async function fetchUserOrders(userId) {
    try {
      const response = await fetch($BASE_URL + `/api/orders/${currentRound}/${userId}`);
      const data = await response.json();
      userOrders = data.data;

      selectedUserId = userId

      headerKeys = userOrders.length > 0 ? Object.keys(userOrders[0]) : [];
      headerKeys.shift(); // removes/hides the _id from the user
      itemKey = userOrders.length > 0 ? Object.keys(userOrders[0])[0] : "";
  
    } catch (error) {
      console.error("Error fetching user orders: " + error);
    }
  }

  async function showOrders(userId) {
    selectedUserId = userId;
    await fetchUserOrders(selectedUserId);
  }

  async function deleteUser(evt) {
    let id = evt.target.id;
    //removeing the first character from the id so it does not start with a $
    id = id.substring(1);

    try {
      const response = await fetch($BASE_URL + "/api/users/" + id, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        topcenterMessageSucces("Brugeren er slettet");
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      topcenterMessageFail(error.message);
      console.error("Error: " + error);
    }
  }

  function handleOfferRoundChange(event) {
    currentRound = event.target.value;
    fetchUserOrders(selectedUserId);
  }
</script>

<style>
  @import '../ShowItemsAdmin/showItemsAdmin.css';
</style>


<h1>Bruger i systemet</h1>

<!-- <section>
  <table>
    <thead>
      <tr>
        <th>Medlemsnummer</th>
        <th>Navn</th>
        <th>Email</th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each users as user}
        <tr>
          <td>{user.staffNumber}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td><button>Rediger</button></td>
          <td><button id="${user._id}" on:click={deleteUser}>Slet</button></td>
          <td><button on:click={showOrders}>Vis ordre</button></td>
        </tr>
      {/each}
    </tbody>
  </table>
</section> -->

<main>
  <table>
    <thead>
      <tr>
        <th>Medlemsnummer</th>
        <th>Navn</th>
        <th>Email</th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each users as user}
        <tr>
          <td>{user.staffNumber}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td><button>Rediger</button></td>
          <td><button id="${user._id}" on:click={deleteUser}>Slet</button></td>
          <td><button on:click={() => showOrders(user.staffNumber)}>Vis ordre</button></td>
        </tr>
      {/each}
    </tbody>
  </table>

  <label for="offerRound">Vælg bestillingsrunde</label>
  <select
    id="offerRound"
    bind:value={currentRound}
    on:change={handleOfferRoundChange}
  >
    <option value="fjallraven_feb_24">Fjallraven Feb 24</option>
    <option value="s2s_oct_24">Sea to Summit okt 24</option>
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
      {#each userOrders as item (item[itemKey])}
        <tr>
          {#each headerKeys as key (key)}
            <td>{item[key]}</td>
          {/each}
         </tr>
      {/each}
    </tbody>
  </table>
</main>
