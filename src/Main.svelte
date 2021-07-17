<script>
  export let mainColor

  let arco = 'images/arco.svg'
  let photo = 'images/photo.svg'

  let heroPosition = 'mainPosition'
  let titlePosition = ''
  const devSkills = [
    {
      title: 'Svelte',
      url: 'https://svelte.dev/',
      image: ''
    },
    {
      title: 'NodeJS',
      url: 'https://nodejs.org/en/docs/',
      image: ''
    },
    {
      title: 'MongoDB',
      url: 'https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_footprint_row_search_core_brand_atlas_desktop&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624584',
      image: ''
    },
    {
      title: 'TailwindCSS',
      url: 'https://tailwindcss.com/',
      image: ''
    },
    {
      title: 'Figma',
      url: 'https://www.figma.com',
      image: ''
    },
  ]
  const netSkills = [
    {
      title: 'Fortinet',
      url: 'https://svelte.dev/',
      image: ''
    },
    {
      title: 'Cisco',
      url: 'https://nodejs.org/en/docs/',
      image: ''
    },
    {
      title: 'Ubiquiti',
      url: 'https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_footprint_row_search_core_brand_atlas_desktop&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624584',
      image: ''
    },
    {
      title: 'Cabling',
      url: 'https://tailwindcss.com/',
      image: ''
    },
    {
      title: 'Design',
      url: 'https://www.figma.com',
      image: ''
    },
  ]

  function webClick() {

    if (heroPosition != 'heroWebPosition') {

      heroPosition = 'heroWebPosition'
      titlePosition = 'margin-left: 200px'

    } else {

      heroPosition = 'mainPosition'
      titlePosition = ''

    }

  }

  function netClick() {

    if (heroPosition != 'heroNetPosition') {

      heroPosition = 'heroNetPosition'
      titlePosition = 'margin-right: 200px;'

    } else {

      heroPosition = 'mainPosition'
      titlePosition = ''

    }

  }
</script>

<main style="--theme-color: {mainColor}">

  {#if heroPosition != 'heroNetPosition'}

    <a class="heroTitle" href="#" on:click="{webClick}" style="{titlePosition}">Web Developer</a>

  {:else }

    <div class="skills">

      {#each netSkills as {title, url, image}}
        <a href="{url}" target="_blank"><img src="{image}" alt="{title}"></a>
      {/each}

    </div>
  {/if}

  <img class="ark {heroPosition}" src="{arco}" alt="">
  <img class="photo {heroPosition}" src="{photo}" alt="">

  {#if heroPosition != 'heroWebPosition'}

    <a class="heroTitle" href="#" on:click="{netClick}" style="{titlePosition}">Network Admin</a>

  {:else }

    <div class="skills">

      {#each devSkills as {title, url, image}}
        <a href="{url}" target="_blank"><img src="{image}" alt="{title}"></a>
      {/each}

    </div>

  {/if}

</main>

<style>
  * {
    color: var(--theme-color);
  }

  main {
    display: flex;
    justify-content: space-between;
    height: 50%;
    padding: 0 80px;
  }

  a {
    text-decoration: none;
    color: var(--theme-color);
    font-style: normal;
  }

  .heroTitle {
    text-decoration: none;
    color: var(--theme-color);
    font-style: normal;
    font-size: 32px;
    height: 50px;
  }

  .mainPosition {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: 0;
  }

  .heroWebPosition {
    position: absolute;
    left: 65%;
    transform: translate(-50%, 0);
    bottom: 0;
  }

  .heroNetPosition {
    position: absolute;
    left: 35%;
    transform: translate(-50%, 0);
    bottom: 0;
  }

  .skills {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .ark {
    height: 70%;
  }

  .photo {
    height: 78%;
  }
</style>