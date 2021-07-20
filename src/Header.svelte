<script>

  import Icon from '@iconify/svelte';
  import menuLeft from '@iconify/icons-gg/menu-left';
  import bxsMoon from '@iconify/icons-bx/bxs-moon';

</script>

<header>
  <Icon icon={menuLeft} width='34' color="#0097E6" />
  <Icon icon={bxsMoon} width='30' color="#5E687E" />
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    margin: 12px
  }
</style>