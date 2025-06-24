import { defineConfig } from 'vitepress'
import footnote from 'markdown-it-footnote'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Cloud computing",
    titleTemplate: 'CLO1 - :title',
    description: "Notes de cours",
    lang: 'fr-be',
    base: '/cloudcomputing',
    srcDir: './src',
    outDir: './public',
    lastUpdated: true,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/index' },
            { text: 'Cours', link: '/' }
        ],

        sidebar: [
            {
                text: 'Cours',
                items: [
                    { text: 'À voir', link: '/index' },
                    
                ]
            },
            {
                text: '…',
                items: [
                    { text: 'Organisation', link: '/organisation' }            
                ]
            }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/pbettens/hypervirtualisation' }
        ],

        lastUpdated: {
            text: "Mise à jour le",
            formatOptions: {
                dateStyle: 'full',
                timeStyle: 'short'
            }
        },

        footer: {
            copyright: 'CC-BY 2025 ♥'
        },

        search: {
            provider: 'local'
        },

        outline: {
            level: [2, 3]  // Affiche les titres de niveau 2 et 3
        }
    },
    markdown: {
        container: {
            tipLabel: 'ASTUCE',
            warningLabel: 'REMARQUE',
            dangerLabel: 'ATTENTION',
            infoLabel: 'INFO',
            detailsLabel: 'Détails ⬇'
        },
        config: (md) => {
            md.use(footnote)
        }
    }
})
