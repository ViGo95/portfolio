<script>

import Icon from '@iconify/svelte';
import svelteIcon from '@iconify/icons-file-icons/svelte';
import tailwindIcon from '@iconify/icons-file-icons/tailwind';
import bxlAngular from '@iconify/icons-bx/bxl-angular';
import bxlNodejs from '@iconify/icons-bx/bxl-nodejs';
import bxlGit from '@iconify/icons-bx/bxl-git';
import bxlFigma from '@iconify/icons-bx/bxl-figma';
import npmIcon from '@iconify/icons-gg/npm';
import Skill from './Skill.svelte';

let progressColor

let skillsMock = [
  {
    area: 'Development',
    skills: [
      {
        name: 'Svelte',
        progress: 65,
        logo: svelteIcon,
      },
      {
        name: 'Angular',
        progress: 60,
        logo: bxlAngular,
      },
      {
        name: 'NodeJs',
        progress: 80,
        logo: bxlNodejs,
      },
    ]
  },
  {
    area: 'Management',
    skills: [
      {
        name: 'Git',
        progress: 85,
        logo: bxlGit,
      },
      {
        name: 'NPM',
        progress: 75,
        logo: npmIcon,
      },
    ]
  },
  {
    area: 'Design',
    skills: [
      {
        name: 'Tailwind',
        progress: 80,
        logo: tailwindIcon,
      },
      {
        name: 'Figma',
        progress: 70,
        logo: bxlFigma,
      },
    ]
  },
]

</script>

<section class="skills-section">
  <h2 class="skills-text">Skills</h2>

  {#each skillsMock as skillArea}

    <h5>{skillArea.area}</h5>

    <div class="skills-area">
      {#each skillArea.skills as skill }
        <Skill
          logo={skill.logo}
          progress={skill.progress}
          progressColor={skill.progress <= 70
            ? progressColor = '#1CB12B'
            : progressColor = '#FF9F1A'} >
        </Skill>
      {/each}
    </div>

  {/each}
</section>

<style>
  .skills-section {
    margin: 20px 20px 0;
    color: #5E687E;
  }

  .skills-text {
    font-size: 22px;
    font-weight: normal;
    margin: 0 0 16px 24px;
  }

  h5 {
    font-weight: normal;
    margin: 0;
  }


  .skills-area {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-column: 3;
    grid-row: 3;
    grid-gap: 6.5%;
    justify-content: start;
    margin: 12px 0 20px 0;
  }

</style>