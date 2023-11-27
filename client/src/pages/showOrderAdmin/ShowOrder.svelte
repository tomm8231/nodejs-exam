<script>
  import { onMount } from "svelte";

    let list = []
    onMount ( async () => {
        const response = await fetch("http://localhost:8080/api/orders")
        const data = await response.json()
        list = data.data
    })

</script>

<h1> Liste over rounds osv</h1>