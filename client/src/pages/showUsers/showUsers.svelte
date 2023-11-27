<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore.js";
  import {
    topcenterMessageSucces,
    topcenterMessageFail,
  } from "../../components/toastr/toastrMessage.js";
  import { navigate } from "svelte-navigator";

  let users = [];

  onMount(async () => {
    try {
      const response = await fetch($BASE_URL + "/api/users");
      const data = await response.json();
      users = data.data;
    } catch (error) {
      console.error("Error: " + error);
    }
  });

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
</script>

<h1>Bruger i systemet</h1>

<section>
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
          <td><button >Vis ordre</button></td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>

<style>
</style>
