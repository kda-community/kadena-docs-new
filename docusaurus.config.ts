import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
     title: 'Kadena Docs',
     tagline: 'The Blockchain for Business',
     favicon: 'img/kadena-favicon.png',
     url: 'https://kda-chain.org/docs',
     baseUrl: '/docs',
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
                         routeBasePath: '/docs',
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
               appId: '6UVWQF4IS8',
               apiKey: 'b89b66367ee8fd13c34fb502b67609be',
               indexName: 'enterprise-kadena',

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
                    src: 'img/kadena-docs-light.png',
                    srcDark: 'img/kadena-docs-dark.png',
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
                    {
                         label: 'EVM Portal',
                         href: 'https://evm.kadena.io',
                         position: 'left',
                    },
                    {
                         label: 'Academy',
                         href: 'https://academy.kadena.io',
                         position: 'left',
                    },
                    {
                         label: 'Support',
                         href: 'https://discord.com/invite/kadena',
                         position: 'left'
                    },
                    {
                         href: 'https://github.com/kadena-io',
                         position: 'right',
                         className: 'github-link-icon'
                    },
               ],
               hideOnScroll: false,
               style: 'primary',
          },
          footer: {
               style: 'dark',
               copyright: `Copyright © ${new Date().getFullYear()} - Kadena LLC (<a href="https://www.kadena.io/privacy-policy" target="_blank">Privacy</a>)`,
          },
          prism: {
               additionalLanguages: ['lisp'],
               theme: prismThemes.github,
               darkTheme: prismThemes.dracula,
          },
     } satisfies Preset.ThemeConfig,
};

export default config;