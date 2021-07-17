<script>
  import Message from "./Message.svelte";

  export let mainColor

  let github = 'images/github.svg'
  let linkedin = 'images/linkedin.svg'
  let instagram = 'images/instagram.svg'
  let twitter = 'images/twitter.svg'
  let mail = 'images/mail.svg'

  let letMessage = false

  function changeMessage() {
    console.log('message')
    letMessage = true
  }

  </script>

  <footer style="--theme-color: {mainColor}">
    <div>
      <a href="https://github.com/ViGo95"><img src={github} alt=""></a>
      <a href="https://linkedin.com/in/luis-viñas"><img src={linkedin} alt=""></a>
      <a href="https://twitter.com/Vi__Go"><img src={twitter} alt=""></a>
      <a href="https://www.instagram.com/vigo.dev/"><img src={instagram} alt=""></a>
      </div>

      {#if letMessage}
        <Message></Message>
      {/if}

  <button on:click="{changeMessage}">
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