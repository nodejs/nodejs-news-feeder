import got from 'got'
import { buildRFC822Date, overwriteConfig, composeFeedItem, getFeedContent, overwriteFeedContent, getConfig, generateRetroRequestUrl, parseRetrospectiveContent, generateRetroUIUrl, getCurrentRetroDate, getNextRetroDate } from '../utils/index.js'

// Collect new retrospective
// Calculate the target date dynamically instead of using config.nextDay
// This ensures we always get the current week's retro, not sequentially catch up old ones
const { breakDelimiter } = getConfig()
const targetDate = getCurrentRetroDate()
const url = generateRetroRequestUrl(targetDate)

try {
  const content = await got(url).text()
  const data = parseRetrospectiveContent(content)

  // Use the calculated targetDate for dates instead of parsed dates from title
  // This makes the script robust against title format changes in retro-weekly
  const lastDay = targetDate
  const nextDay = getNextRetroDate(targetDate)

  const retrospective = composeFeedItem({
    title: data.title,
    description: `<![CDATA[<p>${data.description}</p>]]>`,
    pubDate: buildRFC822Date(lastDay),
    link: generateRetroUIUrl(lastDay),
    guid: generateRetroUIUrl(lastDay)
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
      lastDay,
      nextDay
    }
  })
} catch (error) {
  console.log("Retrospective not found or generated and error, so we're not updating the feed.")
  console.log("Configuration for the retrospective won't be updated either.")
}
