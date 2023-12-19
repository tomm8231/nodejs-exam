<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore.js";
  import {
    topcenterMessageSucces,
    topcenterMessageFail,
  } from "../../components/toastr/toastrMessage.js";
  import Modal from "../../components/Modal/Modal.svelte";

  let users = [];
  let userOrders = [];
  let headerKeys = [];
  let itemKey = "";
  let showModal = false;
  let showDeleteConfirmationModal = false;
  let selectedUser = { staffnumber: "", name: "", email: "" };

  onMount(async () => {
    fetchUsers();
  });

  async function fetchUsers() {
    try {
      const response = await fetch("http://localhost:8080/api/users", { credentials: "include" });
      const data = await response.json();
      users = data.data;
    } catch (error) {
      console.error("Error: " + error);
    }
  }

  function openDeleteConfirmationModal(user) {
    selectedUser = user;
    showDeleteConfirmationModal = true;
  }

  async function deleteUser(evt) {
    let staffNumber = evt.target.id;

    const user = users.find(u => u.staffNumber === staffNumber);
    if (user) {
      openDeleteConfirmationModal(user);
    }

  }

  async function confirmDeleteUser() {
    const staffNumber = selectedUser.staffNumber
    
    try {
      const response = await fetch($BASE_URL + "/api/users/" + staffNumber, {
        credentials: "include",
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        topcenterMessageSucces("Brugeren er slettet");
        showDeleteConfirmationModal = false
      } else if (data.error) {
        throw new Error(data.error);
      }

      users = users.filter(user => {
        return user.staffNumber !== staffNumber
      });

      const deleteOrders = await fetch($BASE_URL + "/api/orders/", {
        credentials: "include",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffNumber,
        }),
      }); 

      const deletionData = await deleteOrders.json();

      if (deletionData.error) {
        throw new Error(data.error);
      }
     
    } catch (error) {
      topcenterMessageFail(error.message);
      console.error("Error: " + error);
    }

    showDeleteConfirmationModal = false;
  }

  async function updateFrontendUser(){
    users = users.map(user => {
      if(user.staffNumber === selectedUser.staffNumber){
        user.name = selectedUser.name;
        user.email = selectedUser.email;
      }
      return user;
    })
  }

  async function updateUser(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${$BASE_URL}/api/users/${selectedUser.staffNumber}`, {
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: selectedUser.name,
          email: selectedUser.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        topcenterMessageSucces("Brugeren er opdateret");
        updateFrontendUser();
        showModal = false;
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      topcenterMessageFail(error.message);
      console.error("Error: " + error);
    }
  }

  async function newPassword(event) {
    event.preventDefault();
    const response = await fetch(`${$BASE_URL}/api/users/resetpassword`, {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        staffNumber: selectedUser.staffNumber,
      }),
    });
    
    if (response.ok){
      topcenterMessageSucces("Password er opdateret");
      showModal = false;
    } else {
      topcenterMessageFail("Password kunne ikke opdateres");
    }
  }

  function openModal(user) {
    selectedUser = user;
    showModal = true;
  }
</script>

<h1>Brugere i systemet</h1>

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
          <td><button id="{user.staffNumber}" on:click={deleteUser}>Slet</button></td>
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
      <input type="text" id="email" name="email" bind:value={selectedUser.email} />

      <button on:click={updateUser}>Opdater bruger</button>
    </form>
    <hr />
    <div class="button-container">
      <button on:click={newPassword}>Send bruger nyt password</button>
    </div>
  </Modal>


  <Modal bind:showModal={showDeleteConfirmationModal} bind:selectedUser>
    <h2>Slet bruger</h2>
    <p>{selectedUser.name}, {selectedUser.staffNumber}?</p>
    <button on:click={confirmDeleteUser}>Slet</button>
    <button on:click={() => showDeleteConfirmationModal = false}>Annuler</button>
  </Modal>
</main>

<style>
  @import "./showUsers.css";
</style>
