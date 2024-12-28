import React from 'react';
import Head from 'next/head';
import PremiumVisaApp from '../components/PremiumVisaApp';

const SelectPage = () => {
  return (
    <>
      <Head>
        <title>ZipVisa - Simple Visa Applications</title>
        <meta name="description" content="Fast and reliable visa processing services worldwide" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <PremiumVisaApp />
    </>
  );
};

export default SelectPage;
