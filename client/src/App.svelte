<script>
  import {Router, Link, Route, navigate} from 'svelte-navigator';
  import ShowItems from './pages/ShowItems.svelte';
  import Home from "./pages/Home.svelte";
  import ShowItemsAdmin from './pages/ShowItemsAdmin.svelte';
</script>

<Router>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/ShowItems">Show items</Link>
    <Link to="/ShowItemsAdmin">Show items (Admin)</Link>
  </nav>
  <div>
    <Route path="/" component={Home}/>
    <Route path="/ShowItems" component={ShowItems}/>
    <Route path="/ShowItemsAdmin" component={ShowItemsAdmin}/>
  </div>

</Router>

