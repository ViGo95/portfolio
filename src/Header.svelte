<script>
  export let mainColor

  let flag = 'images/VEN_Flag.svg'
  let logo = 'images/Logo.svg'
</script>

<header style="--theme-color: {mainColor}">
  <img src={flag} alt="Flag" width="38">

  <nav>
    <a href="/">Skills</a>
    <a href="/">About me</a>
    <img src={logo} alt="Logo" width="58px" height="51.5px">
    <a href="/">Projects</a>
    <a href="/">Contact</a>
  </nav>

  <button>
    <div></div>
  </button>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 18px ;
  }

  a {
    text-decoration: none;
    color: var(--theme-color);
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style-type: none;
    width: 32.5%;
  }

  button {
    padding: 4px;
    margin: 0;
    display: flex;
    align-items: center;
    width: 38px;
    height: 22px;
    border-radius: 70px;
    background-color: var(--theme-color);
  }

  button > div {
    width: 14px;
    height: 14px;
    background: white;
    border-radius: 100%;
  }
</style>