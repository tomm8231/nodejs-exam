<script>
  import { onMount } from "svelte";

    let list = []
    onMount ( async () => {
        const response = await fetch("http://localhost:8080/api/orders")
        const data = await response.json()
        list = data.data
    })

    
  // function handleOfferRoundChange(event) {
  //   currentRound = event.target.value;
  //   fetchUserOrders(selectedUserId);
  // }


</script>

<h1> Liste over rounds osv</h1>

<label for="offerRound">Vælg bestillingsrunde</label>
<select
  id="offerRound"

>
  <option value="fjallraven_feb_24">Fjallraven Feb 24</option>
  <option value="s2s_oct_24">Sea to Summit okt 24</option>
</select>