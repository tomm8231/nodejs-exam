<script>
  import { BASE_URL } from "../../stores/generalStore";
  import { useNavigate, useLocation } from "svelte-navigator";
  import { user } from "../../stores/userStore.js";
  import { topcenterMessageFail } from "../../components/toastr/toastrMessage";
  const navigate = useNavigate();
  const location = useLocation();

  let staffNumber = ""
  let password = ""

  async function handleLogin(event) {
    event.preventDefault()
    try {
        const response = await fetch(`${$BASE_URL}/auth/login`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ staffNumber, password }),
      });

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("currentUserId", data.userData.uid)
        localStorage.setItem("currentUserRole", data.userData.role)

        $user = data.userData

        const from = ($location.state && $location.state.from) || "/"
        navigate(from, { replace: true })
      } else {
        topcenterMessageFail("Login failed")
      }
    } catch (err) {
      console.log("err: " + err);
    }
  }
</script>

<h1>Login</h1>

<form on:submit={(event) => handleLogin(event)}>

    <label for="staffNumber">Medarbejdernummer</label>
    <input type="text" id="staffNumber" bind:value={staffNumber} />

    <label for="password">Password</label>
    <input type="password" id="password" bind:value={password} />

    <button type="submit">Login</button>
  </form>

