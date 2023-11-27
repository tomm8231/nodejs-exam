<script>
  import { topcenterMessageSucces, topcenterMessageFail } from "../../components/toastr/toastrMessage.js";
  import { BASE_URL } from "../../stores/generalStore.js";

  let username = "";
  let membernumber = "";
  let email = "";
  let password = "";

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch($BASE_URL+"/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, membernumber, email, password }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      } else if (response.ok) {
        topcenterMessageSucces("Brugeren er tilføjet");
        username = "";
        email = "";
        password = "";
        membernumber = "";

      }

    } catch (error) {
      topcenterMessageFail(error.message);
      console.error("Error: " + error);
    }
  };
</script>

<style>
    @import "./addUser.css";
</style>

<section>
  <h1>Tilføj en medarbejder</h1>

  <form on:submit={handleSubmit}>

    <label for="membernumber">Medlemsnummer</label>
    <input type="text" id="membernumber" bind:value={membernumber} />

    <label for="username">Navn</label>
    <input type="text" id="username" bind:value={username} />

    <label for="email">Email</label>
    <input type="email" id="email" bind:value={email} />

    <label for="password">Password</label>
    <input type="password" id="password" bind:value={password} />

    <button type="submit">Tilføj bruger</button>
  </form>
</section>

