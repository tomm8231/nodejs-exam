<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore";

    let list = []
    onMount ( async () => {
        const response = await fetch(`${$BASE_URL}/api/orders`, {
        credentials: "include"
      })
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