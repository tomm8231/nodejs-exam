<script>
  import { Router, Link, Route, navigate } from "svelte-navigator";
  import PrivateRoute from "./privateRouting/PrivateRoute.svelte";
  import ShowAvailableItemsUser from "./pages/ShowAvailableItemsUser/ShowAvailableItemsUser.svelte";
  import Home from "./pages/Home.svelte";
  import FinishOrderAdmin from "./pages/FinishOrderAdmin/FinishOrderAdmin.svelte";
  import AddUser from "./pages/AddUser/AddUser.svelte";
  import Login from "./pages/Login/Login.svelte";
  import ShowUsers from "./pages/ShowUsers/ShowUsers.svelte";
  import { user } from "./stores/userStore.js";
  import ManageOrderAdmin from "./pages/ManageOrderAdmin/ManageOrderAdmin.svelte";
  import AddRound from "./pages/AddRound/AddRound.svelte";
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
          currentUserId,
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

      navigate("/", { replace: true });
    }
  });

  async function logout() {
    // Perform logout logic here
    // For example, clear user data from localStorage and navigate to the login page

    localStorage.removeItem("currentUserId");
    localStorage.removeItem("currentUserRole");

    try {
      const response = await fetch(`${BASE_URL}/auth/logout`);

      if (response.ok) {
        navigate("/");

        console.log("Logout sucessful");
      }
    } catch (error) {
      console.log("Could not logout:", error);
    }
  }
</script>

<Router>
  <div id="app">
    {#if $user && $user.role === "ADMIN"}
      <nav>
        <Link to="/afslut-ordre">Afslut ordrer</Link>
        <Link to="/opret-bestillingsrunde">Opret ny bestillingsrunde</Link>
        <Link to="/opret-bruger">Opret bruger</Link>
        <Link to="/brugere">Vis/rediger brugere</Link>
        <Link to="/ordrer">Vis/rediger ordrer</Link>
        <a href="/" on:click={logout}>Log ud</a>
      </nav>
    {:else if $user && $user.role === "USER"}
      <nav>
        <Link to="/">Home</Link>
        <Link to="/bestil-varer">Bestil varer</Link>
        <a href="/" on:click={logout}>Log ud</a>
      </nav>
    {/if}
    <div class="content">
      <PrivateRoute path="/" let:location><Home /></PrivateRoute>
      <PrivateRoute path="/bestil-varer" let:location><ShowAvailableItemsUser /></PrivateRoute>
      <PrivateRoute path="/afslut-ordre" let:location><FinishOrderAdmin /></PrivateRoute>
      <PrivateRoute path="/opret-bestillingsrunde" let:location><AddRound /></PrivateRoute>
      <PrivateRoute path="/opret-bruger" let:location><AddUser /></PrivateRoute>
      <PrivateRoute path="/brugere" let:location><ShowUsers /></PrivateRoute>
      <PrivateRoute path="/ordrer" let:location><ManageOrderAdmin /></PrivateRoute>
      <Route path="/login"><Login /></Route>
    </div>
  </div>
</Router>
