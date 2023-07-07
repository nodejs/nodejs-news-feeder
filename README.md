# Official Node.js News Feeder

### Usage

As the Node.js organization continues to grow and expand, it becomes increasingly difficult to keep track of all the ongoing projects, teams, and working groups. We've recognized this challenge and have been actively seeking solutions to improve communication and awareness within our community.

The RSS feed is available at https://nodejs.github.io/nodejs-news-feeder/feed.xml, optionally you can subscribe to the Slack channel `#nodejs-news-feeder` to receive the latest news.

In order to update the RSS feed, you need to trigger the Github Action `Populate Feed` [manually](https://github.com/nodejs/nodejs-news-feeder/actions/workflows/populate_feed.yml) or wait for the CRON job.

This process will generate a PR with the latest news, so we can change the content and decide when to merge it.

### How it works

![architecture overview](https://blog.ulisesgascon.com/_next/image?url=%2Fimg%2Farch-nodejs-news-feeder.png&w=1920&q=75)

1. The community creates releases and also generates content by replying to specific issues and discussions.
2. A GitHub Action, triggered by a cron job or manual input, collects issues/releases/discussions, processes, formats, validates, and stores all the new information as feed items.
3. The changes are then presented in a pull request, which is thoroughly reviewed by curators who ensure that the content meet our expectations, before is publicly available and promoted.
4. Once the changes are approved and included in the main branch, the updated content can be accessed by readers via a feed or a specific channel on Slack.

[More details](https://blog.ulisesgascon.com/nodejs-news-feeder)


### Development

```bash
git clone https://github.com/nodejs/nodejs-news-feeder
cd nodejs-news-feeder
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