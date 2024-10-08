import React from 'react';
import '../src/styles/styles.global.scss';
import type { AppProps } from 'next/app';

//
function MyApp({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}

export default MyApp;
