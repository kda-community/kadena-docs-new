import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React from 'react';
import Layout from '@theme/Layout';
import { DocSearch } from '@docsearch/react';
import { Analytics } from "@vercel/analytics/react";
import Link from '@docusaurus/Link';


// HERO COMPONENT

function DocsHero() {

     return (

          <header className="home-header">

               <div className="home-header-gap left"></div>

               <div className="home-header-main">

                    <h1 className="home-header-title">Kadena Developer Documentation</h1>

                    <p className="home-header-excerpt">Kadena developer-focused documentation provides everything you need to start building for the Kadena blockchain, accelerate your development process, and deploy your applications on the Kadena network.</p>

                    <div className="home-header-algolia">

                         <DocSearch appId="6UVWQF4IS8" apiKey="b89b66367ee8fd13c34fb502b67609be" indexName="enterprise-kadena" />

                    </div>

               </div>

               <div className="home-header-gap right"></div>

          </header>

     );

}

// SECTIONS COMPONENT

interface GridItemProps {
     href: string;
     coverClass: string;
     label: string;
     summary: string;
}

function GridItem({ href, coverClass, label, summary }: GridItemProps) {

     return (

          <a className="home-main-sections-item" href={href}>

               <div className={`home-main-sections-item-cover ${coverClass}`}></div>

               <div className="home-main-sections-item-content">

                    <span className="home-main-sections-item-label">{label}</span>

                    <p className="home-main-sections-item-summary">{summary}</p>

               </div>

          </a>

     );

}

// GRID COMPONENT

function DocsGrid() {

     const gridItems = [
          { href: 'quickstart', coverClass: 'quick-start', label: 'Quick Start', summary: 'Start here to set up your development environment and build your first project.' },
          { href: 'api', coverClass: 'api-ref', label: 'API Reference', summary: 'Connect to API endpoints to interact with smart contracts and the Kadena blockchain network.' },
          { href: 'reference', coverClass: 'function-ref', label: 'Function Reference', summary: 'Get fast access to Pact built-in functions to perform many types of common programming tasks.' },
          { href: 'smart-contract-dev', coverClass: 'smart-contracts', label: 'Smart Contracts', summary: 'Learn how to write smart contracts using the Pact smart contract programming language.' },
          { href: 'guides', coverClass: 'howto-guides', label: 'How-To Guides', summary: 'Follow the examples in the how-to guides to learn patterns for how to perform common tasks.' },
          { href: 'resources', coverClass: 'resources', label: 'Resources', summary: 'Find resources to learn more about blockchain technology and being part of the Kadena community.' },
     ];

     return (

          <main className="home-main">

               <h2 className="home-section-heading">Let's get started</h2>

               <span className="home-section-excerpt">From introductory tutorials to comprehensive API documentation, we've got you covered.</span>

               <div className="home-main-sections">

                    {gridItems.map((item, index) => (

                         <GridItem
                              key={index}
                              href={item.href}
                              coverClass={item.coverClass}
                              label={item.label}
                              summary={item.summary}
                         />
                    ))}

               </div>
          {/*}
               <div className="home-main-academy">

                    <span className="home-main-academy-heading">Kadena Academy</span>

                    <p className="home-main-academy-summary">Browse modules and take courses to build your skill set using video demos, hands-on exercises, and sample projects.</p>

                    <a className="home-main-academy-link" href="https://academy.kadena.io" target="_blank" rel="noopener noreferrer">

                         Learn Today

                    </a>

               </div>
          */}
          </main>

     );

}

// LANDING PAGE

export default function Home(): JSX.Element {

     const {siteConfig} = useDocusaurusContext();

     return (

          <Layout
               title="Pact Smart Contracts & Chainweb PoW Blockchain"
               description="Discover everything you need to get started with Pact, our smart contract language, and Chainweb, our innovative Proof-of-Work blockchain.">

               <Analytics />

               <DocsHero />

               <DocsGrid />

          </Layout>

     );
}