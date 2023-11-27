<script>
  import {Router, Link, Route, navigate} from 'svelte-navigator';
  import PrivateRoute from './privateRouting/PrivateRoute.svelte';
  import ShowItems from './pages/ShowItems/ShowItems.svelte';
  import Home from "./pages/Home.svelte";
  import ShowItemsAdmin from './pages/ShowItemsAdmin/ShowItemsAdmin.svelte';
  import AddUser from './pages/AddUser/AddUser.svelte';
  import Login from "./pages/Login/Login.svelte"
  import ShowUsers from './pages/ShowUsers/showUsers.svelte';
  import { user } from './stores/userStore.js'
  import ShowOrder from './pages/showOrderAdmin/ShowOrder.svelte';  
  import { onMount } from 'svelte';

  onMount(async () => {
    const currentUserLocalStorage =localStorage.getItem("currentUser");
    if (currentUserLocalStorage) {

      const uid = localStorage.getItem("currentUserId")
      const role =  localStorage.getItem("currentUserRole")

      $user =  {uid, role}
    }
  })
</script>

<Router>
  <nav>
    {#if $user}
    <Link to="/">Home</Link>
    <Link to="/ShowItems">Show items</Link>
    <Link to="/ShowItemsAdmin">Show items (Admin)</Link>
    <Link to="/adduser">Tilføj bruger (Admin)</Link>
    <Link to="/showusers">Vis brugere (Admin)</Link>
    <Link to="/showorderadmin">Vis ordre (Admin)</Link>
    {/if}
  </nav>
  <div>
    <PrivateRoute path="/" let:location><Home /></PrivateRoute>
    <PrivateRoute path="/ShowItems" let:location><ShowItems /></PrivateRoute>
    <PrivateRoute path="/ShowItemsAdmin" let:location><ShowItemsAdmin /></PrivateRoute>
    <PrivateRoute path="/adduser" let:location><AddUser /></PrivateRoute>
    <PrivateRoute path="/showusers" let:location><ShowUsers /></PrivateRoute>
    <PrivateRoute path="/showorderadmin" let:location><ShowItemsAdmin /></PrivateRoute>
    <Route path="/login"><Login /></Route>
  </div>

</Router>

