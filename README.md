# poc-nodejs-news-feeder

### Usage

This project is a proof of concept of a news feeder using NodeJS. It uses the Github API to fetch the relevant information from issues, releases..and then it generates a RSS feed with the latest news.

The RSS feed is available at https://raw.githubusercontent.com/UlisesGascon/poc-nodejs-news-feeder/main/feed.xml

In order to update the RSS feed, you need to trigger the Github Action `Populate Feed` [manually](https://github.com/UlisesGascon/poc-nodejs-news-feeder/actions/workflows/populate_feed.yml) or wait for the CRON job.

This process will generate a PR with the latest news, so we can change the content and decide when to merge it.

### Development

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

### License

MIT License