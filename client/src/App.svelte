<script>
  import { Router, Link, Route, navigate } from "svelte-navigator";
  import PrivateRoute from "./privateRouting/PrivateRoute.svelte";
  import ShowAvailableItemsUser from "./pages/ShowAvailableItemsUser/ShowAvailableItemsUser.svelte";
  import Home from "./pages/Home/Home.svelte";
  import FinishOrderAdmin from "./pages/FinishOrderAdmin/FinishOrderAdmin.svelte";
  import AddUser from "./pages/AddUser/AddUser.svelte";
  import Login from "./pages/Login/Login.svelte";
  import ShowUsers from "./pages/ShowUsers/ShowUsers.svelte";
  import { user } from "./stores/userStore.js";
  import ManageOrderAdmin from "./pages/ManageOrderAdmin/ManageOrderAdmin.svelte";
  import AddRound from "./pages/AddRound/AddRound.svelte";
  import { onMount } from "svelte";
  import { BASE_URL } from "./stores/generalStore.js";
  import MessagesAdmin from "./pages/MessagesAdmin/MessagesAdmin.svelte";
  import MessagesUser from "./pages/MessagesUser/MessagesUser.svelte";
  import UserInfo from "./pages/UserInfo/UserInfo.svelte";
  import DeleteRoundAdmin from "./pages/DeleteRound/DeleteRoundAdmin.svelte";

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

      if (!response.ok) {
        localStorage.removeItem("currentUserId");
        localStorage.removeItem("currentUserRole");
        navigate("/login", { replace: true });
      }

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
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("currentUserRole");

    try {
      const response = await fetch(`${BASE_URL}/auth/logout`);

      if (response.ok) {
        navigate("/");
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
        <div id="main-menu-box">
          <div class="dropdown">
            <button class="dropbtn"
              >Bestillingsrunder
              <i class="fa fa-caret-down" />
            </button>
            <div class="dropdown-content">
              <Link to="/opret-bestillingsrunde">Opret ny bestillingsrunde</Link>
              <Link to="/bestillingsrunde">Vis bestillingsrunde</Link>
              <Link to="/afslut-bestillingsrunde">Afslut bestillingsrunde</Link>
              <Link to="/slet-bestillingsrunde">Slet bestillingsrunde</Link>
            </div>
          </div>

          <div class="dropdown">
            <button class="dropbtn"
              >Brugere
              <i class="fa fa-caret-down" />
            </button>
            <div class="dropdown-content">
              <Link to="/opret-bruger">Opret bruger</Link>
              <Link to="/brugere">Vis/rediger brugere</Link>
            </div>
          </div>
          <Link to="/beskederAdmin">Opslagstavle</Link>
        </div>
        <div id="logout-box">
          <a href="/" on:click={logout}>Log ud</a>
        </div>
      </nav>
    {:else if $user && $user.role === "USER"}
      <nav>
        <div id="main-menu-box">
          <Link to="/bestil-varer">Bestil varer</Link>
          <Link to="/beskederBruger">Opslagstavle</Link>
          <Link to="/brugerInfo">Dine info</Link>
        </div>
        <div id="logout-box">
          <a href="/" on:click={logout}>Log ud</a>
        </div>
      </nav>
    {/if}
    <div class="content">
      <PrivateRoute path="/" let:location><Home /></PrivateRoute>
      <PrivateRoute path="/bestil-varer" let:location><ShowAvailableItemsUser /></PrivateRoute>
      <PrivateRoute path="/afslut-bestillingsrunde" let:location><FinishOrderAdmin /></PrivateRoute>
      <PrivateRoute path="/opret-bestillingsrunde" let:location><AddRound /></PrivateRoute>
      <PrivateRoute path="/opret-bruger" let:location><AddUser /></PrivateRoute>
      <PrivateRoute path="/brugere" let:location><ShowUsers /></PrivateRoute>
      <PrivateRoute path="/bestillingsrunde" let:location><ManageOrderAdmin /></PrivateRoute>
      <PrivateRoute path="/beskederAdmin" let:location><MessagesAdmin /></PrivateRoute>
      <PrivateRoute path="/beskederBruger" let:location><MessagesUser /></PrivateRoute>
      <PrivateRoute path="/brugerInfo" let:location><UserInfo /></PrivateRoute>
      <PrivateRoute path="/slet-bestillingsrunde" let:location><DeleteRoundAdmin /></PrivateRoute>
      <Route path="/login"><Login /></Route>
    </div>
  </div>
</Router>
