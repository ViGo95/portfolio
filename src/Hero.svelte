<script>

import Icon from '@iconify/svelte';
import bxlGithub from '@iconify/icons-bx/bxl-github';
import bxlLinkedin from '@iconify/icons-bx/bxl-linkedin';
import bxlTwitter from '@iconify/icons-bx/bxl-twitter';
import bxlInstagram from '@iconify/icons-bx/bxl-instagram';

</script>

<section>
  <!-- Foto presentacional y redes sociales -->
  <div class="photo-socials flex justify-between items-center mx-16 mt-10">
    <img src="images/photo.svg" alt="Presentation">
    <ul class="flex flex-col justify-between h-36">
      <li><a href="/"><Icon icon={bxlGithub} width="22" color="#5E687E" /></a></li>
      <li><a href="/"><Icon icon={bxlLinkedin} width="22" color="#5E687E" /></a></li>
      <li><a href="/"><Icon icon={bxlTwitter} width="22" color="#5E687E" /></a></li>
      <li><a href="/"><Icon icon={bxlInstagram} width="22" color="#5E687E" /></a></li>
    </ul>
  </div>
  <!-- Un poco acerca de mi -->
  <div class="about mx-7 mt-3">
    <h2 class="hi-text text-3xl text-dark mx-3">Hi! ViGo here.</h2>
    <p class="tittle-text text-sm text-dark mx-3 mt-2">Fullstack Developer & Network Admin</p>
    <p class="about-text text-xs text-secondary mt-4">Comence mi carrera como Administrador de redes en un buen Data Center. Hace poco encontre
       el Desarrollo web y me apasione totalmente... Desde entonces me considero una combinacion de dos mundos.</p>
  </div>
  <!-- Botones de contacto -->
  <div class="buttons flex justify-between mx-7 mt-5">
    <button class="ws-button w-36 h-14 pt-4 border-2 border-decorate rounded-md text-center text-decorate font-bold">Whatsapp me</button>
    <button class="mail-button w-36 h-14 pt-4 bg-decorate rounded-md text-center text-light font-bold">Send a mail</button>
  </div>
</section>

<style>
  .photo-socials {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 40px 64px 0;
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

  button {
    width: 144px;
    height: 56px;
    border-radius: 5px;
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