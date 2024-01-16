<script>
    import { onMount } from "svelte";
    import { BASE_URL } from "../../stores/generalStore.js";
    import { user } from "../../stores/userStore.js";
    import Modal from "../../components/Modal/Modal.svelte";
    import { topcenterMessageSucces, topcenterMessageFail } from "../../components/toastr/toastrMessage.js";

    let selectedUser = {};
    $: showModal = false;

    onMount(async () => {
        const response = await fetch(`${$BASE_URL}/api/users/${$user.uid}`, {
            credentials: "include",
        });

        const data = await response.json();
        selectedUser = data.data;
    });

    async function updatePassword(event) {
        event.preventDefault();
        if (event.target.newPassword.value !== event.target.repeatNewPassword.value) {
            topcenterMessageFail("Nye password matcher ikke");
        } else {
            const response = await fetch(`${$BASE_URL}/api/users/password`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    oldPassWord: event.target.oldPassword.value,
                    newPassWord: event.target.newPassword.value,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                topcenterMessageFail("Fejl: " + data.message + "");
            } else {
                topcenterMessageSucces("Password er opdateret");
                event.target.reset();
                showModal = false;
            }
        }
    }
</script>

<style>
    @import './userInfo.css';
</style>

<h1>Dine registrede info</h1>

<div class="container">
    <label class="label" for="name"><strong>Navn:</strong></label>
    <input class="input" type="text" id="name" value="{selectedUser.name}" readonly>

    <label class="label" for="email"><strong>Email:</strong></label>
    <input class="input" type="email" id="email" value="{selectedUser.email}" readonly>

    <label class="label" for="staffNumber"><strong>Medarbejdernummer:</strong></label>
    <input class="input" type="text" id="staffNumber" value="{selectedUser.staffNumber}" readonly>

    <button class="change-password" on:click={() => showModal = true}>Ændre kodeord</button>
</div>

<Modal bind:showModal bind:selectedUser>
    <form on:submit={updatePassword}>
        <label for="oldPassword">Nuværende password</label>
        <input type="password" id="oldPassword"  name="password" />
        
        <label for="newPassword">nyt password</label>
        <input type="password" id="newPassword" name="password" />

        <label for="repeatNewPassword">Gentag nyt password</label>
        <input type="password" id="repeatOldPassword" name="password" />


        <button >Opdater password</button>
        <hr />
		<!-- svelte-ignore a11y-autofocus -->
		<button autofocus on:click={() => showModal = false}>Luk</button>
    </form>
</Modal>
    

  



