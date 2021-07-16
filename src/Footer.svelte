<script>
  export let mainColor

  let github = 'images/github.svg'
  let linkedin = 'images/linkedin.svg'
  let instagram = 'images/instagram.svg'
  let twitter = 'images/twitter.svg'
  let mail = 'images/mail.svg'
</script>

<footer style="--theme-color: {mainColor}">
  <div>
    <a href="/"><img src={github} alt=""></a>
    <a href="/"><img src={linkedin} alt=""></a>
    <a href="/"><img src={twitter} alt=""></a>
    <a href="/"><img src={instagram} alt=""></a>
  </div>

  <button>
    <img src={mail} alt="">
  </button>
</footer>

<style>
  footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 11px 21px;
  }

  div {
    display: flex;
    justify-content: space-between;
    width: 160px;
  }

  a {
    width: 25px;
    height: 25px;
  }

  a > img {
    width: 25px;
    height: 25px;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 45px;
    height: 45px;
    border-radius: 100%;
    background: var(--theme-color);
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.50);
    border: none;
    margin: 0;
  }

  button > img {
    width: 28px;
    height: 28px;
  }
</style>