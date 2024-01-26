import { defineConfig } from 'vocs';

export default defineConfig({
  socials: [ 
    { 
      icon: 'github', 
      link: 'https://github.com/codeplot-co/codeplot', 
    }, 
    { 
      icon: 'x', 
      link: 'https://twitter.com/wevm_dev', 
    }, 
  ], 
 
  ogImageUrl: {
    '/': '/og-image.png'
  },
  font: {
    google: 'DM Mono'
  },
  title: '▱ codeplot / Docs',

iconUrl: {
  dark: '/favicon-dark.svg',
  light: '/favicon-light.svg'
},
logoUrl: { 
    
  light: '/logo-light.svg', 
      
  dark: '/logo-dark.svg' 
    }, 

    sidebar: {
      '/': [ 
        { 
          text: 'Home', 
          link: '/', 
        }, 
        { 
          text: 'Getting Started', 
          link: '/getting-started', 
        }, 
        { 
          text: 'Documentation', 
          collapsed: false, 
          items: [ 
            { 
              text: 'Installation', 
              link: '/docs/installation', 
            }, 
           
          ], 
        },      
        { 
          text: 'Community', 
          collapsed: false, 
          items: [ 
            { 
              text: 'Discord', 
              link: 'https://discord.gg/fYTsNp5Wvt', 
            }, 
            { 
              text: 'Github', 
              link: 'https://github.com/codeplot-co/codeplot', 
            }, 
           
          ], 
        } 
      ], 
    },
  // topNav: [ 
  //   { text: 'Posts', link: '/posts', match: '/posts' }, 
  // ], 
  theme: {
    accentColor: {
      dark: '#F9BE28',
      light: '#990f3d'	
    },
    variables: {
      color: {
        border: {
            // light: '#c6b7aa',
            dark: '#3B3B3B'
        },
        hr: {
          // light: '#e6d9ce',
          dark: '#3B3B3B'
        },
        background: {
          // light: '#fff1e5',
          dark: '#232225'
        },
        backgroundDark: {
          light: '#f2dfce',
          dark: '#1e1d1f'
        }
      },
      fontFamily: {
        default: 'DM Mono'
      },
      fontSize: {
      root: '14px',
    },
    fontWeight: {
      semibold: '600',
    }
  },
  }
})
