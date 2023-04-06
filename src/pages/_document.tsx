import React from 'react';
import {CssBaseline} from '@geist-ui/react';
import Document, {DocumentContext, Head, Html, Main, NextScript} from 'next/document';
import {ServerStyleSheet} from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    const styles = CssBaseline.flush();

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />)
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
            {styles}
          </>
        )
      };
    } finally {
      sheet.seal();
    }
  }

  renderSnippet() {
    return '';
  }

  render() {
    return (
      <Html>
        <Head>
          <script dangerouslySetInnerHTML={{__html: this.renderSnippet()}} />
        </Head>
        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    );
  }
}