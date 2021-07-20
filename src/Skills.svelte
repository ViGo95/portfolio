<script>


import Icon from '@iconify/svelte';
import svelteIcon from '@iconify/icons-file-icons/svelte';
import tailwindIcon from '@iconify/icons-file-icons/tailwind';
import bxlAngular from '@iconify/icons-bx/bxl-angular';
import bxlNodejs from '@iconify/icons-bx/bxl-nodejs';
import bxlGit from '@iconify/icons-bx/bxl-git';
import bxlFigma from '@iconify/icons-bx/bxl-figma';
import npmIcon from '@iconify/icons-gg/npm';

</script>

<section class="mx-6 mt-5 text-secondary">
  <h2 class="text-xl ml-6 mb-3">Skills</h2>

  <h3>Development</h3>
  <div class="flex justify-between mt-2 mb-5">
    <div class="flex justify-between items-center w-24">
      <a href="/">
        <Icon icon={svelteIcon} color="#5E687E" width="24" />
      </a>
      <div class=" w-16 h-2 border border-dark rounded">
        <div class=" bg-medium h-full w-2/3"></div>
      </div>
    </div>
    <div class="flex justify-between items-center w-24">
      <a href="/">
        <Icon icon={bxlAngular} color="#5E687E" width="32" />
      </a>
      <div class=" w-16 h-2 border border-dark rounded">
        <div class=" bg-medium h-full w-2/3"></div>
      </div>
    </div>
    <div class="flex justify-between items-center w-24">
      <a href="/">
        <Icon icon={bxlNodejs} color="#5E687E" width="32" />
      </a>
      <div class=" w-16 h-2 border border-dark rounded">
        <div class=" bg-good h-full w-4/5"></div>
      </div>
    </div>
  </div>

  <h3>Management</h3>
  <div class="flex justify-between mt-2 mb-5">
    <div class="flex justify-between items-center w-24">
      <a href="/">
        <Icon icon={bxlGit} color="#5E687E" width="32" />
      </a>
      <div class=" w-16 h-2 border border-dark rounded">
        <div class=" bg-good h-full w-10/12"></div>
      </div>
    </div>
    <div class="flex justify-between items-center w-24">
      <a href="/">
        <Icon icon={npmIcon} color="#5E687E" width="32" />
      </a>
      <div class=" w-16 h-2 border border-dark rounded">
        <div class=" bg-good h-full w-9/12"></div>
      </div>
    </div>
  </div>

  <h3>Design</h3>
  <div class="flex justify-between mt-2 mb-5">
    <div class="flex justify-between items-center w-24">
      <a href="/">
        <Icon icon={tailwindIcon} color="#5E687E" width="32" />
      </a>
      <div class=" w-16 h-2 border border-dark rounded">
        <div class=" bg-good h-full w-11/12"></div>
      </div>
    </div>
    <div class="flex justify-between items-center w-24">
      <a href="/">
        <Icon icon={bxlFigma} color="#5E687E" width="32" />
      </a>
      <div class=" w-16 h-2 border border-dark rounded">
        <div class=" bg-medium h-full w-2/3"></div>
      </div>
    </div>
  </div>
</section>