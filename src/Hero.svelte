<script>

import Icon from '@iconify/svelte';
import bxlGithub from '@iconify/icons-bx/bxl-github';
import bxlLinkedin from '@iconify/icons-bx/bxl-linkedin';
import bxlTwitter from '@iconify/icons-bx/bxl-twitter';
import bxlInstagram from '@iconify/icons-bx/bxl-instagram';

</script>

<section>
  <!-- Foto presentacional y redes sociales -->
  <div class="photo-socials">
    <img src="images/photo.svg" alt="Presentation">
    <ul>
      <li><a target="__blank" href="https://github.com/ViGo95"><Icon icon={bxlGithub} width="22" color="#5E687E" /></a></li>
      <li><a target="__blank" href="https://www.linkedin.com/in/luis-vi%C3%B1as/"><Icon icon={bxlLinkedin} width="22" color="#5E687E" /></a></li>
      <li><a target="__blank" href="https://twitter.com/vigo_dev"><Icon icon={bxlTwitter} width="22" color="#5E687E" /></a></li>
      <li><a target="__blank" href="https://www.instagram.com/vigo.dev/"><Icon icon={bxlInstagram} width="22" color="#5E687E" /></a></li>
    </ul>
  </div>
  <!-- Un poco acerca de mi -->
  <div class="about">
    <h2 class="hi-text">Hi! ViGo here.</h2>
    <p class="tittle-text">Fullstack Developer & Network Admin</p>
    <p class="about-text">Comence mi carrera como Administrador de redes en un buen Data Center. Hace poco encontre
       el Desarrollo web y me apasione totalmente... Desde entonces me considero una combinacion de dos mundos.</p>
  </div>
  <!-- Botones de contacto -->
  <div class="buttons">
    <a href="/" class="button ws-button">Whatsapp me</a>
    <button class="button mail-button">Send a mail</button>
  </div>
</section>

<style>
  .photo-socials {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 28px 64px 0;
  }

  ul {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 144px;
    list-style: none;
  }

  .about {
    margin: 12px 28px 0;
  }

  .hi-text {
    font-size: 25px;
    color: #2F3640;
    margin: 0px 12px;
  }

  .tittle-text {
    font-size: 12px;
    color: #2F3640;
    margin: 2px 12px 0;
  }

  .about-text {
    font-size: 12px;
    color: #5E687E;
    margin: 16px 0 0;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    margin: 20px 28px 0;
  }

  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 144px;
    height: 56px;
    border-radius: 5px;
    border: solid #0097E6 1px;
    font-weight: bold;
  }

  .ws-button {
    border-color: #0097E6;
    background-color: transparent;
    color: #0097E6;
  }

  .mail-button {
    background-color: #0097E6;
    color: #F9FAFB;
  }
</style>