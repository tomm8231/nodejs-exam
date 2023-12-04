<script>
  import { Router, Link, Route, navigate } from "svelte-navigator";
  import PrivateRoute from "./privateRouting/PrivateRoute.svelte";
  import ShowItems from "./pages/ShowItems/ShowItems.svelte";
  import Home from "./pages/Home.svelte";
  import ShowItemsAdmin from "./pages/ShowItemsAdmin/ShowItemsAdmin.svelte";
  import AddUser from "./pages/AddUser/AddUser.svelte";
  import Login from "./pages/Login/Login.svelte";
  import ShowUsers from "./pages/ShowUsers/showUsers.svelte";
  import { user } from "./stores/userStore.js";
  import ShowOrder from "./pages/ShowOrderAdmin/ShowOrder.svelte";
  import { onMount } from "svelte";
  import { BASE_URL } from "./stores/generalStore.js";

  let userSession = null;
  let currentUserId = localStorage.getItem("currentUserId");

  onMount(async () => {
    try {
      const response = await fetch(`${$BASE_URL}/auth/validateSession`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserId
        }),
      });
      
    } catch (error) {
      console.error("Could not fetch:", error);
    }

    if (
      localStorage.getItem("currentUserId") &&
      localStorage.getItem("currentUserRole")
    ) {
      const uid = localStorage.getItem("currentUserId");
      const role = localStorage.getItem("currentUserRole");

      $user = { uid, role };

      navigate("/", { replace: true })
    }
  });

  async function logout() {
    // Perform logout logic here
    // For example, clear user data from localStorage and navigate to the login page

    localStorage.removeItem("currentUserId");
    localStorage.removeItem("currentUserRole");

    try {
      const response = await fetch(`${BASE_URL}/auth/logout`)

      if (response.ok) {
        navigate("/");

        console.log("Logout sucessful")
      }
    } catch(error) {
      console.log("Could not logout:", error)
    }


  }
</script>

<Router>
  <div id="app">
    {#if $user && $user.role === "ADMIN"}
      <nav>
        <Link to="/">Home</Link>
        <Link to="/ShowItemsAdmin">Show items (Admin)</Link>
        <Link to="/adduser">Tilføj bruger (Admin)</Link>
        <Link to="/showusers">Vis brugere (Admin)</Link>
        <Link to="/showorderadmin">Vis ordre (Admin)</Link>
        <a href="/" on:click={logout}>Log ud</a>
      </nav>
    {:else if $user && $user.role === "USER"}
      <nav>
        <Link to="/">Home</Link>
        <Link to="/ShowItems">Show items</Link>
        <a href="/" on:click={logout}>Log ud</a>
      </nav>
    {/if}
    <div class="content">
      <PrivateRoute path="/" let:location><Home /></PrivateRoute>
      <PrivateRoute path="/ShowItems" let:location><ShowItems /></PrivateRoute>
      <PrivateRoute path="/ShowItemsAdmin" let:location
        ><ShowItemsAdmin /></PrivateRoute
      >
      <PrivateRoute path="/adduser" let:location><AddUser /></PrivateRoute>
      <PrivateRoute path="/showusers" let:location><ShowUsers /></PrivateRoute>
      <PrivateRoute path="/showorderadmin" let:location
        ><ShowOrder /></PrivateRoute
      >
      <Route path="/login"><Login /></Route>
    </div>
  </div>
</Router>
