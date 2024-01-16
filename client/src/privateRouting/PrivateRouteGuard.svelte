<script>Location } from 'svelte-navigator'
    import { user } from '../stores/userStore.js'
    
    let $location;let $user;

    const navigate = useNavigate();
    const location = useLocation();

    $: if (!$user) {
      navigate('/login', {
        state: { from: $location.pathname },
        replace: true,
      });
    }
</script>
  
  {#if $user}
    <slot />
  {/if}
  