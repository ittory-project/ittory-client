import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App';

const app = express();

// 동적 라우트 핸들링
app.get('/receive/:letterId', (req, res) => {
  const { letterId } = req.params;

  const meta = {
    title: `Letter ${letterId}`,
    description: `Details for letter ${letterId}`,
    image: `https://your-domain.com/images/letter_${letterId}.png`,
    url: `https://your-domain.com/receive/${letterId}`,
  };

  const appHtml = ReactDOMServer.renderToString(<App />);

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${meta.title}</title>
        <meta property="og:title" content="${meta.title}" />
        <meta property="og:description" content="${meta.description}" />
        <meta property="og:image" content="${meta.image}" />
        <meta property="og:url" content="${meta.url}" />
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script src="/static/js/bundle.js"></script>
      </body>
    </html>
  `);
});

// 정적 파일 제공
app.use(express.static('build'));

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
