var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/vigo95/portfolio.git', // Update to point to your repository
        user: {
            name: 'Luis Viñas', // update to use your name
            email: 'rmvigo95@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)