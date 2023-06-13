# poc-nodejs-news-feeder

#### Start

```bash
git clone https://github.com/UlisesGascon/poc-nodejs-news-feeder
cd poc-nodejs-news-feeder
nvm use
npm install
```


### Scripts

#### Code linter

```bash
npm run lint
npm run lint:fix
```

#### Testing

```bash
npm run test
npm run test:watch
npm run test:coverage
```

#### RSS formatter

Update the `feed.xml` file format

```bash
npm run rss:format-check
npm run rss:format
```

#### RSS Build

Update the `feed.xml` file with the latest news

```bash
npm run rss:build
```

#### RSS Validate

Check the current `feed.xml` against the https://validator.w3.org/feed/check.cgi

```bash
npm run rss:validate
```
