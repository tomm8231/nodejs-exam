<script>
	export let showModal; // boolean
	export let selectedUser;

	let dialog; // HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal();

	$: if (dialog && !showModal) dialog.close();
</script>

<style>
	@import '../Modal/Modal.css';
</style>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<slot name="header" />
		<hr />
		<slot />
	</div>
</dialog>


