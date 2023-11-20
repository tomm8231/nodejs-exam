<script>
    import {Router, Link, Route, navigate} from 'svelte-navigator'
    import ShowItems from './pages/ShowItems.svelte'
    import Home from "./pages/Home.svelte";
</script>

<Router>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/ShowItems">Show items</Link>
  </nav>
  <div>
    <Route path="/" component={Home}/>
    <Route path="/ShowItems" component={ShowItems}/>
  </div>

</Router>

