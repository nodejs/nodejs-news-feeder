import got from 'got'
import { buildRFC822Date, overwriteConfig, composeFeedItem, getFeedContent, overwriteFeedContent, getConfig, generateRetroRequestUrl, parseRetrospectiveContent, generateRetroUIUrl } from '../utils/index.js'

// Collect new retrospective
const { retrospective: currentConfig, breakDelimiter } = getConfig()
const url = generateRetroRequestUrl(currentConfig.nextDay)

try {
  const content = await got(url).text()
  const data = parseRetrospectiveContent(content)
  const retrospective = composeFeedItem({
    title: data.title,
    description: `<![CDATA[<p>${data.description}</p>]]>`,
    pubDate: buildRFC822Date(data.lastDay),
    link: generateRetroUIUrl(data.lastDay),
    guid: generateRetroUIUrl(data.lastDay)
  })
  // Add the new item to the feed
  const feedContent = getFeedContent()
  const [before, after] = feedContent.split(breakDelimiter)
  const updatedFeedContent = `${before}${breakDelimiter}${retrospective}${after}`
  overwriteFeedContent(updatedFeedContent)

  // Overwrite config with new dates
  const config = getConfig()
  overwriteConfig({
    ...config,
    retrospective: {
      lastDay: data.lastDay,
      nextDay: data.nextDay
    }
  })
} catch (error) {
  console.log("Retrospective not found or generated and error, so we're not updating the feed.")
  console.log("Configuration for the retrospective won't be updated either.")
}
