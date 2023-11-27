<script>
  import {Router, Link, Route, navigate} from 'svelte-navigator';
  import ShowItems from './pages/ShowItems/ShowItems.svelte';
  import Home from "./pages/Home.svelte";
  import ShowItemsAdmin from './pages/ShowItemsAdmin/ShowItemsAdmin.svelte';
  import AddUser from './pages/addUser/AddUser.svelte';
  import ShowUsers from './pages/showUsers/showUsers.svelte';
  import ShowOrder from './pages/showOrderAdmin/ShowOrder.svelte';  
</script>

<Router>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/ShowItems">Show items</Link>
    <Link to="/ShowItemsAdmin">Show items (Admin)</Link>
    <Link to="/adduser">Tilføj bruger (Admin)</Link>
    <Link to="/showusers">Vis brugere (Admin)</Link>
    <Link to="/showorder">Vis ordre / test (Admin)</Link>
  </nav>
  <div>
    <Route path="/" component={Home}/>
    <Route path="/ShowItems" component={ShowItems}/>
    <Route path="/ShowItemsAdmin" component={ShowItemsAdmin}/>
    <Route path="/adduser" component={AddUser}/>
    <Route path="/showusers" component={ShowUsers}/>
    <Route path="/showorder" component={ShowOrder}/>
  </div>

</Router>

