import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroContainer}>
        <img
          src="/img/mygame-playing.gif"
          alt="Playing the game"
          className={styles.heroGif}
        />
        <div className={styles.textOverlay}>
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          {/* <p className={styles.heroSubtitle}>{siteConfig.tagline}</p> */}
          <div className={styles.buttons}>
          <a
            className="button button--secondary button--lg"
            href="https://donnalikestocode.github.io/forPerry/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Play Here!
          </a>
          </div>
        </div>
      </div>
    </header>
  );
}


export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        {/* <HomepageFeatures /> */}
      </main>
    </Layout>
  );
}
