import { defineConfig } from 'vitepress'
import footnote from 'markdown-it-footnote'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Cloud computing",
    titleTemplate: 'CLO1 - :title',
    description: "Notes de cours",
    lang: 'fr-be',
    base: '/5clo1r',
    srcDir: './src',
    outDir: './public',
    lastUpdated: true,
    ignoreDeadLinks: true,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/index' }
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
                    { text: 'Organisation', link: '/organisation' },
                    { text: 'Slides', link: 'slides' },
                    { text: 'Sources', link: '/sources' }
                ]
            }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/esibru/5clo1r' }
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
