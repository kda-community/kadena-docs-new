import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
     title: 'Kadena Docs',
     tagline: 'The Blockchain for Business',
     favicon: 'img/kadena-favicon.svg',
     url: 'https://kda-chain.org/',
     baseUrl: '/docs/',
     trailingSlash: false,

     organizationName: 'kadena-docs',
     projectName: 'kadena-docs',

     i18n: {
          defaultLocale: 'en',
          locales: ['en'],
     },

     onBrokenLinks: 'throw',
     onBrokenAnchors: 'throw',
     onBrokenMarkdownLinks: 'throw',

     presets: [
          [
               'classic',
               {
                    docs: {
                         routeBasePath: '/',
                         sidebarPath: './sidebars.ts',
                         editUrl: 'https://github.com/kda-community/kadena-docs-new/blob/master/',
                    },
                    theme: {
                         customCss: './src/css/custom.css',
                    },
               } satisfies Preset.Options,
          ],
     ],

     themeConfig: {
          colorMode: {
               defaultMode: 'light',
               disableSwitch: false,
               respectPrefersColorScheme: true
          },
          announcementBar: {
               id: 'announcement_bar',
               content:
                    '⭐️ Welcome to the new Kadena Docs! <a target="_blank" rel="noopener noreferrer" href="https://github.com/kda-community/kadena-docs-new">Give us a star on GitHub</a>',
               backgroundColor: 'var(--k-action)',
               textColor: '#ffffff',
               isCloseable: true,
          },
          image: 'img/kadena-opengraph.png',
          tableOfContents: {
               minHeadingLevel: 2,
               maxHeadingLevel: 2
          },
          docs: {
               sidebar: {
                    hideable: true,
                    autoCollapseCategories: true,
               },
          },
          algolia: {
               appId: 'PPD6C361A0',
               apiKey: '3e775f41809b2bd0d8f7febb2d335427',
               indexName: 'Doc site',

               contextualSearch: true,
               externalUrlRegex: 'external\\.com|domain\\.com',
               searchParameters: {},
               searchPagePath: 'search',
               insights: false,
          },
          navbar: {
               title: '',
               logo: {
                    alt: 'Kadena Documentation',
                    src: 'img/kadena-docs-light.svg',
                    srcDark: 'img/kadena-docs-dark.svg',
                    width: 196,
                    height: 32,
               },
               items: [
                    {
                         type: 'docSidebar',
                         label: 'Get Started',
                         sidebarId: 'default',
                         position: 'left',
                    },
                    /*      {
                               label: 'EVM Portal',
                               href: 'https://evm.kadena.io',
                               position: 'left',
                          },
                          {
                               label: 'Academy',
                               href: 'https://academy.kadena.io',
                               position: 'left',
                          },*/
                    {
                         label: 'Support',
                         href: 'https://discord.com/invite/kadena',
                         position: 'left'
                    },
                    {
                         href: 'https://github.com/kda-community/',
                         position: 'right',
                         className: 'github-link-icon'
                    },
               ],
               hideOnScroll: false,
               style: 'primary',
          },
          footer: {
               style: 'dark',
               copyright: `Copyright © ${new Date().getFullYear()} - <a href="#" class="footer-brand-link">Kadena Community Edition</a>`,
          },
          prism: {
               additionalLanguages: ['lisp'],
               theme: prismThemes.github,
               darkTheme: prismThemes.dracula,
          },
     } satisfies Preset.ThemeConfig,
};

export default config;
