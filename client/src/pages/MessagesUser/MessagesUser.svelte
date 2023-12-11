<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/generalStore.js";
  import { io } from "socket.io-client";
  import { topcenterMessageSucces } from "../../components/toastr/toastrMessage.js";

  const socket = io($BASE_URL);

  let round = "";
  let message = "";
  let uniqueRounds = [];
  let currentRound = "";
  let messages = [];


  onMount(async () => {
    const response = await fetch(`${$BASE_URL}/api/rounds`, {
      credentials: "include",
    });
    const data = await response.json();
    uniqueRounds = data.data;

    const messagesPromise = await fetch(`${$BASE_URL}/api/messages`, {
      credentials: "include",
    });

    const messagesResult = await messagesPromise.json();
    messages = messagesResult.data;
    console.log(messages);
  });

  socket.on("server-admin-message", (data) => {
    console.log(data);
    messages = [...messages, data]
  });
</script>
