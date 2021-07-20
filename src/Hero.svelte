<script>

import Icon from '@iconify/svelte';
import bxlGithub from '@iconify/icons-bx/bxl-github';
import bxlLinkedin from '@iconify/icons-bx/bxl-linkedin';
import bxlTwitter from '@iconify/icons-bx/bxl-twitter';
import bxlInstagram from '@iconify/icons-bx/bxl-instagram';

</script>

<section>
  <!-- Foto presentacional y redes sociales -->
  <div class="flex justify-between items-center mx-16 mt-10">
    <img src="images/photo.svg" alt="Presentation">
    <ul class="flex flex-col justify-between h-36">
      <li><a href="/"><Icon icon={bxlGithub} width="22" color="#5E687E" /></a></li>
      <li><a href="/"><Icon icon={bxlLinkedin} width="22" color="#5E687E" /></a></li>
      <li><a href="/"><Icon icon={bxlTwitter} width="22" color="#5E687E" /></a></li>
      <li><a href="/"><Icon icon={bxlInstagram} width="22" color="#5E687E" /></a></li>
    </ul>
  </div>
  <!-- Un poco acerca de mi -->
  <div class="mx-7 mt-3">
    <h2 class="text-3xl text-dark mx-3">Hi! ViGo here.</h2>
    <p class="text-sm text-dark mx-3 mt-2">Fullstack Developer & Network Admin</p>
    <p class="text-xs text-secondary mt-4">Comence mi carrera como Administrador de redes en un buen Data Center. Hace poco encontre
       el Desarrollo web y me apasione totalmente... Desde entonces me considero una combinacion de dos mundos.</p>
  </div>
  <!-- Botones de contacto -->
  <div class="flex justify-between mx-7 mt-5">
    <buttton class="w-36 h-14 pt-4 border-2 border-decorate rounded-md text-center text-decorate font-bold">Whatsapp me</buttton>
    <buttton class="w-36 h-14 pt-4 bg-decorate rounded-md text-center text-light font-bold">Send a mail</buttton>
  </div>
</section>