<script>

  export let logo, progress, progressColor

  import Icon from '@iconify/svelte';

</script>

<div class="skill">
  <a href="/">
    <Icon icon={logo} color="#5E687E" height="28" />
  </a>
  <div class="progress-bar">
    <div style="background-color: {progressColor}; width: {progress}%;" class="progress"></div>
  </div>
</div>

<style>
  a {
    display: flex;
    align-items: center;
  }

  .skill {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 92px;
  }

  .progress-bar {
    height: 6px;
    width: 60px;
    border-radius: 5px;
    border-color: #5E687E;
    border: solid 2px;
  }

  .progress {
    height: 100%;
    border-radius: 5px;
  }
</style>