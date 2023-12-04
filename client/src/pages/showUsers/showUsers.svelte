<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore.js";
  import {
    topcenterMessageSucces,
    topcenterMessageFail,
  } from "../../components/toastr/toastrMessage.js";
  import { navigate } from "svelte-navigator";
  import Modal from "../../components/Modal/Modal.svelte";

  let users = [];
  let userOrders = [];
  let headerKeys = [];
  let itemKey = "";
  let showModal = false;
  let selectedUser = { staffnumber: "", name: "", email: "" };

  onMount(async () => {
    try {
      const response = await fetch($BASE_URL + "/api/users");
      const data = await response.json();
      users = data.data;
    } catch (error) {
      console.error("Error: " + error);
    }
  });

  function updateUser(event) {
    event.preventDefault();
    topcenterMessageSucces("Brugeren er opdateret");
  }

  function updatePassword(event) {
    event.preventDefault();
    topcenterMessageSucces("Password er opdateret");
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

      users = users.filter(user => user._id !== id);


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

  function openModal(user) {
    selectedUser = user;
    showModal = true;
  }
</script>

<h1>Bruger i systemet</h1>

<main>
  <table>
    <thead>
      <tr>
        <th>Medlemsnummer</th>
        <th>Navn</th>
        <th>Email</th>
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
          <td><button on:click={() => openModal(user)}>Rediger</button></td>
          <td><button id="${user._id}" on:click={deleteUser}>Slet</button></td>
        </tr>
      {/each}
    </tbody>
  </table>

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

  <Modal bind:showModal bind:selectedUser>
    <h1>Rediger bruger</h1>
    <form>
      <label for="staffNumber">Medlemsnummer</label>
      <input type="text" id="staffNumber" name="staffNumber" bind:value={selectedUser.staffNumber} readonly/>

      <label for="name">Navn</label>
      <input type="text" id="name" name="name" bind:value={selectedUser.name} />

      <label for="email">Email</label>
      <input type="text" id="email" name="email" value={selectedUser.email} />

      <button on:click={updateUser}>Opdater bruger</button>
    </form>
    <hr />
    <form>
      <label for="password">Password</label>
      <input type="text" id="password" name="password" />

      <button on:click={updatePassword}>Opdater password</button>
    </form>
  </Modal>
</main>

<style>
  @import "../ShowItemsAdmin/showItemsAdmin.css";
</style>
