<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore.js";

  let currentRound = "";
  let list = [];
  let users = [];

  onMount(async () => {
    const response = await fetch("http://localhost:8080/api/orders");
    const data = await response.json();
    list = data.data;
  });

 async function handleOfferRoundChange(event) {
  currentRound = event.target[event.target.selectedIndex].text;

    const response = await fetch(`${$BASE_URL}/api/orders/${currentRound}/users`, {
      credentials: "include",
    });
    
    const result = await response.json();
    users = result.data;

  }
</script>

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

<main>
  {#if currentRound && users.length > 0}
    <main>
      <h1>{currentRound}</h1>
      <table>
        <thead>
          <tr>
            <th>Medlemsnummer</th>
            <th>Navn</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each users as user}
            <tr>
              <td>{user.staffNumber}</td>
              <td>{user.name}</td>
              <td>vis Ordre</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </main>
  {/if}
  <!-- <button on:click={printQuantities}>Print Quantities</button> -->
</main>
