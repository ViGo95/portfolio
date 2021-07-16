<script>
  export let mainColor

  let arco = 'images/arco.svg'
  let photo = 'image/photo.svg'
</script>

<main style="--theme-color: {mainColor}">
  <a href="/">Web Developer</a>
  <img src="{arco}" alt="">
  <a href="/">Network Admin</a>
</main>

<style>
  * {
    color: var(--theme-color);
  }

  main {
    display: flex;
    justify-content: space-between;
    height: 50%;
    padding: 0 62px;
  }

  a {
    text-decoration: none;
    color: var(--theme-color);
    font-style: normal;
    font-size: 35px;
    height: 50px;
  }

  img {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: 0;
  }
</style>