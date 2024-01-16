<script>terMessageSucces, topcenterMessageFail } from '../../components/toastr/toastrMessage.js';
  import { BASE_URL } from '../../stores/generalStore.js';
  
  let $BASE_URL;

  let name = '';
  let staffNumber = '';
  let email = '';

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${$BASE_URL}/auth/signup`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, staffNumber, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        topcenterMessageFail('Fejl: En bruger findes allerede med medarbejdernummer eller email');
      } else {
        topcenterMessageSucces('Brugeren er tilføjet');
        name = '';
        email = '';
        staffNumber = '';
      }
  } catch (error) {
      topcenterMessageFail(error.message);
      console.error(`Error: ${  error}`);
    }
  };
</script>

<style>
    @import "./addUser.css";
</style>

<div id="section-user">
  <h1>Tilføj en medarbejder</h1>

  <form on:submit={handleSubmit}>

    <label for="staffNumber">Medlemsnummer</label>
    <input type="text" id="staffNumber" bind:value={staffNumber} />

    <label for="name">Navn</label>
    <input type="text" id="name" bind:value={name} />

    <label for="email">Email</label>
    <input type="email" id="email" bind:value={email} />

    <button type="submit">Tilføj bruger</button>
  </form>
</div>

